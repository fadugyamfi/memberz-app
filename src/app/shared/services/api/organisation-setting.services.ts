import { Injectable } from "@angular/core";
import { APIService } from "./api.service";
import { EventsService } from "../events.service";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../storage.service";
import { OrganisationService } from "./organisation.service";
import { OrganisationSetting } from "../../model/api/organisation-setting";

@Injectable({
  providedIn: "root",
})
export class OrganisationSettingService extends APIService<OrganisationSetting> {
  public orgSetting: OrganisationSetting;
  private orgSettingCacheKey: string = null;

  constructor(
    http: HttpClient,
    protected events: EventsService,
    protected storage: StorageService,
    private orgService: OrganisationService
  ) {
    super(http, events, storage);

    this.url = "/organisation_settings";
    this.model = OrganisationSetting;
    this.model_name = "OrganisationSetting";

    this.setOrgSettingCacheKey();
  }

  createSetting(value, organisation_setting_type_id) {
    const organisation = this.orgService.getActiveOrganisation();
    const organisation_id = organisation ? organisation.id : null;

    let postData = new OrganisationSetting({
      value,
      organisation_id,
      organisation_setting_type_id
    });

    this.create(postData);
  }

  updateSetting(id, value, organisation_setting_type_id) {
    const organisation = this.orgService.getActiveOrganisation();
    const organisation_id = organisation ? organisation.id : null;

    let postData = new OrganisationSetting({
      id,
      value,
      organisation_id,
      organisation_setting_type_id
    });

    this.update(postData);
  }

  setOrgSettingCacheKey(organisation_id = null) {
    if (!organisation_id) {
      const organisation = this.orgService.getActiveOrganisation();
      organisation_id = organisation ? organisation.id : null;
    }

    this.orgSettingCacheKey = `org_${organisation_id}__setting`;

    const params = { organisation_id, limit: 1 };

    return this.getAll(params).subscribe((orgSettings) => {
      this.cacheOrgSetting(orgSettings);
    });
  }

  refreshOrgSetting(organisation_id = null) {
    this.setOrgSettingCacheKey(organisation_id);
    this.events.trigger(`${this.model_name}:refresh`, this.orgSetting);
  }

  hasOrganisationAccount() {
    return this.storage.has(this.orgSettingCacheKey);
  }

  getOrganisationSetting() {
    return this.storage.get(this.orgSettingCacheKey);
  }

  cacheOrgSetting(orgSettings) {
    this.orgSetting = orgSettings[0];

    if (this.orgSetting) {
      this.storage.set(this.orgSettingCacheKey, this.orgSetting, 1, "days");
    }
  }
}

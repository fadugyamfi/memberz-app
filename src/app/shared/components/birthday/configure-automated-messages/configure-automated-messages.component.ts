import Swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { EventsService } from "../../../services/events.service";
import { UntypedFormGroup, UntypedFormControl, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { OrganisationSetting } from "../../../model/api/organisation-setting";
import { OrganisationSettingService } from "../../../services/api/organisation-setting.services";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    selector: "app-configure-automated-messages",
    templateUrl: "./configure-automated-messages.component.html",
    styleUrls: ["./configure-automated-messages.component.scss"],
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
    ],
})
export class ConfigureAutomatedMessagesComponent implements OnInit {
  public messageForm: UntypedFormGroup;
  public orgSetting: OrganisationSetting;
  public chars = 0;
  public messages = 0;

  constructor(
    public organisationSettingService: OrganisationSettingService,
    public events: EventsService
  ) {}

  ngOnInit(): void {
    this.fetchOrganisationSetting();
    this.setupMessageForm();
    this.setupEventListeners();
  }

  /**
   * Sets up the message form group and validations
   */
  setupMessageForm() {
    this.messageForm = new UntypedFormGroup({
      message: new UntypedFormControl("", Validators.required),
      oldMessage: new UntypedFormControl(
        this.orgSetting ? this.orgSetting.value : ""
      ),
    });
  }

  onSend(e: Event) {
    e.preventDefault();

    if (!this.messageForm.value.message) {
      return;
    }

    Swal.fire({
      title: "Submitting Configuration",
      text: "Submitting automated birthday message configuration.",
      icon: "info",
    });
    Swal.showLoading();

    if (!this.orgSetting) {
      return this.organisationSettingService.createSetting(
        this.messageForm.value.message,
        13
      );
    }

    this.organisationSettingService.updateSetting(
      this.orgSetting.id,
      this.messageForm.value.message,
      13
    );
  }

  setupEventListeners() {
    this.events.on("OrganisationSetting:created", (setting) => {
      this.fetchOrganisationSetting();
      this.organisationSettingService.refreshOrgSetting();
      Swal.close();
      this.messageForm.patchValue({oldMessage: this.messageForm.value.message, message: ''});
    });

    this.events.on("OrganisationSetting:updated", (setting) => {
      this.fetchOrganisationSetting();
      this.organisationSettingService.refreshOrgSetting();    
      Swal.close();
      this.messageForm.patchValue({oldMessage: this.messageForm.value.message, message: ''});
    });
  }

  fetchOrganisationSetting() {
    this.orgSetting = this.organisationSettingService.getOrganisationSetting();
  }

  trackChars(e: Event) {
    const target = e.target || e.currentTarget;
    this.chars = (target as HTMLInputElement).value.length;
    this.messages = Math.ceil(this.chars / 160);
  }
}

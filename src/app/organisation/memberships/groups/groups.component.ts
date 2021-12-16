import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageEvent } from '../../../shared/components/pagination/pagination.component';
import { OrganisationGroupType } from '../../../shared/model/api/orgainsation-group-type';
import { OrganisationGroup } from '../../../shared/model/api/organisation-group';
import { OrganisationGroupService } from '../../../shared/services/api/organisation-group.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {

  private subscriptions: Subscription[] = [];
  private _groupType: OrganisationGroupType;
  public groups: OrganisationGroup[] = [];

  constructor(
    public groupService: OrganisationGroupService
  ) { }

  ngOnInit() {
  }

  loadGroups(page = 1, limit = 10) {
    const sub = this.groupService.getAll({
      organisation_group_type_id: this.groupType?.id,
      count: ['organisationGroupMember'].join(),
      sort: 'name:asc',
      limit,
      page
    }).subscribe(groups => this.groups = groups);

    this.subscriptions.push(sub);
  }

  groupDataAvailable() {
    return !this.groupService.fetching && this.groups.length > 0;
  }

  noDataAvailable() {
    return !this.groupService.fetching && this.groups.length == 0;
  }

  @Input()
  set groupType(value: OrganisationGroupType) {
    this._groupType = value;

    if(value) {
      this.loadGroups();
    }
  }

  get groupType(): OrganisationGroupType {
    return this._groupType;
  }

  onPaginate(event: PageEvent) {
    this.loadGroups(event.page, event.limit);
  }
}

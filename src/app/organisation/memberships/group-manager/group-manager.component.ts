import { Component, OnInit } from '@angular/core';
import { OrganisationGroup } from '../../../shared/model/api/organisation-group';
import { OrganisationGroupType } from '../../../shared/model/api/organisation-group-type';
import { GroupTypesComponent } from './group-types/group-types.component';

import { GroupsComponent } from './groups/groups.component';
import { GroupMembersComponent } from './group-members/group-members.component';

@Component({
    selector: 'app-group-manager',
    templateUrl: './group-manager.component.html',
    styleUrls: ['./group-manager.component.scss'],
    standalone: true,
    imports: [GroupTypesComponent, GroupsComponent, GroupMembersComponent]
})
export class GroupManagerComponent implements OnInit {

  public selectedGroupType: OrganisationGroupType;
  public selectedGroup: OrganisationGroup;

  constructor() { }

  ngOnInit() {
  }

  setSelectedGroupType(groupType: OrganisationGroupType) {
    this.selectedGroupType = groupType;
    this.selectedGroup = null;
  }

  setSelectedGroup(group: OrganisationGroup) {
    this.selectedGroup = group;
  }
}

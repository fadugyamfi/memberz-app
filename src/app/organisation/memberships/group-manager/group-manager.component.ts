import { Component, OnInit } from '@angular/core';
import { OrganisationGroup } from '../../../shared/model/api/organisation-group';
import { OrganisationGroupType } from '../../../shared/model/api/organisation-group-type';

@Component({
  selector: 'app-group-manager',
  templateUrl: './group-manager.component.html',
  styleUrls: ['./group-manager.component.scss']
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

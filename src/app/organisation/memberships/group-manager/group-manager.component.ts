import { Component, OnInit } from '@angular/core';
import { OrganisationGroupType } from '../../../shared/model/api/orgainsation-group-type';

@Component({
  selector: 'app-group-manager',
  templateUrl: './group-manager.component.html',
  styleUrls: ['./group-manager.component.scss']
})
export class GroupManagerComponent implements OnInit {

  public selectedGroupType: OrganisationGroupType;

  constructor() { }

  ngOnInit() {
  }

  setSelectedGroupType(groupType: OrganisationGroupType) {
    this.selectedGroupType = groupType;
  }
}

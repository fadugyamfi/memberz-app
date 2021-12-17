import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { OrganisationGroupType } from '../../../../shared/model/api/orgainsation-group-type';
import { OrganisationGroupTypeService } from '../../../../shared/services/api/organisation-group-type.service';

@Component({
  selector: 'app-group-types',
  templateUrl: './group-types.component.html',
  styleUrls: ['./group-types.component.scss']
})
export class GroupTypesComponent implements OnInit {

  @Output() selectGroupType = new EventEmitter();

  public selectedGroupType: OrganisationGroupType;
  private subscriptions: Subscription[] = [];

  constructor(
    public groupTypeService: OrganisationGroupTypeService
  ) { }

  ngOnInit() {
    this.loadGroupTypes();
  }

  loadGroupTypes() {
    const sub = this.groupTypeService.getAll({ sort: 'name:asc' }).subscribe();
    this.subscriptions.push(sub);
  }

  setSelectedGroupType(groupType: OrganisationGroupType) {
    this.selectedGroupType = groupType;
    this.selectGroupType.emit(this.selectedGroupType);
  }
}

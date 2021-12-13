import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { OrganisationService } from '../../../../shared/services/api/organisation.service';
import { EventsService } from '../../../../shared/services/events.service';
import { SubscriptionTypeService } from '../../../../shared/services/api/subscription-type.service';
import { SubscriptionType } from '../../../../shared/model/api/subscription-type';

@Component({
  selector: 'app-subscription-step',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {

  public subTypes: SubscriptionType[];
  @Output() selectSubscription = new EventEmitter<SubscriptionType>();

  constructor(
    public events: EventsService,
    public organisationService: OrganisationService,
    public subTypeService: SubscriptionTypeService
  ) { }

  ngOnInit() {
    this.loadSubscriptionTypes();
  }

  loadSubscriptionTypes() {
    this.subTypeService.getAll({ contain: 'currency', active: 1 }).subscribe((subTypes: SubscriptionType[]) => this.subTypes = subTypes);
  }

  saveSubscriptionType(name: string) {
    const subType = this.subTypes.find(subType => subType.name == name);

    this.selectSubscription.emit(subType);

    this.subTypeService.setSelectedModel(subType);
  }
}

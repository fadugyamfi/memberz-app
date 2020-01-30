import { Component, OnInit } from '@angular/core';
import { EventsService } from '../../../shared/services/events.service';
import { StorageService } from '../../../shared/services/storage.service';
import { Organisation } from '../../../shared/model/cakeapi/organisation';
import { OrganisationService } from '../../../shared/services/cakeapi/organisation.service';

@Component({
  selector: 'app-subscription-status',
  templateUrl: './subscription-status.component.html',
  styleUrls: ['./subscription-status.component.scss']
})
export class SubscriptionStatusComponent implements OnInit {

  public organisation: Organisation;

  constructor(
    public events: EventsService,
    public storage: StorageService,
    public organisationService: OrganisationService
  ) { }

  ngOnInit() {
    this.organisation = this.organisationService.getActiveOrganisation();
    console.log(this.organisation);
  }

}

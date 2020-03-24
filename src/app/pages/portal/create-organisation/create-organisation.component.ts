import { Component, OnInit, ViewChild } from '@angular/core';
import { WizardComponent } from 'angular-archwizard';
import { Organisation } from '../../../shared/model/cakeapi/organisation';
import { OrganisationService } from '../../../shared/services/cakeapi/organisation.service';
import { SubscriptionType } from '../../../shared/model/cakeapi/subscription-type';
import Swal from 'sweetalert2';
import { EventsService } from '../../../shared/services/events.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-organisation',
  templateUrl: './create-organisation.component.html',
  styleUrls: ['./create-organisation.component.scss']
})
export class CreateOrganisationComponent implements OnInit {

  @ViewChild('wizard', { static: true })
  public wizard: WizardComponent;

  public organisation: Organisation;
  public subscriptionType: SubscriptionType;

  constructor(
    public events: EventsService,
    public organisationService: OrganisationService,
    public router: Router
  ) { }

  ngOnInit() {
    this.setupEvents();
  }

  setupEvents() {
    this.events.on('Organisation:created', () => {
      Swal.close();
      this.router.navigate(['/portal/home']);
    });

    this.events.on('OrganisationSubscription:created', () => {

    });
  }

  onSaveProfile(organisation: Organisation) {
    this.organisation = organisation;
  }

  onSelectSubscriptionType(subscriptionType: SubscriptionType) {
    this.subscriptionType = subscriptionType;
    this.organisation = Object.assign(this.organisation, {
      subscription_length: 1,
      subscription_type_id: this.subscriptionType.id
    });
  }

  onSavePayment(data) {
    this.organisation = Object.assign(this.organisation, data);
  }

  createOrganisation() {
    Swal.fire('Creating Organisation', 'Please wait as your new organisation is setup', 'info');
    Swal.showLoading();

    this.organisationService.create(this.organisation);
  }
}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Organisation } from '../../../../shared/model/api/organisation';
import { OrganisationService } from '../../../../shared/services/api/organisation.service';
import { Subscription } from 'rxjs';
import { SubscriptionType } from '../../../../shared/model/api/subscription-type';
import { EventsService } from '../../../../shared/services/events.service';
import { SubscriptionTypeService } from '../../../../shared/services/api/subscription-type.service';
import { OrganisationSubscriptionService } from '../../../../shared/services/api/organisation-subscription.service';
import { OrganisationSubscription } from '../../../../shared/model/api/organisation-subscription';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-review-step',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {

  private _organisation: Organisation;
  public subscriptionType: SubscriptionType;
  public policyAccepted = false;

  @Output() reviewCompleted = new EventEmitter();

  constructor(
    public organisationService: OrganisationService,
    public subTypeService: SubscriptionTypeService,
  ) { }

  ngOnInit() {
    this.loadPrivacyPolicy();
  }

  loadPrivacyPolicy() {
    var loader = function () {
      var s = document.createElement("script"),
        tag = document.getElementsByTagName("script")[0];
      s.src = "//cdn.iubenda.com/iubenda.js";
      tag.parentNode.insertBefore(s, tag);
    };

    loader();
  }

  canEnter() {
    return this.organisationService.getSelectedModel() != null;
  }

  loadData() {
    this.organisation = this.organisationService.getSelectedModel();
  }

  @Input()
  set organisation(value: Organisation) {
    this._organisation = value;
  }

  get organisation(): Organisation {
    return this._organisation;
  }

  completeReview() {
    this.reviewCompleted.emit();
  }
}

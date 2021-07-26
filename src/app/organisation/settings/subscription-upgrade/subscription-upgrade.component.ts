import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OrganisationSubscription } from '../../../shared/model/api/organisation-subscription';
import { Subscription, Observable } from 'rxjs';
import { EventsService } from '../../../shared/services/events.service';
import { OrganisationService } from '../../../shared/services/api/organisation.service';
import { OrganisationSubscriptionService } from '../../../shared/services/api/organisation-subscription.service';
import { Router } from '@angular/router';
import { SlydepayWrapperService } from '../../../shared/services/slydepay-wrapper.service';
import Swal from 'sweetalert2';
import { SubscriptionTypeService } from '../../../shared/services/api/subscription-type.service';
import { SubscriptionType } from '../../../shared/model/api/subscription-type';

@Component({
  selector: 'app-subscription-upgrade',
  templateUrl: './subscription-upgrade.component.html',
  styleUrls: ['./subscription-upgrade.component.scss']
})
export class SubscriptionUpgradeComponent implements OnInit, OnDestroy {

  public subscriptionForm: FormGroup;
  public activeSubscription: OrganisationSubscription;
  public subs: Subscription[] = [];
  public subscriptionTypes: SubscriptionType[];

  constructor(
    public events: EventsService,
    public organisationService: OrganisationService,
    public subscriptionService: OrganisationSubscriptionService,
    public subscriptionTypeService: SubscriptionTypeService,
    public router: Router,
    public slydepayWrapper: SlydepayWrapperService
  ) {}

  ngOnInit() {
    this.loadSubscriptionTypes();
    this.setupForm();
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  loadSubscriptionTypes() {
    const organisation = this.organisationService.getActiveOrganisation();
    const subscription = organisation.active_subscription;
    this.subscriptionTypeService.getTypesUpradeableFrom(subscription.subscription_type_id).subscribe(
      (subscriptionTypes) => {
        this.subscriptionTypes = subscriptionTypes.filter(s => s.initial_price > subscription.subscription_type.initial_price);
      }
    );
  }

  setupForm() {
    const organisation = this.organisationService.getActiveOrganisation();
    this.activeSubscription = organisation.active_subscription;

    this.subscriptionForm = new FormGroup({
      subscription_type_name: new FormControl(
        this.activeSubscription.subscription_type.description
      ),
      subscription_type_id: new FormControl('', [Validators.required]),
      organisation_subscription_id: new FormControl(this.activeSubscription.id),
      length: new FormControl('', [Validators.required]),
      next_upgrade_date: new FormControl(),
      subscription_cost: new FormControl(),
      payment_method: new FormControl('slydepay', [Validators.required])
    });

    this.subscriptionForm.controls.length.valueChanges.subscribe(value => {
      this.calculateUpgradeInfo(value, null);
    });

    this.subscriptionForm.controls.subscription_type_id.valueChanges.subscribe(value => {
      this.calculateUpgradeInfo(null, value);
    });

    this.subscriptionForm.patchValue({ length: 1 });
  }

  /**
   * Calculates the pricing and renewal date of the subscription
   *
   * @param length the number of months for the subscription
   * @param type_id the id of the subscription type
   */
  calculateUpgradeInfo(length, type_id = null) {
    const sub_length = parseInt(length || this.subscriptionForm.value['length'], 10);
    const subscription_type_id = parseInt(type_id || this.subscriptionForm.value['subscription_type_id'], 10);

    if ( !this.subscriptionTypes || !subscription_type_id ) {
      return;
    }

    const subscription_type = this.subscriptionTypes.find(s => s.id === subscription_type_id );

    const newSubscription = new OrganisationSubscription({ subscription_type_id, subscription_type });
    const nextUpgradeDate = newSubscription.nextRenewalDate(sub_length);
    const upgradeCost = newSubscription.nextRenewalCost(sub_length);

    this.subscriptionForm.patchValue({
      next_upgrade_date: nextUpgradeDate.format('MMM DD, YYYY'),
      subscription_cost: upgradeCost.toFixed(2)
    });
  }

  /**
   * Upgrades the subscription to the next level
   */
  upgradeSubscription() {
    const params = this.subscriptionForm.value;
    let message = `This action will upgrade your subscription and generate an invoice for payment`;

    if ( params.payment_method !== 'invoice' ) {
      message = `This action will upgrade your subscription, generate an invoice for payment and
                 redirect you to the chosen payment gateway to complete the payment process`;
    }

    Swal.fire({
      icon: 'warning',
      title: 'Ugrading Subscription',
      text: message,
      showCancelButton: true,
      cancelButtonColor: '#933'
    }).then(action => {
      if (action.value) {
        Swal.fire('Ugrading Subscription', 'Please wait as subscription is upgraded', 'info');
        Swal.showLoading();

        const sub = this.subscriptionService
          .upgrade(params.organisation_subscription_id, params.subscription_type_id, params.length)
          .subscribe(result => {
            this.updateOrganisationSubscription(result);
            if ( params.payment_method === 'slydepay' ) {
              this.createSlydepayInvoice(result);
            } else {
              this.notifyAndRedirect();
            }
          });

        this.subs.push(sub);
      }
    });
  }

  updateOrganisationSubscription(subscription: OrganisationSubscription) {
    const organisation = this.organisationService.getActiveOrganisation();
    organisation.active_subscription = subscription;
    this.organisationService.setActiveOrganisation(organisation);
  }

  createSlydepayInvoice(subscription: OrganisationSubscription) {
    this.slydepayWrapper.payInvoice(subscription.organisation_invoice);
  }

  notifyAndRedirect() {
    Swal.fire(
      'Subscription Upgrade Initiated',
      'An invoice for the payment has been generated and sent to your email',
      'info'
    ).then(() => this.router.navigate(['/organisation/settings/subscription']) );
  }

  cancelUpgrade() {
    this.router.navigate(['/organisation/settings/subscription']);
  }

}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrganisationSubscription } from '../../../shared/model/api/organisation-subscription';
import { Subscription, Observable } from 'rxjs';
import { EventsService } from '../../../shared/services/events.service';
import { OrganisationService } from '../../../shared/services/api/organisation.service';
import { OrganisationSubscriptionService } from '../../../shared/services/api/organisation-subscription.service';
import { Router } from '@angular/router';
// import { SlydepayWrapperService } from '../../../shared/services/slydepay-wrapper.service';
import Swal from 'sweetalert2';
import { SubscriptionTypeService } from '../../../shared/services/api/subscription-type.service';
import { SubscriptionType } from '../../../shared/model/api/subscription-type';
import { TranslateService, TranslateModule } from '@ngx-translate/core';


@Component({
    selector: 'app-subscription-upgrade',
    templateUrl: './subscription-upgrade.component.html',
    styleUrls: ['./subscription-upgrade.component.scss'],
    imports: [FormsModule, ReactiveFormsModule, TranslateModule]
})
export class SubscriptionUpgradeComponent implements OnInit, OnDestroy {

  public subscriptionForm: UntypedFormGroup;
  public activeSubscription: OrganisationSubscription;
  public subs: Subscription[] = [];
  public subscriptionTypes: SubscriptionType[];

  constructor(
    public events: EventsService,
    public organisationService: OrganisationService,
    public subscriptionService: OrganisationSubscriptionService,
    public subscriptionTypeService: SubscriptionTypeService,
    public router: Router,
    // public slydepayWrapper: SlydepayWrapperService,
    public translate: TranslateService
  ) {}

  ngOnInit() {
    this.loadSubscriptionTypes();
    this.setupForm();
    this.setupSlydepayEventListeners();
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
    this.removeSlydepayEventListeners();
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

    this.subscriptionForm = new UntypedFormGroup({
      organisation_id: new UntypedFormControl( organisation.id ),
      subscription_type_name: new UntypedFormControl(
        this.activeSubscription.subscription_type.description
      ),
      subscription_type_id: new UntypedFormControl('', [Validators.required]),
      organisation_subscription_id: new UntypedFormControl(this.activeSubscription.id),
      length: new UntypedFormControl('', [Validators.required]),
      next_upgrade_date: new UntypedFormControl(),
      subscription_cost: new UntypedFormControl(),
      payment_method: new UntypedFormControl('invoice', [Validators.required])
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
    const sub_length = parseInt(length || this.subscriptionForm.value.length, 10);
    const subscription_type_id = parseInt(type_id || this.subscriptionForm.value.subscription_type_id, 10);

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

  setupSlydepayEventListeners() {
    this.events.on('slydepay:payment:completion:success',   () => this.redirectToSubscriptions() );
    this.events.on('slydepay:payment:completion:failed',    () => this.redirectToSubscriptions() );
    this.events.on('slydepay:payment:cancellation:success', () => this.redirectToSubscriptions() );
    this.events.on('slydepay:payment:cancellation:failed',  () => this.redirectToSubscriptions() );
  }

  removeSlydepayEventListeners() {
    this.events.off('slydepay:payment:completion:success');
    this.events.off('slydepay:payment:completion:failed');
    this.events.off('slydepay:payment:cancellation:success');
    this.events.off('slydepay:payment:cancellation:failed');
  }

  /**
   * Upgrades the subscription to the next level
   */
  upgradeSubscription() {
    const params = this.subscriptionForm.value;
    // let message = this.translate.instant(`This action will upgrade your subscription and generate an invoice for payment`);

    // if ( params.payment_method !== 'invoice' ) {
    //   message = this.translate.instant(`This action will upgrade your subscription, generate an invoice for payment and redirect you to the chosen payment gateway to complete the payment process`);
    // }

    Swal.fire(
      this.translate.instant('Ugrading Subscription'),
      this.translate.instant('Please wait as subscription is upgraded'),
      'info'
    );
    Swal.showLoading();

    const sub = this.subscriptionService
      .upgrade(
        params.organisation_id,
        params.organisation_subscription_id,
        params.subscription_type_id,
        params.length
      )
      .subscribe(result => {
        Swal.close();
        this.updateOrganisationSubscription(result);
        if ( params.payment_method === 'slydepay' ) {
          this.createSlydepayInvoice(result);
        } else {
          this.notifyAndRedirect(result);
        }
      });

    this.subs.push(sub);

    // Swal.fire({
    //   icon: 'warning',
    //   title: this.translate.instant('Ugrading Subscription'),
    //   text: message,
    //   showCancelButton: true,
    //   cancelButtonColor: '#933'
    // }).then(action => {
    //   if (action.value) {

    //   }
    // });
  }

  updateOrganisationSubscription(subscription: OrganisationSubscription) {
    const organisation = this.organisationService.getActiveOrganisation();
    organisation.active_subscription = subscription;
    this.organisationService.setActiveOrganisation(organisation);
  }

  createSlydepayInvoice(subscription: OrganisationSubscription) {
    // this.slydepayWrapper.payInvoice(subscription.organisation_invoice);
  }

  notifyAndRedirect(subscription: OrganisationSubscription) {
    this.router.navigate([`/organisation/settings/invoice-payment/${subscription.organisation_invoice_id}`])
    // Swal.fire(
    //   this.translate.instant('Subscription Upgrade Initiated'),
    //   this.translate.instant('An invoice for the payment has been generated and sent to your email'),
    //   'info'
    // ).then(() => this.router.navigate(['/organisation/settings/subscription']) );
  }

  cancelUpgrade() {
    this.router.navigate(['/organisation/settings/subscription']);
  }

  redirectToSubscriptions() {
    this.router.navigate(['/organisation/settings/subscription']);
  }
}

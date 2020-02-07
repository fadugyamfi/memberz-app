import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EventsService } from '../../../shared/services/events.service';
import { OrganisationService } from '../../../shared/services/cakeapi/organisation.service';
import { OrganisationSubscriptionService } from '../../../shared/services/cakeapi/organisation-subscription.service';
import { OrganisationSubscription } from '../../../shared/model/cakeapi/organisation-subscription';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { SlydepayService } from 'slydepay-angular';
import { OrganisationInvoiceItem } from '../../../shared/model/cakeapi/organisation-invoice-item';

@Component({
  selector: 'app-subscription-renewal',
  templateUrl: './subscription-renewal.component.html',
  styleUrls: ['./subscription-renewal.component.scss']
})
export class SubscriptionRenewalComponent implements OnInit, OnDestroy {
  public subscriptionForm: FormGroup;
  public activeSubscription: OrganisationSubscription;
  public subs: Subscription[] = [];

  constructor(
    public events: EventsService,
    public organisationService: OrganisationService,
    public subscriptionService: OrganisationSubscriptionService,
    public router: Router,
    public slydepayService: SlydepayService
  ) {}

  ngOnInit() {
    this.setupForm();
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  setupForm() {
    const organisation = this.organisationService.getActiveOrganisation();
    this.activeSubscription = organisation.active_subscription;

    this.subscriptionForm = new FormGroup({
      subscription_type_name: new FormControl(
        this.activeSubscription.subscription_type.description
      ),
      subscription_type_id: new FormControl(
        this.activeSubscription.subscription_type_id,
        [Validators.required]
      ),
      organisation_subscription_id: new FormControl(this.activeSubscription.id),
      length: new FormControl('', [Validators.required]),
      next_renewal_date: new FormControl(),
      subscription_cost: new FormControl(),
      payment_method: new FormControl('slydepay', [Validators.required])
    });

    this.subscriptionForm.controls.length.valueChanges.subscribe(value => {
      this.calculateRenewalInfo(+value);
    });

    this.subscriptionForm.patchValue({ length: 1 });
  }

  calculateRenewalInfo(sub_length: number) {
    const nextRenewalDate = this.activeSubscription.nextRenewalDate(sub_length);
    const renewalCost = this.activeSubscription.nextRenewalCost(sub_length);

    this.subscriptionForm.patchValue({
      next_renewal_date: nextRenewalDate.format('MMM DD, YYYY'),
      subscription_cost: renewalCost.toFixed(2)
    });
  }

  renewSubscription() {
    const params = this.subscriptionForm.value;
    let message = `This action will renew your subscription and generate an invoice for payment`;

    if ( params.payment_method !== 'invoice' ) {
      message = `This action will renew your subscription, generate an invoice for payment and
                 redirect you to the chosen payment gateway to complete the payment process`;
    }

    Swal.fire({
      type: 'warning',
      title: 'Renewing Subscription',
      text: message,
      showCancelButton: true,
      cancelButtonColor: '#933'
    }).then(action => {
      if (action.value) {
        Swal.fire('Renewing Subscription', 'Please wait as subscription is renewed', 'info');
        Swal.showLoading();

        const sub = this.subscriptionService
          .renew(params.organisation_subscription_id, params.length)
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
    Swal.fire('Creating Payment Invoice', 'Please wait as invoice for payment is generated', 'info');
    Swal.showLoading();

    const invoice = subscription.organisation_invoice;
    const orderItems = invoice.organisation_invoice_item.map((item: OrganisationInvoiceItem) => {
      return {
          itemCode: `${item.product_id}`,
          itemName: item.description,
          quantity: item.qty,
          subTotal: item.total,
          unitPrice: item.unit_price
      };
    });

    this.slydepayService.createInvoice({
      amount: invoice.total_due,
      orderCode: invoice.invoice_no,
      descritpion: invoice.transaction_type.name,
      orderItems: orderItems
    }).subscribe(response => this.redirectToPayLive(response.result));
  }

  redirectToPayLive(result) {
    Swal.fire('Redirecting to Gateway', 'Redirecting to Slydepay Payment Gateway to complete transaction. Please wait...', 'info');
    Swal.showLoading();

    this.slydepayService.redirectToPayLive( result.payToken, window.location.href);
  }

  notifyAndRedirect() {
    Swal.fire(
      'Subscription Renewal Initiated',
      'An invoice for the payment has been generated and sent to your email',
      'info'
    ).then(() => this.router.navigate(['/organisation/settings/subscription']) );
  }

  cancelRenewal() {
    this.router.navigate(['/organisation/settings/subscription']);
  }
}

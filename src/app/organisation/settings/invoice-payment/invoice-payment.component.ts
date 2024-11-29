import { Component, OnInit } from '@angular/core';
import { EventsService } from '../../../shared/services/events.service';
import { OrganisationService } from '../../../shared/services/api/organisation.service';
import { OrganisationSubscriptionService } from '../../../shared/services/api/organisation-subscription.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormGroup, UntypedFormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrganisationSubscription } from '../../../shared/model/api/organisation-subscription';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { OrganisationInvoiceService } from '../../../shared/services/api/organisation-invoice.service';
import { OrganisationInvoice } from '../../../shared/model/api/organisation-invoice';
// import { SlydepayWrapperService } from '../../../shared/services/slydepay-wrapper.service';
import { PaystackOptions, Angular4PaystackModule } from 'angular4-paystack';
import { AuthService } from '../../../shared/services/api/auth.service';
import { SmsAccountService } from '../../../shared/services/api/sms-account.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-invoice-payment',
    templateUrl: './invoice-payment.component.html',
    styleUrls: ['./invoice-payment.component.scss'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, Angular4PaystackModule, TranslateModule]
})
export class InvoicePaymentComponent implements OnInit {

  public subscriptionForm: UntypedFormGroup;
  public activeSubscription: OrganisationSubscription;
  public subs: Subscription[] = [];
  private invoice_id: number;
  private invoice: OrganisationInvoice;
  reference = '';
  title = '';

  options: PaystackOptions = {
    amount: 50000,
    email: 'user@mail.com',
    ref: `${Math.ceil(Math.random() * 10e10)}`
  }

  constructor(
    public events: EventsService,
    public organisationService: OrganisationService,
    public subscriptionService: OrganisationSubscriptionService,
    public invoiceService: OrganisationInvoiceService,
    public router: Router,
    // public slydepayWrapper: SlydepayWrapperService,
    public route: ActivatedRoute,
    public authService: AuthService,
    public smsAccountService: SmsAccountService,
    public translate: TranslateService
  ) { }

  ngOnInit() {
    this.setupForm();
    this.fetchInvoice();
    this.setupPaymentEvents();
    this.reference = `ref-${Math.ceil(Math.random() * 10e13)}`;
  }

  setupForm() {
    const organisation = this.organisationService.getActiveOrganisation();
    this.activeSubscription = organisation.active_subscription;

    this.subscriptionForm = new UntypedFormGroup({
      transaction_type_name: new UntypedFormControl(),
      invoice_no: new UntypedFormControl('', [Validators.required]),
      total_due: new UntypedFormControl(),
      payment_method: new UntypedFormControl('slydepay', [Validators.required])
    });
  }

  setupPaymentEvents() {
    this.events.on('OrganisationInvoice:updated', (invoice: OrganisationInvoice) => {
      if ( invoice.paid ) {
        this.organisationService.refreshActiveOrganisation();
        setTimeout(() => {
          Swal.close();
          this.handleRedirect()
        }, 1000);
      }
    });

    this.events.on('OrganisationInvoice:updated:error', () => {
      this.handleRedirect();
    });
  }

  fetchInvoice() {
    this.invoice_id = +this.route.snapshot.paramMap.get('id');

    this.invoiceService.getById(this.invoice_id).subscribe((invoice: OrganisationInvoice) => {
      this.invoice = invoice;
      this.subscriptionForm.patchValue({
        transaction_type_name: invoice.transaction_type.name,
        invoice_no: invoice.invoice_no,
        total_due: invoice.total_due.toFixed(2)
      });

      this.reference = invoice.invoice_no;
      this.setPaystackOptions();
    });
  }

  setPaystackOptions() {
    this.options = Object.assign(this.options, {
      ref: this.invoice.invoice_no,
      amount: this.invoice.total_due * 100,
      email: this.authService.getLoggedInUser()?.username,
      channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money'],
      currency: this.invoice.currency.currency_code || 'GHS'
    })
  }

  /**
   * @deprecated
   */
  // paySubscription() {
  //   this.slydepayWrapper.payInvoice(this.invoice);
  // }

  cancelPayment() {
    Swal.fire({
      title: 'Cancel Payment',
      text: 'Are you sure you want to cancel the payment process?',
      icon: 'warning',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      showCancelButton: true
    }).then(action => {
      if (action.value) {
        this.handleRedirect();
      }
    });
  }

  redirectToSubscriptionHistory() {
    this.router.navigate(['/organisation/settings/subscription']);
  }

  paymentInit() {
    console.log('Payment initialized');
  }

  paymentDone(ref: any) {
    this.title = 'Payment successful';
    console.log(this.title, ref);

    Swal.fire(
      this.translate.instant('Completing Transaction'),
      this.translate.instant('Please wait as the transaction is processed'),
      'info'
    );
    Swal.showLoading();

    this.invoice.paid = true;
    this.invoiceService.update(this.invoice);
  }

  paymentCancel() {
    console.log('payment failed');
  }

  handleRedirect() {
    if( ['Subscription Upgrade', 'Subscription Renewal', 'Subscription Purchase'].includes(this.invoice.transaction_type?.name) ) {
      return this.redirectToSubscriptions();
    }

    if( this.invoice.transaction_type.name == 'SMS Credit Topup' ) {
      return this.redirectToSmsDashboard();
    }
  }

  redirectToSubscriptions() {
    this.router.navigate(['/organisation/settings/subscription']);
  }

  redirectToSmsDashboard() {
    this.smsAccountService.refreshAccount();
    this.router.navigate(['/organisation/messaging/settings']);
  }
}

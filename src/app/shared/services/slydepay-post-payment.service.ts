import { Injectable } from '@angular/core';
// import { SlydepayService } from 'slydepay-angular';
import { OrganisationInvoice } from '../model/api/organisation-invoice';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EventsService } from './events.service';
import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';
import { SmsAccountService } from './api/sms-account.service';

const CACHE_INVOICE_KEY = 'slydepay_payment_invoice';

@Injectable({
  providedIn: 'root'
})
export class SlydepayPostPaymentService {

  public invoice: OrganisationInvoice;

  constructor(
    // private slydepayService: SlydepayService,
    private router: Router,
    public translate: TranslateService,
    public events: EventsService,
    public storage: StorageService,
    public smsAccountService: SmsAccountService
  ) {
    // if( environment.slydepay.mode != 'live' ) {
    //   this.slydepayService.setMockMode();
    // }

    this.loadCachedInvoice();
  }

  cacheInvoiceForPostPaymentProcessing(invoice: OrganisationInvoice) {
    this.storage.set(CACHE_INVOICE_KEY, invoice);
  }

  loadCachedInvoice() {
    if( !this.storage.has(CACHE_INVOICE_KEY) ) {
      return;
    }

    this.invoice = new OrganisationInvoice( this.storage.get(CACHE_INVOICE_KEY) );
  }

  handlePaymentSuccess() {
    if( ['Subscription Upgrade', 'Subscription Renewal', 'Subscription Purchase'].includes(this.invoice.transaction_type?.name) ) {
      return this.redirectToSubscriptions();
    }

    if( this.invoice.transaction_type.name == 'SMS Credit Topup' ) {
      return this.redirectToSmsDashboard();
    }
  }

  handleCancelSuccess() {
    if( ['Subscription Upgrade', 'Subscription Renewal', 'Subscription Purchase'].includes(this.invoice.transaction_type?.name) ) {
      return this.redirectToSubscriptions();
    }

    if( this.invoice.transaction_type.name == 'SMS Credit Topup' ) {
      return this.redirectToSmsDashboard();
    }
  }

  handlePaymentFailure() {
    if( ['Subscription Upgrade', 'Subscription Renewal', 'Subscription Purchase'].includes(this.invoice.transaction_type?.name) ) {
      return this.redirectToSubscriptions();
    }

    if( this.invoice.transaction_type.name == 'SMS Credit Topup' ) {
      return this.redirectToSmsDashboard();
    }
  }

  handleCancelFailure() {
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

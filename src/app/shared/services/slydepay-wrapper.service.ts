import { Injectable } from '@angular/core';
import { SlydepayService } from 'slydepay-angular';
import { OrganisationInvoice } from '../model/api/organisation-invoice';
import Swal from 'sweetalert2';
import { OrganisationInvoiceItem } from '../model/api/organisation-invoice-item';
import { CreateInvoiceResult, Transaction } from 'slydepay-angular';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class SlydepayWrapperService {

  constructor(
    private slydepayService: SlydepayService,
    private router: Router,
    public translate: TranslateService
  ) { }

  payInvoice(invoice: OrganisationInvoice, callback: string = null) {
    Swal.fire(
      this.translate.instant('Preparing Payment'),
      this.translate.instant('Please wait as invoice for payment is generated'),
      'info'
    );
    Swal.showLoading();

    const orderItems = invoice.organisation_invoice_items.map((item: OrganisationInvoiceItem) => {
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
      orderCode: invoice.invoice_no + '-' + Math.floor((Math.random() * 1000)),
      descritpion: invoice.transaction_type.name,
      orderItems
    }).subscribe(response => this.redirectToPayLive(response.result, callback));
  }

  redirectToPayLive(result: CreateInvoiceResult, callback: string = null) {
    Swal.fire(
      this.translate.instant('Redirecting to Gateway'),
      this.translate.instant('Redirecting to Slydepay Payment Gateway to complete transaction') + '.' + this.translate.instant('Please wait') + '...',
      'info'
    );
    Swal.showLoading();

    callback = window.location.origin + '/organisation/settings/process-payment';

    this.slydepayService.redirectToPayLive( result.payToken, callback);
  }

  completeTransaction(params: Transaction) {
    Swal.fire(
      this.translate.instant('Completing Transaction'),
      this.translate.instant('Please wait') + '...',
      'info'
    );
    Swal.showLoading();

    return this.slydepayService.confirmTransaction(params).subscribe((response) => {
      Swal.close();

      if ( response.success ) {
        this.redirectToSubscriptions();
      } else {
        Swal.fire('Failed To Complete Transaction', response.errorMessage, 'error').then(() => {
          this.redirectToSubscriptions();
        });
      }
    });
  }

  cancelTransaction(params: Transaction) {
    Swal.fire(
      this.translate.instant('Canceling Transaction'),
      this.translate.instant('An error occured while processing this payment') + '.' +
      this.translate.instant('Transaction will be cancelled and payment refunded'),
      'info'
    );
    Swal.showLoading();

    return this.slydepayService.cancelTransaction(params).subscribe((response) => {
      Swal.close();

      if ( response.success ) {
        this.redirectToSubscriptions();
      } else {
        Swal.fire(
          this.translate.instant('Failed To Cancel Transaction'), response.errorMessage, 'error'
        ).then(() => {
          this.redirectToSubscriptions();
        });
      }
    });
  }

  redirectToSubscriptions() {
    this.router.navigate(['/organisation/settings/subscription']);
  }
}

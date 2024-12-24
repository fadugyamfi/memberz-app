import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { OrganisationInvoiceService } from '../../../shared/services/api/organisation-invoice.service';
import { OrganisationInvoice } from '../../../shared/model/api/organisation-invoice';
// import { SlydepayWrapperService } from '../../../shared/services/slydepay-wrapper.service';
import { EventsService } from '../../../shared/services/events.service';
import { OrganisationService } from '../../../shared/services/api/organisation.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-payment-processor',
    templateUrl: './payment-processor.component.html',
    styleUrls: ['./payment-processor.component.scss'],
    imports: [TranslateModule]
})
export class PaymentProcessorComponent implements OnInit {

  public invoice: OrganisationInvoice;
  public responseParams: Params;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public invoiceService: OrganisationInvoiceService,
    // public slydepayWrapper: SlydepayWrapperService,
    public organisationService: OrganisationService,
    public events: EventsService
  ) { }

  ngOnInit() {
    this.setupPaymentEvents();

    this.responseParams = this.route.snapshot.queryParams;

    if ( this.responseParams['status'] === '0' ) {
      this.updateInvoicePaymentStatus();
    } else {
      this.cancelTransaction();
    }
  }

  setupPaymentEvents() {
    this.events.on('OrganisationInvoice:updated', (invoice: OrganisationInvoice) => {
      if ( invoice.paid ) {
        this.completeTransaction();
        this.organisationService.refreshActiveOrganisation();
      }
    });

    this.events.on('OrganisationInvoice:updated:error', () => {
      this.cancelTransaction();
    });
  }

  updateInvoicePaymentStatus() {
    const orderCode = this.responseParams.cust_ref;
    if ( !orderCode ) {
      return this.cancelTransaction();
    }

    const invoice_no = orderCode.split('-')[0];

    this.invoiceService.getByInvoiceNo(invoice_no).subscribe(invoice => {
      if ( invoice ) {
        invoice.paid = true;
        this.invoiceService.update(invoice);
      }
    });
  }

  completeTransaction() {
    // this.slydepayWrapper.completeTransaction({
    //   orderCode: this.responseParams['cust_ref'],
    //   payToken: this.responseParams['pay_token'],
    //   transactionId: this.responseParams['transac_id']
    // });
  }

  cancelTransaction() {
    // this.slydepayWrapper.cancelTransaction({
    //   orderCode: this.responseParams['cust_ref'],
    //   payToken: this.responseParams['pay_token'],
    //   transactionId: this.responseParams['transac_id']
    // });
  }

  markInvoicePaid() {
    this.invoice.paid = true;
    this.invoiceService.update(this.invoice);
  }
}

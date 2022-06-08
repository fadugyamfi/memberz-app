import { Component, OnInit } from '@angular/core';
import { EventsService } from '../../../shared/services/events.service';
import { OrganisationService } from '../../../shared/services/api/organisation.service';
import { OrganisationSubscriptionService } from '../../../shared/services/api/organisation-subscription.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { OrganisationSubscription } from '../../../shared/model/api/organisation-subscription';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { OrganisationInvoiceService } from '../../../shared/services/api/organisation-invoice.service';
import { OrganisationInvoice } from '../../../shared/model/api/organisation-invoice';
import { SlydepayWrapperService } from '../../../shared/services/slydepay-wrapper.service';

@Component({
  selector: 'app-invoice-payment',
  templateUrl: './invoice-payment.component.html',
  styleUrls: ['./invoice-payment.component.scss']
})
export class InvoicePaymentComponent implements OnInit {

  public subscriptionForm: UntypedFormGroup;
  public activeSubscription: OrganisationSubscription;
  public subs: Subscription[] = [];
  private invoice_id: number;
  private invoice: OrganisationInvoice;

  constructor(
    public events: EventsService,
    public organisationService: OrganisationService,
    public subscriptionService: OrganisationSubscriptionService,
    public invoiceService: OrganisationInvoiceService,
    public router: Router,
    public slydepayWrapper: SlydepayWrapperService,
    public route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.setupForm();
    this.fetchInvoice();
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

  fetchInvoice() {
    this.invoice_id = +this.route.snapshot.paramMap.get('id');

    this.invoiceService.getById(this.invoice_id).subscribe((invoice: OrganisationInvoice) => {
      this.invoice = invoice;
      this.subscriptionForm.patchValue({
        transaction_type_name: invoice.transaction_type.name,
        invoice_no: invoice.invoice_no,
        total_due: invoice.total_due.toFixed(2)
      });
    });
  }

  paySubscription() {
    this.slydepayWrapper.payInvoice(this.invoice);
  }

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
        this.router.navigate(['/organisation/settings/subscription']);
      }
    });
  }

  redirectToSubscriptionHistory() {
    this.router.navigate(['/organisation/settings/subscription']);
  }
}

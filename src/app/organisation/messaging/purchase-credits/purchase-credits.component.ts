import { formatNumber, DecimalPipe, CurrencyPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SmsCredit } from '../../../shared/model/api/sms-credit';
import { SmsAccountService } from '../../../shared/services/api/sms-account.service';
import { SmsCreditService } from '../../../shared/services/api/sms-credit.service';
import { SmsAccountTopup } from '../../../shared/model/api/sms-account-topup';
import { SmsAccountTopupService } from '../../../shared/services/api/sms-account-topup.service';
import { EventsService } from '../../../shared/services/events.service';
import Swal from 'sweetalert2';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
// import { SlydepayWrapperService } from '../../../shared/services/slydepay-wrapper.service';
import { OrganisationInvoiceService } from '../../../shared/services/api/organisation-invoice.service';

@Component({
    selector: 'app-purchase-credits',
    templateUrl: './purchase-credits.component.html',
    styleUrls: ['./purchase-credits.component.scss'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, DecimalPipe, CurrencyPipe, TranslateModule]
})
export class PurchaseCreditsComponent implements OnInit, OnDestroy {

  public bundles: SmsCredit[] = [];
  public subscriptions: Subscription[] = [];
  public selectedBundle: SmsCredit;
  public purchaseForm: UntypedFormGroup;

  constructor(
    public smsAccountService: SmsAccountService,
    public smsCreditService: SmsCreditService,
    public smsAccountTopupService: SmsAccountTopupService,
    public router: Router,
    public events: EventsService,
    public translate: TranslateService,
    // public slydepayWrapper: SlydepayWrapperService,
    public invoiceService: OrganisationInvoiceService
  ) { }

  ngOnInit(): void {
    this.loadSmsCreditBundles();
    this.setupPurchaseForm();
    this.setupEvents();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.removeEvents();
  }

  loadSmsCreditBundles() {
    const sub = this.smsCreditService.getAll({ limit: 50, contain: 'currency' }).subscribe({
      next: (smsCredits: SmsCredit[]) => this.bundles = smsCredits,
      error: (error) => {}
    });
    this.subscriptions.push(sub);
  }

  cancel() {
    window.history.back();
  }

  selectBundle(bundle: SmsCredit) {
    this.selectedBundle = bundle;
    this.setupPurchaseForm();
  }

  isSelectedBundle(bundle: SmsCredit) {
    return this.selectedBundle == bundle;
  }

  setupPurchaseForm() {
    const smsAccount = this.smsAccountService.getOrganisationAccount();

    this.purchaseForm = new UntypedFormGroup({
      organisation_id: new UntypedFormControl(smsAccount.organisation_id),
      module_sms_account_id: new UntypedFormControl(smsAccount.id),
      module_sms_credit_id: new UntypedFormControl(this.selectedBundle?.id),
      credit_amount: new UntypedFormControl(this.selectedBundle?.credit_amount),
      quantity: new UntypedFormControl('1'),
      cost: new UntypedFormControl(this.selectedBundle?.cost),
      currency_id: new UntypedFormControl(this.selectedBundle?.currency.id),
      payment_method: new UntypedFormControl('invoice')
    });

    this.purchaseForm.controls.quantity.valueChanges.subscribe((quantity) => {
      this.purchaseForm.controls.cost.setValue(quantity * this.selectedBundle?.cost);
      this.purchaseForm.controls.credit_amount.setValue((quantity * this.selectedBundle?.credit_amount));
    })
  }

  purchase(event) {
    event.preventDefault();

    Swal.fire(
      this.translate.instant('Creating Purchase Invoice'),
      this.translate.instant('Please wait as the purchase is recorded'),
      'info'
    );
    Swal.showLoading();

    const smsCreditTopup = new SmsAccountTopup(this.purchaseForm.value);

    this.smsAccountTopupService.create(smsCreditTopup);
  }

  setupEvents() {
    this.events.on('SmsAccountTopup:created', (topup) => {
      Swal.close();
      this.router.navigate([`/organisation/settings/invoice-payment/${topup.organisation_invoice_id}`])
      // if( this.purchaseForm.value.payment_method == 'slydepay' ) {
      //   this.initiateSlydepayPayment(topup);
      // } else {
      //   this.router.navigate(['/organisation/messaging/settings']);
      // }
    });
  }

  removeEvents() {
    this.events.off('SmsAccountTopup:created');
  }

  // initiateSlydepayPayment(topup: SmsAccountTopup) {
  //   this.invoiceService.getById(topup.organisation_invoice_id).subscribe(invoice => {
  //     this.slydepayWrapper.payInvoice(invoice);
  //   })
  // }
}

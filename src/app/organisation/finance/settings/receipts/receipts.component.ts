import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { ContributionReceiptSetting } from '../../../../shared/model/api/contribution-receipt-setting';
import { ContributionReceiptSettingService} from '../../../../shared/services/api/contribution-receipt-setting.service';
import { CurrencyService} from '../../../../shared/services/api/currency.service';
import { OrganisationService } from '../../../../shared/services/api/organisation.service';
import { SmsAccountService } from '../../../../shared/services/api/sms-account.service';
import { EventsService } from '../../../../shared/services/events.service';
import { NgIf, NgFor } from '@angular/common';
import { UiSwitchModule } from 'ngx-ui-switch';

@Component({
    selector: 'app-receipts',
    templateUrl: './receipts.component.html',
    styleUrls: ['./receipts.component.scss'],
    standalone: true,
    imports: [NgIf, FormsModule, ReactiveFormsModule, NgFor, UiSwitchModule, TranslateModule]
})
export class ReceiptsComponent implements OnInit, OnDestroy {

  public settingsForm: UntypedFormGroup;
  public settings: ContributionReceiptSetting;
  private subscriptions: Subscription[] = [];
  public newReceiptSetup = false;

  constructor(
    public translate: TranslateService,
    public receiptSettingService: ContributionReceiptSettingService,
    public currencyService: CurrencyService,
    public organisationService: OrganisationService,
    public events: EventsService,
    public smsAccountService: SmsAccountService
  ) { }

  ngOnInit(): void {
    this.setupSettingsForm();
    this.fetchCurrencies();
    this.fetchReceiptSettings();
    this.setupEvents();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.removeEvents();
  }

  fetchCurrencies() {
    const sub = this.currencyService.getAll({ sort: 'currency_code:asc'}).subscribe();
    this.subscriptions.push(sub);
  }

  fetchReceiptSettings() {
    const sub = this.receiptSettingService.fetchSettings().subscribe({
      next: settings => {
        this.settings = settings;
        this.settingsForm.patchValue(this.settings);
      },
      error: err => {
        const organisation = this.organisationService.getActiveOrganisation();
        const GHS = 80;

        this.newReceiptSetup = true;
        this.settings = new ContributionReceiptSetting({
          organisation_id: organisation.id,
          default_currency: organisation.currency_id || GHS,
          receipt_mode: 'auto',
          receipt_counter: 1
        });

        this.settingsForm.patchValue(this.settings);
      }
    });

    this.subscriptions.push(sub);
  }

  setupSettingsForm() {
    this.settingsForm = new UntypedFormGroup({
      id: new UntypedFormControl( this.settings?.id ),
      organisation_id: new UntypedFormControl( this.settings?.organisation_id ),
      default_currency: new UntypedFormControl( this.settings?.default_currency ),
      receipt_mode: new UntypedFormControl( this.settings?.receipt_mode || 'auto' ),
      receipt_prefix: new UntypedFormControl( this.settings?.receipt_prefix ),
      receipt_postfix: new UntypedFormControl( this.settings?.receipt_postfix ),
      receipt_counter: new UntypedFormControl( this.settings?.receipt_counter ),
      sms_notify: new UntypedFormControl( this.settings?.sms_notify ),
    });

    const smsAccountCreated = this.smsAccountService.hasOrganisationAccount();

    const sub = this.settingsForm.valueChanges.subscribe((value) => {
      if( value.sms_notify == 1 && !smsAccountCreated ) {
        Swal.fire(
          this.translate.instant('SMS Account Not Setup'),
          this.translate.instant('Please setup SMS account to enable is feature'),
          'error'
        ).then(() => {
          value.sms_notify = 0;
          this.settingsForm.patchValue(value);
        });
      }

      this.settings.update(value);
    });

    this.subscriptions.push(sub);
  }

  getNextReceiptNumber() {
    if ( !this.settings ) {
      return '';
    }

    return `${this.settings.receipt_prefix}${this.settings.receipt_counter || 1}${this.settings.receipt_postfix}`;
  }

  saveChanges(e: Event) {
    this.settings = new ContributionReceiptSetting(this.settingsForm.value);

    if( this.settings.id ) {
      return this.receiptSettingService.update(this.settings);
    }

    return this.receiptSettingService.create(this.settings);
  }

  isManual(): boolean {
    return this.settings && this.settings.receipt_mode === 'manual';
  }

  setupEvents() {
    this.events.on('ContributionReceiptSetting:created', () => this.newReceiptSetup = false);
  }

  removeEvents() {
    this.events.off(['ContributionReceiptSetting:created']);
  }
}

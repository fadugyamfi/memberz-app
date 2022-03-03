import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ContributionReceiptSetting } from '../../../../shared/model/api/contribution-receipt-setting';
import { ContributionReceiptSettingService} from '../../../../shared/services/api/contribution-receipt-setting.service';
import { CurrencyService} from '../../../../shared/services/api/currency.service';
import { OrganisationService } from '../../../../shared/services/api/organisation.service';
import { EventsService } from '../../../../shared/services/events.service';

@Component({
  selector: 'app-receipts',
  templateUrl: './receipts.component.html',
  styleUrls: ['./receipts.component.scss']
})
export class ReceiptsComponent implements OnInit, OnDestroy {

  public settingsForm: FormGroup;
  public settings: ContributionReceiptSetting;
  private subscriptions: Subscription[] = [];
  public newReceiptSetup = false;

  constructor(
    public translate: TranslateService,
    public receiptSettingService: ContributionReceiptSettingService,
    public currencyService: CurrencyService,
    public organisationService: OrganisationService,
    public events: EventsService
  ) { }

  ngOnInit(): void {
    this.fetchCurrencies();
    this.fetchReceiptSettings();
    this.setupSettingsForm();
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
        this.setupSettingsForm();
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

        this.setupSettingsForm();
      }
    });

    this.subscriptions.push(sub);
  }

  setupSettingsForm() {
    this.settingsForm = new FormGroup({
      id: new FormControl( this.settings?.id ),
      organisation_id: new FormControl( this.settings?.organisation_id ),
      default_currency: new FormControl( this.settings?.default_currency ),
      receipt_mode: new FormControl( this.settings?.receipt_mode || 'auto' ),
      receipt_prefix: new FormControl( this.settings?.receipt_prefix ),
      receipt_postfix: new FormControl( this.settings?.receipt_postfix ),
      receipt_counter: new FormControl( this.settings?.receipt_counter ),
      sms_notify: new FormControl( this.settings?.sms_notify ),
    });

    const sub = this.settingsForm.valueChanges.subscribe((value) => {
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

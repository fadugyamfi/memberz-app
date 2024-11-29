import { Component, OnInit } from '@angular/core';
import { SmsAccountService } from '../../../shared/services/api/sms-account.service';
import { SmsAccount } from '../../../shared/model/api/sms-account';
import { UntypedFormGroup, UntypedFormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrganisationService } from '../../../shared/services/api/organisation.service';
import { EventsService } from '../../../shared/services/events.service';
import { Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { SmsSummaryComponent } from '../../../shared/components/charts/sms-summary/sms-summary.component';
import { SmsTransactionHistoryComponent } from '../sms-transaction-history/sms-transaction-history.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, SmsSummaryComponent, SmsTransactionHistoryComponent, DecimalPipe, TranslateModule]
})
export class SettingsComponent implements OnInit {

  public smsAccount: SmsAccount;
  public accountForm: UntypedFormGroup;
  public editingAccount = false;

  constructor(
    public events: EventsService,
    public smsAccountService: SmsAccountService,
    public organisationService: OrganisationService,
    public router: Router
  ) { }

  ngOnInit() {
    this.setupForm();
    this.setupEvents();

    // slightly delay fetching
    setTimeout(() => this.fetchSmsAccount(), 1000);
  }

  setupEvents() {
    const callback = (account: SmsAccount) => {
      this.smsAccount = account;
      this.editingAccount = false;
    };

    this.events.on('SmsAccount:created', callback);
    this.events.on('SmsAccount:updated', callback);
    this.events.on('SmsAccount:refresh', callback);
  }

  editSmsAccount() {
    this.editingAccount = true;

    if (this.smsAccount) {
      this.accountForm.patchValue(this.smsAccount);
    }
  }

  fetchSmsAccount() {
    this.smsAccount = this.smsAccountService.getOrganisationAccount();
  }

  setupForm() {
    const organisation = this.organisationService.getActiveOrganisation();

    this.accountForm = new UntypedFormGroup({
      id: new UntypedFormControl(),
      organisation_id: new UntypedFormControl(organisation.id),
      sender_id: new UntypedFormControl('', [Validators.required, Validators.maxLength(11)]),
      active: new UntypedFormControl(1)
    });
  }

  onSubmit() {
    const account = new SmsAccount(this.accountForm.value);

    if (account.id) {
      return this.smsAccountService.update(account);
    }

    return this.smsAccountService.create(account);
  }

  refreshAccount() {
    this.smsAccountService.refreshAccount();
  }

  purchaseSmsCredit() {
    this.router.navigate(['/organisation/messaging/purchase-credits']);
  }
}

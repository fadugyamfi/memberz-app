import { Component, OnInit } from '@angular/core';
import { SmsAccountTopupService } from '../../../shared/services/cakeapi/sms-account-topup.service';
import { SmsAccountTopup } from '../../../shared/model/cakeapi/sms-account-topup';
import { PageEvent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-sms-transaction-history',
  templateUrl: './sms-transaction-history.component.html',
  styleUrls: ['./sms-transaction-history.component.scss']
})
export class SmsTransactionHistoryComponent implements OnInit {

  public topups: SmsAccountTopup[];

  constructor(
    public smsAccountTopupService: SmsAccountTopupService
  ) { }

  ngOnInit() {
    this.loadTransactions();
  }

  loadTransactions(page = 1, limit = 10) {
    this.topups = null;
    this.smsAccountTopupService.getAll<SmsAccountTopup[]>({ page, limit, sort: 'id:desc' }).subscribe(
      (topups) => this.topups = topups
    );
  }

  onPaginate(params: PageEvent) {
    this.loadTransactions(params.page, params.limit);
  }
}

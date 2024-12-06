import { Component, OnDestroy, OnInit } from '@angular/core';
import { SmsAccountTopupService } from '../../../shared/services/api/sms-account-topup.service';
import { SmsAccountTopup } from '../../../shared/model/api/sms-account-topup';
import { PageEvent, PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import Swal from 'sweetalert2';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { OrganisationInvoice } from '../../../shared/model/api/organisation-invoice';
import { EventsService } from '../../../shared/services/events.service';
import { DecimalPipe, CurrencyPipe } from '@angular/common';
import { InvoiceComponent } from '../../../shared/components/invoice/invoice.component';

@Component({
    selector: 'app-sms-transaction-history',
    templateUrl: './sms-transaction-history.component.html',
    styleUrls: ['./sms-transaction-history.component.scss'],
    imports: [PaginationComponent, InvoiceComponent, DecimalPipe, CurrencyPipe, TranslateModule]
})
export class SmsTransactionHistoryComponent implements OnInit {

  public topups: SmsAccountTopup[];

  constructor(
    public smsAccountTopupService: SmsAccountTopupService,
    public translate: TranslateService,
    public events: EventsService
  ) { }

  ngOnInit() {
    this.loadTransactions();
  }

  loadTransactions(page = 1, limit = 10) {
    this.topups = null;
    this.smsAccountTopupService.getAll({ page, limit, sort: 'id:desc' }).subscribe(
      (topups) => this.topups = topups
    );
  }

  onPaginate(params: PageEvent) {
    this.loadTransactions(params.page, params.limit);
  }

  /**
  * Batch delete a select list of member records
  */
  deleteTopup(topup: SmsAccountTopup) {
    Swal.fire({
      title: this.translate.instant('Confirm Deletion'),
      text: this.translate.instant(`This action will delete this topup request from the database. This action currently cannot be reverted`),
      icon: 'warning',
      showCancelButton: true,
    }).then((action) => {
      if (action.value) {
        Swal.fire(
          this.translate.instant('Deleting SMS Topup'),
          this.translate.instant('Please wait') + ' ...',
          'error'
        );
        Swal.showLoading();
        this.smsAccountTopupService.removeWithoutSubscription(topup).subscribe({
          next: (record) => {
            Swal.close()
            this.topups = this.smsAccountTopupService.getItems();
          }
        });
      }
    });
  }
}

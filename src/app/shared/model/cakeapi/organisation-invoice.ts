
import { AppModel } from './app.model';
import * as moment from 'moment';
import { OrganisationInvoiceItem } from './organisation-invoice-item';
import { TransactionType } from './transaction-type';
import { CurrencyPipe } from '@angular/common';
import { Currency } from './currency';

export class OrganisationInvoice extends AppModel {

  public id: any;
  public invoice_no: string;
  public total_due: number;
  public currency_id: number;
  public due_date: string;
  public paid: boolean;
  public organisation_id: number;
  public notes: string;
  public _currency: Currency;
  public _transaction_type: TransactionType;
  public _organisation_invoice_item: OrganisationInvoiceItem[];

  constructor(data) {
    super(data);
  }

  set organisation_invoice_item(value) {
    this._organisation_invoice_item = value ? value.map(item => new OrganisationInvoiceItem(item)) : null;
  }

  get organisation_invoice_item(): OrganisationInvoiceItem[] {
    return this._organisation_invoice_item;
  }

  set transaction_type(value) {
    this._transaction_type = value ? new TransactionType(value) : null;
  }

  get transaction_type(): TransactionType {
    return this._transaction_type;
  }

  set currency(value) {
    this._currency = value ? new Currency(value) : null;
  }

  get currency(): Currency {
    return this._currency;
  }
}


import { AppModel } from './app.model';
import { Currency } from './currency';
import { OrganisationInvoice } from './organisation-invoice';

export class SmsAccountTopup extends AppModel {

  
  public invoice_description: string;
  public organisation_invoice_id: number;
  public credit_amount: number;
  public is_bonus: number;
  public credited: boolean;
  public cost: number;
  public _currency: Currency;
  public _organisation_invoice: OrganisationInvoice

  constructor(data: object) {
    super(data);
  }

  set currency(value) {
    this._currency = value ? new Currency(value) : null;
  }

  get currency() {
    return this._currency;
  }

  get invoice() {
    return this._organisation_invoice;
  }

  set organisation_invoice(value) {
    this._organisation_invoice = value ? new OrganisationInvoice(value) : null;
  }
}


import { AppModel } from './app.model';
import { Currency } from './currency';

export class SmsAccountTopup extends AppModel {

  public id: any;
  public invoice_description: string;
  public organisation_invoice_id: number;
  public credit_amount: number;
  public is_bonus: number;
  public credited: boolean;
  public cost: number;
  public _currency: Currency;

  constructor(data: object) {
    super(data);
  }

  set currency(value) {
    this._currency = value ? new Currency(value) : null;
  }

  get currency() {
    return this._currency;
  }
}

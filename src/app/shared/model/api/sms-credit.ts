
import { AppModel } from './app.model';
import { Currency } from './currency';

export class SmsCredit extends AppModel {

  public id: any;
  public credit_amount: number;
  public cost: number;
  public unit_price: number;
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

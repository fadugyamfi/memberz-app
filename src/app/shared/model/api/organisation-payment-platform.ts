
import { AppModel } from './app.model';
import { PaymentPlatform } from './payment-platform';
import { Currency } from './currency';

export class OrganisationPaymentPlatform extends AppModel {

  
  public payment_platform_id: number;
  public _currency;
  public _payment_platform: PaymentPlatform | null;
  public config: any;

  constructor(data) {
    super(data);
  }

  get payment_platform(): PaymentPlatform | null {
    return this._payment_platform;
  }

  set payment_platform(value) {
    this._payment_platform = value ? new PaymentPlatform(value) : null;
  }

  set currency(value) {
    this._currency = value ? new Currency(value) : null;
  }

  get currency(): Currency {
    return this._currency;
  }
}

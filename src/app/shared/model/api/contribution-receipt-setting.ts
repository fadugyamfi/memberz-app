import { AppModel } from './app.model';

export class ContributionReceiptSetting extends AppModel {

  
  public organisation_id: number;
  public default_currency: number;
  public default_currency_code: string;
  public receipt_mode: string;
  public receipt_prefix: string;
  public receipt_postfix: string;
  public receipt_counter: number;
  public sms_notify: boolean;

  constructor(data) {
    super(data);
  }

  isReceiptModeAuto() {
    return this.receipt_mode === 'auto';
  }
}

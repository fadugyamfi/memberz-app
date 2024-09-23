
import { AppModel } from './app.model';

export class SmsAccount extends AppModel {

  
  public account_balance: number;
  public bonus_balance: number;
  public sender_id: string;

  constructor(data: object) {
    super(data);
  }

  get balance() {
    return this.account_balance + this.bonus_balance;
  }
}

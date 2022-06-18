
import { AppModel } from './app.model';

export class SubscriptionType extends AppModel {

  public id: any;
  public name: string;
  public description: string;
  public initial_price: number;
  public renewal_price: number;
  public validity: string;
  public currency_id: number;
  public revenue_tracking: number;
  public expenditure_tracking: number;

  constructor(data) {
    super(data);
  }
}


import { AppModel } from './app.model';
import * as moment from 'moment';
import { SubscriptionType } from './subscription-type';

export class OrganisationSubscription extends AppModel {

  public id: any;
  public organisation_id: number;
  public start_dt: string;
  public end_dt: string;
  public _subscription_type: SubscriptionType;
  public subscription_type_id: number;

  constructor(data) {
    super(data);
  }

  expiresIn(): string {
    return this.subscription_type.validity != 'forever' ? moment(this.end_dt).fromNow() : '';
  }

  isExpired(): boolean {
    return this.subscription_type.validity != 'forever' && moment(this.end_dt).isBefore(moment());
  }

  set subscription_type(value) {
    this._subscription_type = value ? new SubscriptionType(value) : null;
  }

  get subscription_type() {
    return this._subscription_type;
  }

  /**
   * Returns the cost of renewal with discount pre-calculated
   * 
   * @param sub_length 
   */
  nextRenewalCost(sub_length: number) {
    const length = sub_length == 12 ? sub_length - 2 : (sub_length == 6 ? sub_length - 1 : sub_length);

    return this.subscription_type.renewal_price * length;
  }

  nextRenewalDate(sub_length: number) {
    return this.isExpired() ? moment().add(sub_length, 'month') : moment(this.end_dt).add(sub_length, 'month');
  }
}

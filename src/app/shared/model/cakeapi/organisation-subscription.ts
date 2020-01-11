
import { AppModel } from './app.model';
import * as moment from 'moment';

export class OrganisationSubscription extends AppModel {

  public id: any;
  public organisation_id: number;
  public start_dt: string;
  public end_dt: string;
  public subscription_type: any;

  constructor(data) {
    super(data);
  }

  expiresIn(): string {
    return this.subscription_type.validity != 'forever' ? moment(this.end_dt).fromNow() : '';
  }

  isExpired(): boolean {
    return this.subscription_type.validity != 'forever' && moment(this.end_dt).isBefore(moment());
  }
}

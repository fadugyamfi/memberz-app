
import { AppModel } from './app.model';

export class SmsBroadcast extends AppModel {

  public id: any;
  public sms_broadcast_list: any;
  public organisation_member_category: any;
  public send_at: any;
  public send_at_date: any;
  public send_at_time: any;

  constructor(data: object) {
    super(data);
  }

  get sentTo() {
    return this.sms_broadcast_list ? this.sms_broadcast_list.name
      : this.organisation_member_category ? this.organisation_member_category.name : 'Everyone';
  }
}

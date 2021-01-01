
import { AppModel } from './app.model';

export class SmsBroadcast extends AppModel {

  public id: any;
  public sms_broadcast_list: any;
  public organisation_member_category: any;

  constructor(data: object) {
    super(data);
  }

  get sentTo() {
    return this.sms_broadcast_list ? this.sms_broadcast_list.name
      : this.organisation_member_category ? this.organisation_member_category.name : 'Everyone';
  }
}

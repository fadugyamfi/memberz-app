
import { AppModel } from './app.model';

export class SmsBroadcastList extends AppModel {

  public id: any;
  public name: string;
  public sms_broadcast: any;
  public organisation_member_category: any;

  constructor(data: object) {
    super(data);
  }
}
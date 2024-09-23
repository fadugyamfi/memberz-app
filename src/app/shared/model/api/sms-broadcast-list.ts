
import { AppModel } from './app.model';

export class SmsBroadcastList extends AppModel {

  
  public name: string;
  public sms_broadcast: any;
  public organisation_member_category: any;
  public size: number;
  public filters: [];

  constructor(data: object) {
    super(data);
  }
}

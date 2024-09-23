
import { AppModel } from './app.model';
import { OrganisationAccount } from './organisation-account';

export class SmsBroadcast extends AppModel {

  
  public sms_broadcast_list: any;
  public organisation_member_category: any;
  public send_at: any;
  public send_at_date: any;
  public send_at_time: any;
  public sent_offset = 0;
  public sent_pages = 0;
  public sent_count = 0;
  public _scheduler: OrganisationAccount;
  public organisation_member_category_id: number;
  public module_sms_broadcast_list_id: number;

  constructor(data: object) {
    super(data);
  }

  get sentTo() {
    return this.sms_broadcast_list
      ? this.sms_broadcast_list.name
      : this.organisation_member_category
        ? this.organisation_member_category.name
        : 'Everyone';
  }

  set scheduled_by(value) {
    this._scheduler = value ? new OrganisationAccount(value) : null;
  }

  get scheduler(): OrganisationAccount {
    return this._scheduler;
  }
}

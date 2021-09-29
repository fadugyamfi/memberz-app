import { AppModel } from './app.model';
import { MemberAccount } from './member-account';
import * as moment from 'moment';

export class UserActivity extends AppModel {

  public id: any;
  public log_name: string;
  public description: string;
  public created_at: string;
  public _causer: MemberAccount

  constructor(data) {
    super(data);
  }

  set causer(value) {
    this._causer = new MemberAccount(value);
  }

  get causer(): MemberAccount {
    return this._causer;
  }

  timeAgo() {
    return moment(this.created_at).fromNow();
}
}
import { AppModel } from './app.model';
import * as moment from 'moment';

export class Notification extends AppModel {

  
  public read_at;
  public data: object;
  public sent: number;
  public _type: string;
  public organisation_id: number;

  constructor(data) {
    super(data);
  }

  get title() {
    return this.data['title'] || '';
  }

  get message() {
    return this.data['message'] || '';
  }

  get action() {
    return this.data['action'] || '';
  }

  timeAgo() {
    return moment(this.created_at).fromNow();
  }

  get user() {
    return this.data['user'] || {};
  }

  set type(value) {
    this._type = value;
  }

  get type() {
    return this._type.replace('App\\Notifications\\', '');
  }

  get route() {
    switch (this.type) {
      case 'MembershipImported':
        return '/organisation/memberships/bulk-upload';

      case 'AdminUserCreated':
        return '/organisation/settings/accounts';

      case 'InsufficientSmsCredits':
        return '/organisation/messaging/settings';

      case 'InsufficientSmsCreditsForBroadcast':
        return '/organisation/messaging/settings';

      case 'OrganisationAccountRoleChanged':
        return '/organisation/settings/accounts';

      case 'SmsBroadcastScheduled':
        return '/organisation/messaging/history';

      default:
        return '/organisation/dashboard';
    }
  }

  get icon() {
    switch(this.type) {
      case 'InsufficientSmsCredits':
      case 'InsufficientSmsCreditsForBroadcast':
      case 'SmsBroadcastScheduled':
        return 'message-circle';

      case 'AdminUserCreated':
      case 'OrganisationAccountRoleChanged':
        return 'user';

      case 'MembershipImported':
        return 'upload-cloud';

      default:
        return 'shopping-bag';
    }
  }
}

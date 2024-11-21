
import { AppModel } from './app.model';
import { MemberAccount } from './member-account';
import { OrganisationSubscription } from './organisation-subscription';
import { OrganisationType } from './organisation-type';

export class Organisation extends AppModel {
  
  public uuid: string;
  public name: string;
  public email: string;
  public phone: string;
  public logo: string;
  private _activeSubscription: OrganisationSubscription | null;
  private _organisationType: OrganisationType | null;
  private _memberAccount: MemberAccount | null;
  public country_id: number;
  public currency_id: number;
  public slug: string;
  public address: string;
  public city: string;
  public state: string;
  public website: string;
  public phone_intl: string;

  constructor(data) {
    super(data);
  }

  set active_subscription(value) {
    this._activeSubscription = value ? new OrganisationSubscription(value) : null;
  }

  get active_subscription(): OrganisationSubscription | null {
    return this._activeSubscription;
  }

  set organisation_type(value) {
    this._organisationType = value ? new OrganisationType(value) : null;
  }

  get organisation_type(): OrganisationType | null {
    return this._organisationType;
  }

  set member_account(value) {
    this._memberAccount = value ? new MemberAccount(value) : null;
  }

  get member_account(): MemberAccount | null {
    return this._memberAccount;
  }
}

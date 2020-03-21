
import { AppModel } from './app.model';
import { OrganisationSubscription } from './organisation-subscription';
import { OrganisationType } from './organisation-type';

export class Organisation extends AppModel {

  public id: any;
  public name: any;
  public logo: string;
  private _activeSubscription: OrganisationSubscription;
  private _organisationType: OrganisationType;

  constructor(data) {
    super(data);
  }

  set active_subscription(value) {
    this._activeSubscription = value ? new OrganisationSubscription(value) : null;
  }

  get active_subscription(): OrganisationSubscription {
    return this._activeSubscription;
  }

  set organisation_type(value) {
    this._organisationType = value ? new OrganisationType(value) : null;
  }

  get organisation_type(): OrganisationType {
    return this._organisationType;
  }
}


import { AppModel } from './app.model';
import { OrganisationGroup } from './organisation-group';

export class OrganisationGroupType extends AppModel {

  public id: any;
  public name: string;
  public orgGroups: OrganisationGroup[];

  constructor(data) {
    super(data);
  }

  set organisation_groups(groups) {
    this.orgGroups = groups ? groups.map(group => new OrganisationGroup(group)) : null;
  }

  get organisation_groups(): OrganisationGroup[] {
    return this.orgGroups;
  }
}

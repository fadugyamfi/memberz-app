
import { AppModel } from './app.model';
import { OrganisationGroup } from './organisation-group';

export class OrganisationGroupType extends AppModel {

  
  public name: string;
  public orgGroups ?: OrganisationGroup[];

  constructor(data) {
    super(data);
  }

  set organisation_groups(groups) {
    this.orgGroups = groups ? groups.map(group => new OrganisationGroup(group)) : undefined;
  }

  get organisation_groups(): OrganisationGroup[] | undefined {
    return this.orgGroups;
  }
}


import { AppModel } from './app.model';
import { OrganisationGroupType } from './organisation-group-type';

export class OrganisationGroup extends AppModel {

  public id: any;
  public organisation_group_type_id: number;
  public name: string;
  private orgGroupType: OrganisationGroupType;
  public organisation_group_leaders: any[];

  constructor(data) {
    super(data);
  }

  get organisation_group_type(): OrganisationGroupType {
    return this.orgGroupType;
  }

  set organisation_group_type(value) {
    this.orgGroupType = value ? new OrganisationGroupType(value) : null;
  }
}


import { AppModel } from './app.model';
import { OrganisationGroup } from './organisation-group';
import { OrganisationMember } from './organisation-member';

export class OrganisationMemberGroup extends AppModel {

  public id: any;
  public organisation_group_id: number;
  public organisation_member_id: number;
  private orgGroup: OrganisationGroup;
  private orgMember: OrganisationMember;

  constructor(data) {
    super(data);
  }

  get organisation_group(): OrganisationGroup {
    return this.orgGroup;
  }

  set organisation_group(value) {
    this.orgGroup = new OrganisationGroup(value);
  }

  get organisation_member(): OrganisationMember {
    return this.orgMember;
  }

  set organisation_member(value) {
    this.orgMember = value ? new OrganisationMember(value) : null;
  }
}

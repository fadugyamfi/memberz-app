
import { AppModel } from './app.model';
import { OrganisationAnniversary } from './organisation-anniversary';
import { OrganisationMember } from './organisation-member';

export class OrganisationMemberAnniversary extends AppModel {

  public id: any;
  public organisation_member_id: number;
  public organisation_anniversary_id: number;
  public orgAnniv : OrganisationAnniversary;
  public orgMem : OrganisationMember;
  public value: number;
  public active: boolean;

  constructor(data) {
    super(data);
  }

  get organisation_anniversary(): OrganisationAnniversary {
    return this.orgAnniv;
  }

  set organisation_anniversary(value) {
    this.orgAnniv = value ? new OrganisationAnniversary(value) : null;
  }

  get organisation_member(): OrganisationMember {
    return this.orgMem;
  }

  set organisation_member(value) {
    this.orgMem = value ? new OrganisationMember(value) : null;
  }

}

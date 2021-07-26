
import { AppModel } from './app.model';
import { Member } from './member';
import { OrganisationMemberCategory } from './organisation-member-category';

export class OrganisationMember extends AppModel {

  public id: any;
  public selected: boolean = false;
  public _member: Member;
  public organisation_no: string;
  public approved: number;
  public active: number;
  public member_id: number;
  public _organisation_member_category: OrganisationMemberCategory;

  constructor(data) {
    super(data);
  }

  name() {
    return this.member && this.member.firstThenLastName();
  }

  nameLastFirst() {
    return this.member && this.member.lastThenFirstName();
  }

  set member(value) {
    this._member = value ? new Member(value) : null;
  }

  get member(): Member {
    return this._member;
  }

  pendingApproval() {
    return this.approved == 0 && this.active == 1;
  }

  set organisation_member_category(value) {
    this._organisation_member_category = value ? new OrganisationMemberCategory(value) : null;
  }

  get organisation_member_category() {
    return this._organisation_member_category;
  }
}

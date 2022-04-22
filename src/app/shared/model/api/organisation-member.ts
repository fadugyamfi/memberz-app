
import { AppModel } from './app.model';
import { Member } from './member';
import { OrganisationMemberCategory } from './organisation-member-category';
import { OrganisationRegistrationForm } from './organisation-registration-form';

export class OrganisationMember extends AppModel {

  public id: any;
  public uuid: string;
  public selected = false;
  public _member: Member;
  public organisation_no: string;
  public organisation_id: number;
  public approved: number;
  public active: number;
  public member_id: number;
  public _organisation_member_category: OrganisationMemberCategory;
  public _organisation_registration_form: OrganisationRegistrationForm;

  constructor(data) {
    super(data);
  }

  name() {
    return this.member && this.member.firstThenLastName();
  }

  nameLastFirst() {
    return this.member && this.member.lastThenFirstName();
  }

  fullname() {
    return this.member && this.member.fullname();
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

  set organisation_registration_form(value) {
    this._organisation_registration_form = value ? new OrganisationRegistrationForm(value) : null;
  }

  get organisation_registration_form() {
    return this._organisation_registration_form;
  }
}

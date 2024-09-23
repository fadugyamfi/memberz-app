
import { AppModel } from './app.model';
import { Contribution } from './contribution';
import { Member } from './member';
import { OrganisationEventAttendee } from './organisation-event-attendee';
import { OrganisationMemberCategory } from './organisation-member-category';
import { OrganisationRegistrationForm } from './organisation-registration-form';

export class OrganisationMember extends AppModel {

  
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
  public event_attendee: OrganisationEventAttendee;
  public last_attendance: OrganisationEventAttendee;
  public last_contribution: Contribution;

  constructor(data) {
    super(data);
  }

  name() {
    return this.member?.firstThenLastName();
  }

  nameWithTitle() {
    return this.member?.nameWithTitle();
  }

  nameLastFirst() {
    return this.member?.lastThenFirstName();
  }

  fullname() {
    return this.member?.fullname();
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

  get category() {
    return this.organisation_member_category;
  }

  set category(value) {
    // noop
  }

  set organisation_registration_form(value) {
    this._organisation_registration_form = value ? new OrganisationRegistrationForm(value) : null;
  }

  get organisation_registration_form() {
    return this._organisation_registration_form;
  }
}

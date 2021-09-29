
import { AppModel } from './app.model';
import { Member } from './member';

export class MemberAccount extends AppModel {

  public id: any;
  public _member: Member;
  public username: string;

  public member_id: number;
  public organisation_account: any[];

  constructor(data) {
    super(data);
  }

  get member() {
    return this._member;
  }

  set member(value) {
    this._member = value ? new Member(value) : null;
  }

  firstName() {
    return this.member.first_name;
  }

  occupation() {
    return this.member.occupation;
  }

  photoURL() {
    return this.member.member_image && this.member.member_image[0] && this.member.member_image[0].url;
  }

  thumbPhotoURL() {
    return this.member.member_image && this.member.member_image[0] && this.member.member_image[0].thumb_url;
  }

  isOrganisationAdmin(organisation_id: number) {
    return this.organisation_account &&
           this.organisation_account.some(account => account.organisation_id === organisation_id);
  }

  getOrganisationAccount(organisation_id: number) {
    return this.isOrganisationAdmin(organisation_id) ?
           this.organisation_account.find(account => account.organisation_id === organisation_id) :
           null;
  }
}
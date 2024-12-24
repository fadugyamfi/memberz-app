
import { AppModel } from './app.model';
import { OrganisationRole } from './organisation-role';
import { MemberAccount } from './member-account';
import { OrganisationMember } from './organisation-member';

export class OrganisationAccount extends AppModel {

  
  public organisation_id: number;
  public member_account_id: number;
  public organisation_role_id: number;
  public active: number;
  public deleted: number;
  public notifications: number;
  public weekly_updates: number;
  public _organisation_role: OrganisationRole | null;
  public _member_account: MemberAccount | null;
  public _membership: OrganisationMember | null;

  constructor(data) {
    super(data);
  }

  set organisation_role(value) {
    this._organisation_role = value ? new OrganisationRole(value) : null;
  }

  get organisation_role(): OrganisationRole | null {
    return this._organisation_role;
  }

  get member_account(): MemberAccount | null {
    return this._member_account;
  }

  set member_account(value) {
    this._member_account = value ? new MemberAccount(value) : null;
  }

  get name() {
    return this.member_account?.member?.name();
  }

  // in place so deserialization works
  set name(value) {}

  set membership(value) {
    this._membership = value ? new OrganisationMember(value) : null;
  }

  get membership() {
    return this._membership;
  }

  hasPermission(name: string) {
    return this.organisation_role?.hasPermission(name);
  }
}

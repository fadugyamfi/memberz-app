
import { AppModel } from './app.model';
import { Member } from './member';
import { Organisation } from './organisation';
import { Tag } from './tag';

export class OrganisationBranch extends AppModel {

  public organisation_id: number;
  public organisation_branch_id: number;
  public member_id: number;
  public _organisation: Organisation | null;
  public _organisation_branch: Organisation | null;
  public _primary_contact: Member | null;
  public _secondary_contact: Member | null;
  public _tags: Tag[] | null;

  constructor(data) {
    super(data);
  }

  public get organisation(): Organisation | null {
    return this._organisation;
  }

  public set organisation(value: any) {
    this._organisation = value ? new Organisation(value) : null;
  }

  public get organisation_branch(): Organisation | null {
    return this._organisation_branch;
  }

  public set organisation_branch(value: any) {
    this._organisation_branch = value ? new Organisation(value) : null;
  }

  public get primary_contact(): Member | null {
    return this._primary_contact;
  }

  public set primary_contact(value: any) {
    this._primary_contact = value ? new Member(value) : null;
  }

  public get secondary_contact(): Member | null {
    return this._secondary_contact;
  }

  public set secondary_contact(value: any) {
    this._secondary_contact = value ? new Member(value) : null;
  }

  public get tags(): Tag[] | null {
    return this._tags;
  }

  public set tags(value: Array<object> | null) {
    this._tags = Array.isArray(value) ? value.map(v => new Tag(v)) : null;
  }
}

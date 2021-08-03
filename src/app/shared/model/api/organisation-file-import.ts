
import { AppModel } from './app.model';
import { MemberAccount } from './member-account';

export class OrganisationFileImport extends AppModel {

  public id: any;
  public organisation_id: number;
  public import_type: string;
  public import_to_id: number;
  public file_path: string;
  public file_name: string;
  public import_status: string;
  public records_imported: number;
  public records_linked: number;
  public records_existing: number;
  public _member_account: MemberAccount;

  constructor(data) {
    super(data);
  }

  set member_account(value) {
    this._member_account = value ? new MemberAccount(value) : null;
  }

  get member_account(): MemberAccount {
    return this._member_account;
  }
}

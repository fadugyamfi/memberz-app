
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
  public ma: MemberAccount;

  constructor(data) {
    super(data);
  }

  set member_account(value) {
    this.ma = value ? new MemberAccount(value) : null;
  }

  get member_account(): MemberAccount {
    return this.ma;
  }

  badgeClasses() {
    return {
      'bg-success': this.import_status === 'completed',
      'bg-warning': this.import_status === 'pending',
      'bg-danger': this.import_status === 'failed'
    };
  }
}

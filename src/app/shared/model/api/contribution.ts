
import { AppModel } from './app.model';
import { OrganisationMember } from './organisation-member';
import { ContributionReceipt } from './contribution-receipt';
import { ContributionType } from './contribution-type';
import * as moment from 'moment';

export class Contribution extends AppModel {

  public id: any;
  public organisation_member_id: number;
  public amount: number;
  public week: number;
  public month: number;
  public year: number;
  public _organisation_member: OrganisationMember;
  public _contribution_receipt: ContributionReceipt;
  public _contribution_type: ContributionType;
  public currency_code: string;
  public currency_id: number;

  constructor(data) {
    super(data);
  }

  set organisation_member(value) {
    this._organisation_member = new OrganisationMember(value);
  }

  get organisation_member(): OrganisationMember {
    return this._organisation_member;
  }

  set contribution_receipt(value) {
    this._contribution_receipt = new ContributionReceipt(value);
  }

  get contribution_receipt(): ContributionReceipt {
    return this._contribution_receipt;
  }

  set contribution_type(value) {
    this._contribution_type = new ContributionType(value);
  }

  get contribution_type(): ContributionType {
    return this._contribution_type;
  }

  period() {
    const month = moment().month(this.month - 1).format('MMM');
    return `Wk ${this.week}, ${month} ${this.year}`;
  }
}

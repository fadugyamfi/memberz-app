import { AppModel } from './app.model';

export class ContributionType extends AppModel {

  
  public name: string;
  public description: string;
  public active: boolean;
  public currency_id: number;
  public fix_amount_per_period: boolean;
  public fixed_amount: number;
  public member_required: string;
  public system_generated: boolean;

  constructor(data) {
    super(data);
  }

  isMemberSpecific() {
    return this.member_required === 'Required';
  }
}

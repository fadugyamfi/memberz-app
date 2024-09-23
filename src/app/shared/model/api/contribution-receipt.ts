import { AppModel } from './app.model';

export class ContributionReceipt extends AppModel {

  
  public receipt_dt: string;
  public receipt_no: string;

  constructor(data) {
    super(data);
  }
}

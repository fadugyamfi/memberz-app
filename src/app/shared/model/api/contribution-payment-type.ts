import { AppModel } from './app.model';

export class ContributionPaymentType extends AppModel {

  public id: any;
  public name: string;

  constructor(data) {
    super(data);
  }
}

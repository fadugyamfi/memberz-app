
import { AppModel } from './app.model';

export class SubscriptionType extends AppModel {

  public id: any;
  public name: string;
  public description: string;

  constructor(data) {
    super(data);
  }
}


import { AppModel } from './app.model';

export class TransactionType extends AppModel {

  public id: any;
  public group: string;
  public name: string;
  public active: boolean;

  constructor(data) {
    super(data);
  }
}

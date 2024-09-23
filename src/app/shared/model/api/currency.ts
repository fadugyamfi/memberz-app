
import { AppModel } from './app.model';

export class Currency extends AppModel {

  
  public currency_code: string;

  constructor(data) {
    super(data);
  }
}

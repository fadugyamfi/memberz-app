
import { AppModel } from './app.model';
import * as moment from 'moment';

export class Currency extends AppModel {

  public id: any;
  public currency_code: string;

  constructor(data) {
    super(data);
  }
}
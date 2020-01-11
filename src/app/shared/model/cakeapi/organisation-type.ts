
import { AppModel } from './app.model';
import * as moment from 'moment';

export class OrganisationType extends AppModel {

  public id: any;
  public name: string

  constructor(data) {
    super(data);
  }
}

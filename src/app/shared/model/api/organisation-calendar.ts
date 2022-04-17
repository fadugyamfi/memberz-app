
import { AppModel } from './app.model';

export class OrganisationCalendar extends AppModel {

  public id: any;
  public name: string;
  public color: string;
  public is_default: boolean;

  constructor(data) {
    super(data);
  }
}

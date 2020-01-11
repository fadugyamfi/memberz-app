
import { AppModel } from './app.model';

export class OrganisationRole extends AppModel {

  public id: any;
  public organisation_id: number;
  public name: string;
  public description: string;
  public active: number;
  public admin_access: number;
  public weekly_activity_update: number;
  public birthday_updates: number;

  constructor(data) {
    super(data);
  }

}

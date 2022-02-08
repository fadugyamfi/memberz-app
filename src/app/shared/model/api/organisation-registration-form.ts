
import { AppModel } from './app.model';

export class OrganisationRegistrationForm extends AppModel {

  public id: any;
  public name: string;
  public description: string;
  public expiration_dt: string;
  public excluded_standard_fields: any;
  public custom_fields: string;
  public deleted_at: string;

  constructor(data) {
    super(data);
  }
}

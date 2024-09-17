
import { AppModel } from './app.model';

export class OrganisationSetting extends AppModel {

  
  public organisation_id: any;
  public organisation_setting_type_id: number;
  public value: any;

  constructor(data) {
    super(data);
  }
}


import { AppModel } from './app.model';

export class OrganisationAnniversary extends AppModel {

  public id: any;
  public organisation_id: number;
  public name: string;
  public description: string;
  public organisation_member_anniversary_count: number;
  public show_on_reg_forms: boolean;
  public send_anniversary_message: boolean;
  public message: string;
  public notify_on_anniversary: boolean;
  public active: boolean;

  constructor(data) {
    super(data);
  }

}

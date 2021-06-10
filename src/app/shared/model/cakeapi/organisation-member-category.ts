
import { AppModel } from './app.model';

export class OrganisationMemberCategory extends AppModel {

  public id: any;
  public name: string;
  public description: string;
  public rank: number;
  public default: number;
  public organisation_member_count: number;

  constructor(data) {
    super(data);
  }
}

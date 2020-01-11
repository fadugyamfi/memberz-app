
import { AppModel } from './app.model';

export class OrganisationMemberCategory extends AppModel {

  public id: any;
  public name: string;
  public description: string;
  public rank: number;
  public default: number;

  constructor(data) {
    super(data);
  }
}

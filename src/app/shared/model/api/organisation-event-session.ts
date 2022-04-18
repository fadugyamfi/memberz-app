
import { AppModel } from './app.model';


export class OrganisationEventSession extends AppModel {

  public id: any;
  public session_name: string;
  public session_dt: any;

  constructor(data) {
    super(data);
  }

  get name() {
    return this.session_name;
  }
}


import { AppModel } from './app.model';

export class SystemSetting extends AppModel {

  public id: any;
  public setting_type_id: number;
  public name: string;
  public type: string;
  public value: any;
  public description: string;

  constructor(data) {
    super(data);
  }
}

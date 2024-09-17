
import { AppModel } from './app.model';

export class Bank extends AppModel {

  
  public name: string;
  public short_code: string;

  constructor(data) {
    super(data);
  }
}

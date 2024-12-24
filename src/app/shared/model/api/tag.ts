
import { AppModel } from './app.model';

export class Tag extends AppModel {

  public name: object;
  public slug: object;
  public type: string | null;

  constructor(data: object) {
    super(data);
  }
}

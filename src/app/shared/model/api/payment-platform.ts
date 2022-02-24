
import { AppModel } from './app.model';

export class PaymentPlatform extends AppModel {

  public id: any;
  public name: string;
  public description: string;
  public method_name: string;
  public _config_keys: string[];
  public instructions: string;

  constructor(data) {
    super(data);
  }

  set config_keys(value) {
    this._config_keys = `${value}`.split(',').map(item => item.trim());
  }

  get config_keys(): string[] {
    return this._config_keys;
  }
}

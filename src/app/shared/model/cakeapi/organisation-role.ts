
import { AppModel } from './app.model';
import { Permission } from './permission.model';

export class OrganisationRole extends AppModel {

  public id: any;
  public organisation_id: number;
  public name: string;
  public description: string;
  public active: number;
  public admin_access: number;
  public weekly_activity_update: number;
  public birthday_updates: number;

  private _permissions: Permission[];

  constructor(data) {
    super(data);
  }

  set permissions(values: Array<any>) {
    this._permissions = values.map(data => new Permission(data));
  }

  get permissions() {
    return this._permissions;
  }

  hasPermission(name) {
    return this.permissions.some(value => value.name == name);
  }
}

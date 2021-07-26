import { Permission } from "../../../shared/model/api/permission.model";


export class PermissionGroup {

  public id;
  public _name;
  public groups: PermissionGroup[] = [];
  public permissions: Permission[] = [];
  public collapsed = true;

  constructor(data) {
    Object.assign(this, data);
  }

  set name(value) {
    this._name = value.replace(/_/g, " ");
  }

  get name() {
    return this._name;
  }

  addGroup(group: PermissionGroup) {
    this.groups.push(group);
  }

  addPermission(permission: Permission) {
    this.permissions.push(permission);
  }

  set selected(value) {
    this.groups.forEach(group => group.selected = value);
    this.permissions.forEach(perm => perm.selected = value);
  }

  get selected() {
    return this.permissions && this.permissions.length > 0 ?
        this.permissions.every(perm => perm.selected) :
        this.groups.every(group => group.selected);
  }

  markSelected(permission, selected = true) {
    this.groups.forEach(group => group.markSelected(permission, selected));

    this.permissions.forEach(perm => {
      if( permission.name == perm.name ) {
        perm.selected = selected;
      }
    });
  }

  totalSelected() {
    let count = 0;

    this.groups.forEach(group => {
      count += group.permissions.filter(perm => perm.selected).length;
    });

    count += this.permissions.filter(perm => perm.selected).length;

    return count;
  }

  totalPermissions() {
    let count = 0;
    this.groups.forEach(group => count += group.permissions.length);

    count += this.permissions.length;

    return count;
  }
}

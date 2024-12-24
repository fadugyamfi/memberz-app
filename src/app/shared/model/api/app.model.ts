import moment from 'moment';

export class AppModel {

  public declare id: any;
  public declare created: string;
  public declare modified: string;

  public declare deleted_at: string;
  public declare created_at: string;
  public declare updated_at: string;

  constructor(data: object) {
    this.update(data);
  }

  update(data: object) {
    Object.assign(this, data);
  }

  whenCreated() {
    return moment(this.created || this.created_at).fromNow();
  }

  lastModified() {
    return moment(this.modified || this.updated_at).fromNow();
  }

  toJSON() {

    // start with an empty object (see other alternatives below)
    const jsonObj = Object.assign({}, this);

    // add all properties
    const proto = Object.getPrototypeOf(this);
    for (const key of Object.getOwnPropertyNames(proto)) {
      const desc = Object.getOwnPropertyDescriptor(proto, key);
      const hasGetter = desc && typeof desc.get === 'function';
      if (hasGetter) {
        jsonObj[key] = this[key];
      }
    }

    return jsonObj;
  }
}

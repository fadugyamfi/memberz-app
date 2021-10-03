import * as moment from 'moment';

export class AppModel {

  public id: any;
  public created: string;
  public modified: string;

  constructor(data: object) {
    this.update(data);
  }

  update(data) {
    Object.assign(this, data);
  }

  whenCreated() {
    return moment(this.created).fromNow();
  }

  lastModified() {
    return moment(this.modified).fromNow();
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

import { AppModel } from './app.model';

export class Permission extends AppModel {

    public id;
    public name;
    public selected = false;

    constructor(data = {}) {
        super(data);
    }

    public actionName() {
      const parts = this.name.split(":");
      return parts[2] ? parts[2].replace(/_/g, " ") : parts[1].replace(/_/g, " ");
    }
}

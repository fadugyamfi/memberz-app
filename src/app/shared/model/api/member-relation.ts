
import { AppModel } from './app.model';

export class MemberRelation extends AppModel {

  public id: any;
  public member_id: number;
  public name: string;
  public gender: string;
  public dob: string;
  public relation_member_id: number;
  public relative_organisation_member_id: number;
  public is_alive: boolean;
  public member_relation_type_id: number;
  public active: boolean;
  public relative;

  constructor(data) {
    super(data);
  }

  profilePhoto() {
    return this.relative?.profile_photo?.thumb_url;
  }
}

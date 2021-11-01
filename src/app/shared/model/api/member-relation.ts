
import { AppModel } from './app.model';
import { MemberRelationType } from './member-relation-type';

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
  public member_relation_type: MemberRelationType;

  constructor(data) {
    super(data);
  }

  profilePhoto() {
    return this.relative?.profile_photo?.thumb_url;
  }

  isParent() {
    return this.member_relation_type?.name === 'Parent';
  }

  isChild() {
    return this.member_relation_type?.name === 'Child';
  }

  isSpouse() {
    return this.member_relation_type?.name === 'Spouse';
  }
}

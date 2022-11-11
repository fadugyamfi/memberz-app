
import { AppModel } from './app.model';

export class Member extends AppModel {

  public id: any;
  public title: string;
  public first_name: string;
  public last_name: string;
  public middle_name: string;
  public member_image: any[];
  public profile_photo: any;
  public email: string;
  public mobile_number: string;
  public occupation: string;
  public business_name: string;
  public dob: string;
  public nationality: string;
  public place_of_birth: string;
  public gender: string;
  public residential_address: string;

  constructor(data) {
    super(data);
  }

  name() {
    return this.firstThenLastName();
  }

  nameWithTitle() {
    return `${this.title} ${this.fullname()}`;
  }

  firstThenLastName() {
    return `${this.first_name} ${this.last_name}`;
  }

  lastThenFirstName() {
    return `${this.last_name} ${this.first_name}`;
  }

  fullname() {
    return `${this.first_name} ${this.middle_name || ''} ${this.last_name}`;
  }

  thumbnail() {
    return this.profile_photo ? this.profile_photo.thumb_url : null;
  }

  image() {
    return this.profile_photo ? this.profile_photo.url : null;
  }
}

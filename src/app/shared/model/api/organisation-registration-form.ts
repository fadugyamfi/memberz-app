
import { Router } from '@angular/router';
import * as moment from 'moment';
import { CustomFieldConfig } from '../../components/forms/custom-field/custom-field.component';
import { AppModel } from './app.model';

export class OrganisationRegistrationForm extends AppModel {

  
  public uuid: string;
  public slug: string;
  public name: string;
  public description: string;
  public _expiration_dt: string;
  public excluded_standard_fields: any;
  public _custom_fields: string;
  public organisation_id: number;
  public organisation_member_category_id: number;
  public decoded_custom_fields;

  constructor(data) {
    super(data);
  }

  get expiration_dt() {
    return this._expiration_dt;
  }

  set expiration_dt(value) {
    this._expiration_dt = value;
  }

  set custom_fields(value) {
    this._custom_fields = value;

    if( value && typeof value == 'string' ) {
      this.decoded_custom_fields = JSON.parse(this.custom_fields);
    }
  }

  get custom_fields() {
    return this._custom_fields;
  }

  get isClosed() {
    return moment().isAfter( moment(this.expiration_dt) );
  }

  private excludesField(fieldName) {
    return this.excluded_standard_fields?.split(',').includes(fieldName);
  }


  excludesBusinessName() {
    return this.excludesField('business_name');
  }

  excludesOccupation() {
    return this.excludesField('occupation');
  }

  excludesEmail() {
    return this.excludesField('email');
  }

  excludesProfession() {
    return this.excludesField('profession');
  }

  excludesGender() {
    return this.excludesField('gender');
  }

  excludesBirthDate() {
    return this.excludesField('dob');
  }
}

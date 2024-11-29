import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrganisationTypeService } from '../../../../shared/services/api/organisation-type.service';
import { OrganisationType } from '../../../../shared/model/api/organisation-type';
import { OrganisationService } from '../../../../shared/services/api/organisation.service';
import { Country } from '../../../../shared/model/api/country';
import { CountryService } from '../../../../shared/services/api/country.service';
import { Organisation } from '../../../../shared/model/api/organisation';
import { CountryISO, PhoneNumberFormat, SearchCountryField, NgxIntlTelInputModule } from 'ngx-intl-tel-input';

import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-profile-step',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, NgxIntlTelInputModule, RouterLink, TranslateModule]
})
export class ProfileComponent implements OnInit {

  public profileForm: UntypedFormGroup;
  public orgTypes: OrganisationType[];
  public countries: Country[];
  private organisation: Organisation;

  @Output() saveProfile = new EventEmitter<Organisation>();


  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.Ghana, CountryISO.Nigeria, CountryISO.Togo];

  constructor(
    public orgTypeService: OrganisationTypeService,
    public organisationService: OrganisationService,
    public countryService: CountryService
  ) { }

  ngOnInit() {
    this.setupProfileForm();
    this.loadOrganisationTypes();
    this.loadCountries();
  }

  setupProfileForm() {
    this.profileForm = new UntypedFormGroup({
      organisation_type_id: new UntypedFormControl('', [Validators.required]),
      name: new UntypedFormControl('', [Validators.required]),
      email: new UntypedFormControl('', [Validators.required, Validators.email]),
      phone: new UntypedFormControl('', [Validators.required]),
      country_id: new UntypedFormControl(80, [Validators.required]),
      address: new UntypedFormControl(''),
      city: new UntypedFormControl(''),
      state: new UntypedFormControl(''),
      post_code: new UntypedFormControl(''),
      website: new UntypedFormControl(''),
      subscription_type_id: new UntypedFormControl(),
      subscription_length: new UntypedFormControl()
    });
  }

  loadOrganisationTypes() {
    this.orgTypeService.getAll({ sort: 'name:asc'}).subscribe((types: OrganisationType[]) => this.orgTypes = types);
  }

  loadCountries() {
    this.countryService.getAll({ active: 1, sort: 'name:asc'}).subscribe((countries: Country[]) => this.countries = countries);
  }

  canExit() {
    return this.profileForm && this.profileForm.valid;
  }

  saveProfileInfo() {
    this.organisation = new Organisation(this.profileForm.value);
    this.organisationService.setSelectedModel(this.organisation);
    this.saveProfile.emit(this.organisation);
  }
}

import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OrganisationTypeService } from '../../../../shared/services/cakeapi/organisation-type.service';
import { OrganisationType } from '../../../../shared/model/cakeapi/organisation-type';
import { OrganisationService } from '../../../../shared/services/cakeapi/organisation.service';
import { Country } from '../../../../shared/model/cakeapi/country';
import { CountryService } from '../../../../shared/services/cakeapi/country.service';
import { Organisation } from '../../../../shared/model/cakeapi/organisation';

@Component({
  selector: 'app-profile-step',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public profileForm: FormGroup;
  public orgTypes: OrganisationType[];
  public countries: Country[];
  private organisation: Organisation;

  @Output() saveProfile = new EventEmitter<Organisation>();

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
    this.profileForm = new FormGroup({
      organisation_type_id: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required]),
      country_id: new FormControl(80, [Validators.required]),
      address: new FormControl(''),
      city: new FormControl(''),
      state: new FormControl(''),
      post_code: new FormControl(''),
      website: new FormControl(''),
      subscription_type_id: new FormControl(),
      subscription_length: new FormControl()
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

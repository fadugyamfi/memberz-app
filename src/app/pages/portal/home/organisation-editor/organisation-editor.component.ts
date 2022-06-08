import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { OrganisationTypeService } from '../../../../shared/services/api/organisation-type.service';
import { OrganisationType } from '../../../../shared/model/api/organisation-type';
import { OrganisationService } from '../../../../shared/services/api/organisation.service';
import { Country } from '../../../../shared/model/api/country';
import { CountryService } from '../../../../shared/services/api/country.service';
import { Organisation } from '../../../../shared/model/api/organisation';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventsService } from '../../../../shared/services/events.service';
import { SubscriptionTypeService } from '../../../../shared/services/api/subscription-type.service';
import { SubscriptionType } from '../../../../shared/model/api/subscription-type';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-organisation-editor-modal',
  templateUrl: './organisation-editor.component.html',
  styleUrls: ['./organisation-editor.component.scss']
})
export class OrganisationEditorComponent implements OnInit, OnDestroy {

  public profileForm: UntypedFormGroup;
  public orgTypes: OrganisationType[];
  public countries: Country[];
  private organisation: Organisation;
  private modalRef: NgbModalRef;
  private freePlan: SubscriptionType;
  public modalTitle;

  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.Ghana, CountryISO.Nigeria, CountryISO.Togo];

  @ViewChild('editorModal', { static: true }) editorModal: ElementRef;
  @Output() saveProfile = new EventEmitter<Organisation>();

  constructor(
    public orgTypeService: OrganisationTypeService,
    public organisationService: OrganisationService,
    public countryService: CountryService,
    public subTypeService: SubscriptionTypeService,
    public modalService: NgbModal,
    public events: EventsService,
    public translate: TranslateService
  ) { }

  ngOnInit() {
    this.setupProfileForm();
    this.loadOrganisationTypes();
    this.loadCountries();
    this.loadSubscriptionTypes();
    this.setupEvents();
  }

  ngOnDestroy() {
    this.removeEvents();
  }

  setupProfileForm() {
    this.profileForm = new UntypedFormGroup({
      id: new UntypedFormControl(),
      organisation_type_id: new UntypedFormControl('', [Validators.required]),
      name: new UntypedFormControl('', [Validators.required]),
      email: new UntypedFormControl('', [Validators.required, Validators.email]),
      phone_intl: new UntypedFormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(15)]),
      country_id: new UntypedFormControl(80, [Validators.required]),
      address: new UntypedFormControl(''),
      city: new UntypedFormControl(''),
      state: new UntypedFormControl(''),
      post_code: new UntypedFormControl(''),
      website: new UntypedFormControl(''),
      subscription_type_id: new UntypedFormControl(this.freePlan ? this.freePlan.id : null),
      subscription_length: new UntypedFormControl(1)
    });
  }

  loadOrganisationTypes() {
    this.orgTypeService.getAll({ sort: 'name:asc' }).subscribe((types: OrganisationType[]) => this.orgTypes = types);
  }

  loadCountries() {
    this.countryService.getAll({ active: 1, sort: 'name:asc' }).subscribe((countries: Country[]) => this.countries = countries);
  }

  loadSubscriptionTypes() {
    this.subTypeService.getAll({ active: 1 }).subscribe((subTypes: SubscriptionType[]) => {
      this.freePlan = subTypes.find((value) => value.name === 'free2');
      this.profileForm.patchValue({ subscription_type_id: this.freePlan.id });
    });
  }

  setupEvents() {
    this.events.on('Organisation:created', () => this.hide());
    this.events.on('Organisation:updated', () => this.hide());
  }

  removeEvents() {
    this.events.off('Organisation:created');
    this.events.off('Organisation:updated');
  }

  onSubmit(e: Event) {
    e.preventDefault();

    if (!this.profileForm.valid) {
      return;
    }

    const input = this.profileForm.value;
    input.phone = input.phone_intl.e164Number;

    this.organisation = new Organisation(input);
    const params = { contain: ['active_subscription.subscription_type', 'organisation_type'].join() };

    if (this.organisation.id) {
      return this.organisationService.update(this.organisation, params);
    }

    return this.organisationService.create(this.organisation, params);
  }

  show(organisation: Organisation = null) {
    this.setupProfileForm();
    this.modalRef = this.modalService.open(this.editorModal, { size: 'lg' });

    if (organisation) {
      this.modalTitle = this.translate.instant('Update Organisation Info');
      this.profileForm.patchValue(organisation);
    } else {
      this.modalTitle = this.translate.instant('Create New Organisation') + ' - ' + this.translate.instant('Free Plan');
    }
  }

  hide() {
    this.modalRef.close();
  }
}

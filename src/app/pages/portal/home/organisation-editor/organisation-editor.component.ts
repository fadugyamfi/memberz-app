import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OrganisationTypeService } from '../../../../shared/services/cakeapi/organisation-type.service';
import { OrganisationType } from '../../../../shared/model/cakeapi/organisation-type';
import { OrganisationService } from '../../../../shared/services/cakeapi/organisation.service';
import { Country } from '../../../../shared/model/cakeapi/country';
import { CountryService } from '../../../../shared/services/cakeapi/country.service';
import { Organisation } from '../../../../shared/model/cakeapi/organisation';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventsService } from '../../../../shared/services/events.service';
import { SubscriptionTypeService } from '../../../../shared/services/cakeapi/subscription-type.service';
import { SubscriptionType } from '../../../../shared/model/cakeapi/subscription-type';

@Component({
  selector: 'app-organisation-editor-modal',
  templateUrl: './organisation-editor.component.html',
  styleUrls: ['./organisation-editor.component.scss']
})
export class OrganisationEditorComponent implements OnInit, OnDestroy {

  public profileForm: FormGroup;
  public orgTypes: OrganisationType[];
  public countries: Country[];
  private organisation: Organisation;
  private modalRef: NgbModalRef;
  private freePlan: SubscriptionType;
  public modalTitle = 'Create New Organisation - Free Plan';

  @ViewChild('editorModal', { static: true }) editorModal: ElementRef;
  @Output() saveProfile = new EventEmitter<Organisation>();

  constructor(
    public orgTypeService: OrganisationTypeService,
    public organisationService: OrganisationService,
    public countryService: CountryService,
    public subTypeService: SubscriptionTypeService,
    public modalService: NgbModal,
    public events: EventsService
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
    this.profileForm = new FormGroup({
      id: new FormControl(),
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
      subscription_type_id: new FormControl(this.freePlan ? this.freePlan.id : null),
      subscription_length: new FormControl(1)
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

    this.organisation = new Organisation(this.profileForm.value);
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
      this.modalTitle = 'Update Organisation Info';
      this.profileForm.patchValue(organisation);
    }
  }

  hide() {
    this.modalRef.close();
  }
}

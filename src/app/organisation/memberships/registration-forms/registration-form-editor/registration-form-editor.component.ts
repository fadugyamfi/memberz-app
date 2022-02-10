import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrganisationRegistrationFormService } from '../../../../shared/services/api/organisation-registration-form.service';
import { EventsService } from '../../../../shared/services/events.service';
import { OrganisationService } from '../../../../shared/services/api/organisation.service';
import { OrganisationRegistrationForm } from '../../../../shared/model/api/organisation-registration-form';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { OrganisationMemberCategoryService } from '../../../../shared/services/api/organisation-member-category.service';
import { OrganisationMemberCategory } from '../../../../shared/model/api/organisation-member-category';

@Component({
  selector: 'app-registration-form-editor',
  templateUrl: './registration-form-editor.component.html',
  styleUrls: ['./registration-form-editor.component.scss']
})
export class RegistrationFormEditorComponent implements OnInit, OnDestroy {

  @ViewChild('customFieldEditor', { static: true }) customFieldEditor: any;
  public editorForm: FormGroup;

  public selectedCustomFieldGroup: FormGroup
  public categories: OrganisationMemberCategory[] = [];

  public standardFields = [
    {field: 'email', label: 'Email'},
    {field: 'gender', label: 'Gender'},
    {field: 'dob', label: 'Birth Date'},
    {field: 'business_name', label: 'Place of Work'},
    {field: 'occupation', label: 'Occupation'},
    {field: 'profession', label: 'Profession'},
  ];

  constructor(
    public registrationFormService: OrganisationRegistrationFormService,
    private modalService: NgbModal,
    public events: EventsService,
    public organisationService: OrganisationService,
    public router: Router,
    public route: ActivatedRoute,
    public categoryService: OrganisationMemberCategoryService
  ) { }

  ngOnInit(): void {
    this.setupEditorForm();
    this.setupEvents();
    this.loadRegistrationForm();
    this.loadMembershipCategories();
  }

  ngOnDestroy(): void {
    this.removeEvents();
  }

  loadRegistrationForm() {
    const form_id = this.route.snapshot.paramMap.get('id');
    const form = this.registrationFormService.getSelectedModel();

    if( form ) {
      this.updateEditorFormForEditing(form);
      return;
    }

    if( form_id ) {
      this.registrationFormService.getById(form_id).subscribe(form => {
        this.updateEditorFormForEditing(form);
      });
    }
  }

  loadMembershipCategories() {
    this.categoryService.getAll({ sort: 'name:asc' }).subscribe(categories => {
      this.categories = categories;
    });
  }

  get customFields(): FormArray {
    return this.editorForm.controls.custom_fields as FormArray;
  }

  setupEditorForm() {
    const standardFieldGroups = this.standardFields.map(item => {
      return this.createStandardFieldGroup( item.field );
    });

    this.editorForm = new FormGroup({
      id: new FormControl(''),
      organisation_id: new FormControl( this.organisationService.getActiveOrganisation().id ),
      organisation_member_category_id: new FormControl('', Validators.required),
      name: new FormControl('', [Validators.required]),
      expiration_dt: new FormControl(''),
      excluded_standard_fields: new FormArray([ ...standardFieldGroups ]),
      custom_fields: new FormArray([])
    });
  }

  updateEditorFormForEditing(form: OrganisationRegistrationForm) {
    const excludedFieldsArray = form.excluded_standard_fields?.split(',');

    const data = Object.assign({}, form, {
      expiration_dt: form.expiration_dt ? moment(form.expiration_dt).format('YYYY-MM-DDTHH:mm:ss') : '',
      custom_fields: JSON.parse(form.custom_fields),
      excluded_standard_fields: this.standardFields.map(item => {
        return {
          field: item.field,
          excluded: excludedFieldsArray?.includes(item.field)
        };
      })
    });

    data.custom_fields.forEach(element => {
      this.addCustomFieldGroup(element);
    });

    this.editorForm.patchValue(data);
  }

  createStandardFieldGroup(fieldName) {
    return new FormGroup({
      field: new FormControl(fieldName),
      excluded: new FormControl('')
    });
  }

  createCustomFieldGroup(values = null) {
    const group = new FormGroup({
      id: new FormControl(),
      name: new FormControl(''),
      type: new FormControl(''),
      label: new FormControl(''),
      placeholder: new FormControl(''),
      required: new FormControl(''),
      options: new FormArray([])
    })

    if( values?.options?.length > 0 ) {
      values.options.forEach(() => {
        (group.controls.options as FormArray).push(new FormGroup({
          label: new FormControl(''),
          value: new FormControl('')
        }))
      });
    }

    group.patchValue(values);

    return group;
  }

  addCustomField() {
    this.customFieldEditor.show();
  }

  editCustomField(group, index) {
    this.customFieldEditor.show(group, index);
  }

  addCustomFieldGroup(values) {
    this.customFields.push(this.createCustomFieldGroup(values));
  }

  updateCustomFieldGroup(field: { index: number; group: any; }) {
    this.customFields.at(field.index).patchValue(field.group);
  }

  removeCustomFieldGroup(index: number) {
    this.customFields.removeAt(index);
  }

  resetForm() {
    this.editorForm.reset();
  }

  cancel() {
    this.goToRegistrationForms();
  }

  goToRegistrationForms() {
    this.router.navigate(['/organisation/memberships/registration-forms']);
  }

  setupEvents() {
    this.events.on('OrganisationRegistrationForm:created', () => {
      this.goToRegistrationForms();
    });

    this.events.on('OrganisationRegistrationForm:updated', () => {
      this.goToRegistrationForms();
    });
  }

  removeEvents() {
    this.events.off('OrganisationRegistrationForm:created');
    this.events.off('OrganisationRegistrationForm:updated');
  }

  onSubmit(e) {
    e.preventDefault();

    if( !this.editorForm.valid ) {
      return;
    }

    const form = new OrganisationRegistrationForm(this.editorForm.value);
    form.custom_fields = JSON.stringify(form.custom_fields);
    form.excluded_standard_fields = form.excluded_standard_fields.filter(item => item.excluded).map(item => item.field).join(',');

    if( form.id ) {
      return this.registrationFormService.update(form);
    }

    return this.registrationFormService.create(form);
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrganisationRegistrationFormService } from '../../../../shared/services/api/organisation-registration-form.service';
import { EventsService } from '../../../../shared/services/events.service';
import { OrganisationService } from '../../../../shared/services/api/organisation.service';
import { OrganisationRegistrationForm } from '../../../../shared/model/api/organisation-registration-form';

@Component({
  selector: 'app-registration-form-editor',
  templateUrl: './registration-form-editor.component.html',
  styleUrls: ['./registration-form-editor.component.scss']
})
export class RegistrationFormEditorComponent implements OnInit {

  @ViewChild('customFieldEditor', { static: true }) customFieldEditor: any;
  public editorForm: FormGroup;

  public selectedCustomFieldGroup: FormGroup

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
    public organisationService: OrganisationService
  ) { }

  ngOnInit(): void {
    this.setupEditorForm();
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
      name: new FormControl('', [Validators.required]),
      expiration_dt: new FormControl(''),
      excluded_standard_fields: new FormArray([ ...standardFieldGroups ]),
      custom_fields: new FormArray([])
    });
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
      type: new FormControl('', [Validators.required]),
      label: new FormControl('', [Validators.required]),
      placeholder: new FormControl(''),
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

  editCustomField(group) {
    this.customFieldEditor.show(group);
  }

  addCustomFieldGroup(values) {
    this.customFields.push(this.createCustomFieldGroup(values));
  }

  removeCustomFieldGroup(index: number) {
    this.customFields.removeAt(index);
  }



  resetForm() {
    this.editorForm.reset();
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

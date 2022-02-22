import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { OrganisationRegistrationFormService } from '../../../../shared/services/api/organisation-registration-form.service';
import { EventsService } from '../../../../shared/services/events.service';

@Component({
  selector: 'app-custom-field-editor',
  templateUrl: './custom-field-editor.component.html',
  styleUrls: ['./custom-field-editor.component.scss']
})
export class CustomFieldEditorComponent implements OnInit {

  @ViewChild('customFieldModal', { static: true }) customFieldModal: any;

  public customFieldForm: FormGroup;
  public modal: NgbModalRef;
  public editing = false;
  public editIndex = 0;

  @Output() public create = new EventEmitter();
  @Output() public update = new EventEmitter();

  constructor(
    public registrationFormService: OrganisationRegistrationFormService,
    private modalService: NgbModal,
    public events: EventsService
  ) { }

  ngOnInit(): void {
    this.setupForm();
  }

  generateGuid() : string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  toSnakeCase(str) {
    return str && str
      .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
      .map(x => x.toLowerCase())
      .join('_');
  }

  setupForm() {
    this.customFieldForm = new FormGroup({
      id: new FormControl(this.generateGuid()),
      name: new FormControl('', Validators.required),
      type: new FormControl('text', [Validators.required]),
      label: new FormControl('', [Validators.required]),
      placeholder: new FormControl(''),
      required: new FormControl(false),
      options: new FormArray([ this.createFieldOptionGroup() ])
    })

    this.customFieldForm.valueChanges.subscribe(values => {
      if( values.type != 'select' ) {
        this.customFieldForm.controls.options = new FormArray([ this.createFieldOptionGroup() ]);
      }
    });
  }

  forceSnakeCase(event: Event) {
    this.customFieldForm.controls.name.setValue( this.toSnakeCase((event.target as HTMLInputElement).value) );
  }

  createFieldOptionGroup() {
    return new FormGroup({
      label: new FormControl(''),
      value: new FormControl('')
    });
  }

  get optionGroups(): FormArray {
    return this.customFieldForm.controls.options as FormArray;
  }

  addFieldOptionGroup() {
    this.optionGroups?.push( this.createFieldOptionGroup() );
  }

  removeFieldOptionGroup(index: number) {
    this.optionGroups?.removeAt(index);
  }

  show(group = null, index = 0) {
    this.editing = false;
    this.setupForm();

    if( group ) {
      if( group.options && group.options.length > 0 ) {
        group.options.forEach(() => this.addFieldOptionGroup());
      }

      this.editing = true;
      this.editIndex = index;
      this.customFieldForm.patchValue(group);
    }

    this.modal = this.modalService.open(this.customFieldModal, { size: 'lg' });
  }

  onSubmit(e) {
    e.preventDefault();

    if( this.editing ) {
      this.update.emit({ group: this.customFieldForm.value, index: this.editIndex });
    } else {
      this.create.emit( this.customFieldForm.value );
    }

    this.modal.close();
  }

  selectTypeSelected() {
    return this.customFieldForm.value.type == 'select';
  }
}

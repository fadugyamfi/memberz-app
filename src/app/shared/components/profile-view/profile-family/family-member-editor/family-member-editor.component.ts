import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { MemberRelation } from '../../../../../shared/model/api/member-relation';
import { MemberRelationType } from '../../../../../shared/model/api/member-relation-type';
import { OrganisationMember } from '../../../../../shared/model/api/organisation-member';
import { MemberRelationTypeService } from '../../../../../shared/services/api/member-relation-type.service';
import { MemberRelationService } from '../../../../../shared/services/api/member-relation.service';
import { EventsService } from '../../../../../shared/services/events.service';
import { NgIf, NgFor } from '@angular/common';
import { UiSwitchModule } from 'ngx-ui-switch';
import { MemberControlComponent } from '../../../forms/member-control/member-control.component';

const SELECT_OPTION = 'select-option';
const ADD_EXISTING = 'add-existing';
const ADD_NEW = 'add-new';
const EDIT = 'edit';

interface RelationEditorOptions {
  reset?: boolean;
  relation?: MemberRelation;
}
@Component({
    selector: 'app-family-member-editor',
    templateUrl: './family-member-editor.component.html',
    styleUrls: ['./family-member-editor.component.scss'],
    standalone: true,
    imports: [FormsModule, NgIf, ReactiveFormsModule, NgFor, UiSwitchModule, MemberControlComponent, TranslateModule]
})
export class FamilyMemberEditorComponent implements OnInit, OnDestroy {

  @ViewChild('editor', { static: true }) editor: any;

  public selectOptionForm: UntypedFormGroup;
  public newProfileForm: UntypedFormGroup;
  public existingProfileForm: UntypedFormGroup;

  public mbshp: OrganisationMember;
  public rel: MemberRelation;
  public subscriptions: Subscription[] = [];
  public editorTitle = 'Add / Edit Family Member';
  public editorIcon = 'fa-user-plus';

  public currentView = 'select-option';

  public relationTypes: MemberRelationType[];

  constructor(
    public modalService: NgbModal,
    public relationTypeService: MemberRelationTypeService,
    public relationService: MemberRelationService,
    public events: EventsService,
    public $t: TranslateService
  ) { }

  ngOnInit(): void {
    this.setupSelectOptionForm();
    this.loadRelationTypes();
    this.setupEvents();
  }

  ngOnDestroy() {
    this.removeEvents();
  }

  @Input()
  set membership(value) {
    this.mbshp = value;
    this.setupForms();
  }

  get membership(): OrganisationMember {
    return this.mbshp;
  }

  @Input()
  set relation(value) {
    this.rel = value;
  }

  get relation(): MemberRelation {
    return this.rel;
  }

  setupEvents() {
    this.events.on('MemberRelation:created', () => {
      this.modalService.dismissAll();
    });

    this.events.on('MemberRelation:updated', () => {
      this.modalService.dismissAll();
    });
  }

  removeEvents() {
    this.events.off('MemberRelation:created');
    this.events.off('MemberRelation:updated');
  }

  onSubmit(e) {
    e.preventDefault();

    const newProfileFormIsValid = (this.isAddNewView() || this.isEditView()) && !this.newProfileForm.invalid;
    const existingProfileFormIsValid = this.isAddExistingView() && !this.existingProfileForm.invalid;

    if (!newProfileFormIsValid && !existingProfileFormIsValid) {
      return;
    }

    if (this.isAddNewView()) {
      const relation = new MemberRelation(this.newProfileForm.value);
      return this.relationService.create(relation);
    }

    if( this.isAddExistingView() ) {
      const relation = new MemberRelation(this.existingProfileForm.value);
      return this.relationService.create(relation);
    }

    if ( this.isEditView() ) {
      const relation = new MemberRelation(this.newProfileForm.value);
      return this.relationService.update(relation);
    }
  }

  cancel() {

  }

  loadRelationTypes() {
    this.relationTypeService.getAll().subscribe(relationTypes => this.relationTypes = relationTypes);
  }

  setupSelectOptionForm() {
    this.selectOptionForm = new UntypedFormGroup({
      source: new UntypedFormControl(ADD_EXISTING, Validators.required)
    });
  }

  setupForms() {
    this.newProfileForm = this.existingProfileForm = new UntypedFormGroup({
      id: new UntypedFormControl(),
      member_id: new UntypedFormControl(this.membership.member_id),
      member_relation_type_id: new UntypedFormControl('', Validators.required),
      name: new UntypedFormControl('', Validators.required),
      gender: new UntypedFormControl('', Validators.required),
      dob: new UntypedFormControl(''),
      is_alive: new UntypedFormControl(1),
      relation_member_id: new UntypedFormControl()
    });
  }

  isSelectOptionView() {
    return this.currentView === SELECT_OPTION;
  }

  isAddExistingView() {
    return this.currentView === ADD_EXISTING;
  }

  isAddNewView() {
    return this.currentView === ADD_NEW;
  }

  isEditView() {
    return this.currentView === EDIT;
  }

  goToNextView() {
    this.currentView = this.selectOptionForm.value.source;
  }

  open(options?: RelationEditorOptions) {
    if (options.reset) {
      this.currentView = SELECT_OPTION;
      this.selectOptionForm.reset();
      this.newProfileForm.reset();
      this.existingProfileForm.reset();

      this.setupForms();
    }

    if ( options.relation ) {
      this.setupForms();
      this.newProfileForm.patchValue(options.relation);
      this.currentView = EDIT;
    }

    this.modalService.open(this.editor, { animation: true, centered: true });
  }

  setExistingMember(membership: OrganisationMember) {
    const values = {
      member_id: this.membership.member_id,
      name: membership.member.firstThenLastName(),
      dob: membership.member.dob,
      gender: membership.member.gender,
      relation_member_id: membership.member_id
    }
    this.existingProfileForm.patchValue(values);
  }
}

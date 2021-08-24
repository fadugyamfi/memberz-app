import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { MemberRelation } from '../../../../../shared/model/api/member-relation';
import { MemberRelationType } from '../../../../../shared/model/api/member-relation-type';
import { OrganisationMember } from '../../../../../shared/model/api/organisation-member';
import { MemberRelationTypeService } from '../../../../../shared/services/api/member-relation-type.service';
import { MemberRelationService } from '../../../../../shared/services/api/member-relation.service';
import { EventsService } from '../../../../../shared/services/events.service';

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
  styleUrls: ['./family-member-editor.component.scss']
})
export class FamilyMemberEditorComponent implements OnInit, OnDestroy {

  @ViewChild('editor', { static: true }) editor: any;

  public selectOptionForm: FormGroup;
  public newProfileForm: FormGroup;
  public existingProfileForm: FormGroup;

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
    this.setupNewProfileForm();
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
    const existingProfileFormIsValid = this.isAddExistingView && !this.existingProfileForm.invalid;

    if (!newProfileFormIsValid || !existingProfileFormIsValid) {
      return;
    }

    if (this.isAddNewView()) {
      const relation = new MemberRelation(this.newProfileForm.value);
      return this.relationService.create(relation);
    }

    if ( this.isEditView() ) {
      const relation = new MemberRelation(this.newProfileForm.value);
      return this.relationService.update(relation);
    }

    const existing = new MemberRelation(this.newProfileForm.value);
    return this.relationService.create(existing);
  }

  cancel() {

  }

  loadRelationTypes() {
    this.relationTypeService.getAll().subscribe(relationTypes => this.relationTypes = relationTypes);
  }

  setupSelectOptionForm() {
    this.selectOptionForm = new FormGroup({
      source: new FormControl(ADD_EXISTING, Validators.required)
    });
  }

  setupNewProfileForm() {
    this.newProfileForm = new FormGroup({
      id: new FormControl(),
      member_id: new FormControl(this.membership.member_id),
      member_relation_type_id: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      dob: new FormControl(''),
      is_alive: new FormControl(1)
    });

    this.existingProfileForm = new FormGroup({});
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

      this.setupNewProfileForm();
    }

    if ( options.relation ) {
      this.setupNewProfileForm();
      this.newProfileForm.patchValue(options.relation);
      this.currentView = EDIT;
    }

    this.modalService.open(this.editor, { animation: true, centered: true });
  }
}

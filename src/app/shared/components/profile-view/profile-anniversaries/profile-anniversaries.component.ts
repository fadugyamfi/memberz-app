import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { EventsService } from '../../../../shared/services/events.service';
import { OrganisationMemberAnniversaryService } from '../../../../shared/services/api/organisation-member-anniversary.service';
import { OrganisationAnniversaryService } from '../../../../shared/services/api/organisation-anniversary.service';
import { OrganisationMember } from '../../../../shared/model/api/organisation-member';
import { OrganisationMemberAnniversary } from '../../../model/api/organisation-member-anniversary';
import { UntypedFormControl, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-profile-anniversaries',
    templateUrl: './profile-anniversaries.component.html',
    styleUrls: ['./profile-anniversaries.component.scss'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, DatePipe, TranslateModule]
})
export class ProfileAnniversariesComponent implements OnInit, OnDestroy {

  @ViewChild('editorModal', { static: true }) editorModal: any;

  public subscriptions: Subscription[] = [];
  public mbsp: OrganisationMember;
  public selectedAnniversary: OrganisationMemberAnniversary;
  public editorForm: UntypedFormGroup;

  constructor(
    public modalService: NgbModal,
    public events: EventsService,
    public $t: TranslateService,
    public anniversaryService: OrganisationMemberAnniversaryService,
    public anniversaryTypeService: OrganisationAnniversaryService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.loadAnniversaries();
    this.loadAnniversaryTypes();
    this.setupEvents();
    this.setupEditorForm();
  }

  ngOnDestroy() {
    this.removeEvents();
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  setupEvents() {
    this.events.on('OrganisationMemberAnniversary:created', () => this.modalService.dismissAll());
    this.events.on('OrganisationMemberAnniversary:updated', () => this.modalService.dismissAll());
    this.events.on('OrganisationMemberAnniversary:deleted', () => Swal.close());
  }

  removeEvents() {
    this.events.off('OrganisationMemberAnniversary:deleted');
  }

  loadAnniversaries() {
    const sub = this.anniversaryService.getAll({
      organisation_member_id: this.membership.id
    }).subscribe();

    this.subscriptions.push(sub);
  }

  loadAnniversaryTypes() {
    const sub = this.anniversaryTypeService.getAll({ sort: 'name:asc' }).subscribe();
    this.subscriptions.push(sub);
  }

  @Input()
  set membership(value) {
    this.mbsp = value;
  }

  get membership(): OrganisationMember {
    return this.mbsp;
  }

  deleteAnniversary(anniversary: OrganisationMemberAnniversary) {
    Swal.fire({
      title: this.$t.instant('Confirm Deletion'),
      text: this.$t.instant(`This action will delete the selected anniversary and cannot be reverted`),
      icon: 'warning',
      showCancelButton: true
    }).then((action) => {
      if (action.value) {
        Swal.fire(
          this.$t.instant('Deleting Anniversary'),
          this.$t.instant('Please wait') + '...',
          'error'
        );
        Swal.showLoading();
        this.anniversaryService.remove(anniversary);
      }
    });
  }

  setupEditorForm() {
    this.editorForm = new UntypedFormGroup({
      id: new UntypedFormControl(),
      organisation_id: new UntypedFormControl(this.membership.organisation_id),
      organisation_anniversary_id: new UntypedFormControl('', Validators.required),
      organisation_member_id: new UntypedFormControl(this.membership.id, Validators.required),
      value: new UntypedFormControl('', Validators.required),
      note: new UntypedFormControl('')
    });
  }

  showEditor(memberAnniversary?: OrganisationMemberAnniversary, options = { reset: true }) {
    if ( options.reset ) {
      this.setupEditorForm();
    }

    this.editorForm.patchValue(memberAnniversary);
    this.modalService.open(this.editorModal);
  }

  onSubmit(event) {
    event.preventDefault();

    if ( !this.editorForm.valid ) {
      return;
    }

    const memberAnniversary = new OrganisationMemberAnniversary(this.editorForm.value);

    if ( memberAnniversary.id ) {
      return this.anniversaryService.update(memberAnniversary);
    }

    return this.anniversaryService.create(memberAnniversary);
  }
}

import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { OrganisationMember } from '../../../../shared/model/api/organisation-member';
import { OrganisationMemberGroup } from '../../../../shared/model/api/organisation-member-group';
import { OrganisationMemberGroupService } from '../../../../shared/services/api/organisation-member-group.service';
import { OrganisationGroupTypeService } from '../../../../shared/services/api/organisation-group-type.service';
import { EventsService } from '../../../../shared/services/events.service';
import { OrganisationGroupType } from '../../../../shared/model/api/organisation-group-type';

@Component({
  selector: 'app-profile-groups',
  templateUrl: './profile-groups.component.html',
  styleUrls: ['./profile-groups.component.scss']
})
export class ProfileGroupsComponent implements OnInit, OnDestroy {

  @ViewChild('assignmentModal', { static: true }) assignmentModal: any;

  public mbsp: OrganisationMember;
  public assignmentForm: FormGroup;
  public selectedGroupType;

  constructor(
    public memberGroupService: OrganisationMemberGroupService,
    public events: EventsService,
    public modalService: NgbModal,
    public translate: TranslateService,
    public orgGroupTypes: OrganisationGroupTypeService
  ) { }

  ngOnInit(): void {
    this.loadAssignedGroups();
    this.setupAssignmentForm();
    this.setupEvents();
    this.loadGroupTypesWithGroups();
  }

  ngOnDestroy() {
    this.removeEvents();
  }

  @Input()
  set membership(value) {
    this.mbsp = value;
  }

  get membership(): OrganisationMember {
    return this.mbsp;
  }

  loadAssignedGroups() {
    this.memberGroupService.getAll({
      organisation_member_id: this.membership.id
    }).subscribe();
  }

  loadGroupTypesWithGroups() {
    this.orgGroupTypes.getAll({
      contain: ['organisation_groups'].join(),
      sort: 'name:asc'
    }).subscribe();
  }

  getMemberGroups() {
    return this.memberGroupService.getItems().filter(mg => mg.organisation_group != null);
  }

  setupAssignmentForm() {
    this.assignmentForm = new FormGroup({
      id: new FormControl(),
      organisation_id: new FormControl(this.membership.organisation_id),
      organisation_member_id: new FormControl(this.membership.id, Validators.required),
      organisation_group_id: new FormControl('', Validators.required),
      organisation_group_type_id: new FormControl('', Validators.required),
    });
  }

  setupEvents() {
    this.events.on('OrganisationMemberGroup:created', (memberGroup) => {
      this.modalService.dismissAll();
    });

    this.events.on('OrganisationMemberGroup:updated', (memberGroup) => {
      this.modalService.dismissAll();
    });

    this.events.on('OrganisationMemberGroup:deleted', (memberGroup) => {
      Swal.close();
    });
  }

  removeEvents() {
    this.events.off('OrganisationMemberGroup:created');
    this.events.off('OrganisationMemberGroup:updated');
    this.events.off('OrganisationMemberGroup:deleted');
  }

  showEditor(options = { reset: true }) {
    if ( options.reset ) {
      this.setupAssignmentForm();
    }

    this.modalService.open(this.assignmentModal);
  }

  editAssignment(memberGroup: OrganisationMemberGroup) {
    this.assignmentForm.patchValue({
      organisation_group_type_id: memberGroup.organisation_group.organisation_group_type_id,
      organisation_group_id: memberGroup.organisation_group_id,
      organisation_member_id: memberGroup.organisation_member_id,
      id: memberGroup.id
    });
    this.setSelectedGroupType(memberGroup.organisation_group.organisation_group_type_id);
    this.showEditor({ reset: false });
  }

  deleteAssignment(memberGroup: OrganisationMemberGroup) {
    Swal.fire({
      title: this.translate.instant('Confirm Deletion'),
      text: this.translate.instant(`This action will delete this selected group assignment`),
      icon: 'warning',
      showCancelButton: true,
    }).then((action) => {
      if (action.value) {
        Swal.fire(
          this.translate.instant('Deleting Assignment'),
          this.translate.instant('Please wait') + '...',
          'error'
        );
        Swal.showLoading();
        this.memberGroupService.remove(memberGroup);
      }
    });
  }

  setSelectedGroupType(groupTypeId: number) {
    this.selectedGroupType = this.orgGroupTypes.getItems().find(groupType => groupType.id === groupTypeId);
  }

  onSelectGroupType(event) {
    this.setSelectedGroupType( parseInt(event.target.value, 10) );
    console.log(this.assignmentForm.value);
  }

  onSubmit(event) {
    event.preventDefault();

    if ( !this.assignmentForm.valid ) {
      return;
    }

    const memberGroup = new OrganisationMemberGroup(this.assignmentForm.value);

    if ( memberGroup.id ) {
      return this.memberGroupService.update(memberGroup);
    }

    return this.memberGroupService.create(memberGroup);
  }
}

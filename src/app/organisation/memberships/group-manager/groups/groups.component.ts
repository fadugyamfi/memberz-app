import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { PageEvent } from '../../../../shared/components/pagination/pagination.component';
import { OrganisationGroup } from '../../../../shared/model/api/organisation-group';
import { OrganisationGroupType } from '../../../../shared/model/api/organisation-group-type';
import { CurrencyService } from '../../../../shared/services/api/currency.service';
import { OrganisationGroupTypeService } from '../../../../shared/services/api/organisation-group-type.service';
import { OrganisationGroupService } from '../../../../shared/services/api/organisation-group.service';
import { OrganisationService } from '../../../../shared/services/api/organisation.service';
import { EventsService } from '../../../../shared/services/events.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  private _groupType: OrganisationGroupType;
  public groups: OrganisationGroup[] = [];

  public editorForm: UntypedFormGroup;
  @ViewChild('editorModal', { static: true }) editorModal: any;
  @Output() viewGroupMembers = new EventEmitter();

  constructor(
    public groupService: OrganisationGroupService,
    public modalService: NgbModal,
    public currencyService: CurrencyService,
    public organisationService: OrganisationService,
    public groupTypeService: OrganisationGroupTypeService,
    public events: EventsService,
    public translate: TranslateService
  ) { }

  ngOnInit() {
    this.setupEvents();
  }

  ngOnDestroy(): void {
    this.removeEvents();
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadGroups(page = 1, limit = 10) {
    const sub = this.groupService.getAll({
      organisation_group_type_id: this.groupType?.id,
      count: ['organisationGroupMembers'].join(),
      // contain: ['organisationGroupLeaders'].join(),
      sort: 'name:asc',
      limit,
      page
    }).subscribe(groups => this.groups = groups);

    this.subscriptions.push(sub);
  }

  groupDataAvailable() {
    return !this.groupService.fetching && this.groups.length > 0;
  }

  noDataAvailable() {
    return !this.groupService.fetching && this.groups.length == 0;
  }

  @Input()
  set groupType(value: OrganisationGroupType) {
    this._groupType = value;

    if (value) {
      this.loadGroups();
    }
  }

  get groupType(): OrganisationGroupType {
    return this._groupType;
  }

  get leadersArray(): UntypedFormArray {
    return (this.editorForm.controls.organisation_group_leaders as UntypedFormArray);
  }

  onPaginate(event: PageEvent) {
    this.loadGroups(event.page, event.limit);
  }

  setupEditorForm() {
    this.editorForm = new UntypedFormGroup({
      id: new UntypedFormControl(),
      organisation_id: new UntypedFormControl(this.organisationService.getActiveOrganisation().id),
      organisation_group_type_id: new UntypedFormControl(this.groupType?.id, [Validators.required]),
      name: new UntypedFormControl('', Validators.required),
      organisation_group_leaders: new UntypedFormArray([this.createLeaderFormGroup()])
    });
  }

  createLeaderFormGroup() {
    return new UntypedFormGroup({
      id: new UntypedFormControl(''),
      organisation_id: new UntypedFormControl(this.organisationService.getActiveOrganisation().id),
      organisation_member_id: new UntypedFormControl(''),
      role: new UntypedFormControl('')
    });
  }

  addLeaderGroup() {
    this.leadersArray.push(this.createLeaderFormGroup());
  }

  removeLeaderGroup(index) {
    this.leadersArray.removeAt(index);

    if (this.leadersArray.length == 0) {
      this.addLeaderGroup();
    }
  }

  /**
   *
   */
  showEditorModal(group: OrganisationGroup = null) {
    this.setupEditorForm();

    if (group) {
      const groupData = Object.assign({}, group, {
        leaders: group.organisation_group_leaders
      });

      for(let i = 1; i < group.organisation_group_leaders.length; i++) {
        this.addLeaderGroup();
      }

      this.editorForm.patchValue(groupData);
    }

    this.modalService.open(this.editorModal, { size: 'lg' });
  }

  /**
   *
   */
  onSubmit(e: Event) {
    e.preventDefault();

    if (!this.editorForm.valid) {
      return;
    }

    const group = new OrganisationGroup(this.editorForm.value);

    if (group.id) {
      return this.groupService.update(group);
    }

    return this.groupService.create(group);
  }

  /**
   * Setup listeners for model changes
   */
  setupEvents() {
    this.events.on('OrganisationGroup:created', () => this.modalService.dismissAll());
    this.events.on('OrganisationGroup:updated', () => this.modalService.dismissAll());
    this.events.on('OrganisationGroup:deleted', () => Swal.close());
  }

  /**
   * Removes event listeners
   */
  removeEvents() {
    this.events.off('OrganisationGroup:created');
    this.events.off('OrganisationGroup:updated');
    this.events.off('OrganisationGroup:deleted');
  }

  /**
   * Delete group record
   */
  deleteGroup(group: OrganisationGroup) {
    Swal.fire({
      title: this.translate.instant('Confirm Deletion'),
      text: this.translate.instant(`This action will delete record from the database. This action currently cannot be reverted`, { name: group.name }),
      icon: 'warning',
      showCancelButton: true,
    }).then((action) => {
      if (action.value) {
        Swal.fire(
          this.translate.instant('Deleting Group'),
          this.translate.instant('Please wait') + ' ...',
          'error'
        );
        Swal.showLoading();
        this.groupService.remove(group);
      }
    });
  }

  viewMembers(group: OrganisationGroup) {
    this.viewGroupMembers.emit(group);
  }
}

import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { OrganisationGroupType } from '../../../../shared/model/api/orgainsation-group-type';
import { CurrencyService } from '../../../../shared/services/api/currency.service';
import { OrganisationGroupTypeService } from '../../../../shared/services/api/organisation-group-type.service';
import { OrganisationService } from '../../../../shared/services/api/organisation.service';
import { EventsService } from '../../../../shared/services/events.service';

@Component({
  selector: 'app-group-types',
  templateUrl: './group-types.component.html',
  styleUrls: ['./group-types.component.scss']
})
export class GroupTypesComponent implements OnInit, OnDestroy {

  @Output() selectGroupType = new EventEmitter();
  public editorForm: FormGroup;
  @ViewChild('editorModal', { static: true }) editorModal: any;

  public selectedGroupType: OrganisationGroupType;
  private subscriptions: Subscription[] = [];

  constructor(
    public groupTypeService: OrganisationGroupTypeService,
    public modalService: NgbModal,
    public currencyService: CurrencyService,
    public organisationService: OrganisationService,
    public events: EventsService,
    public translate: TranslateService
  ) { }

  ngOnInit() {
    this.loadGroupTypes();
    this.setupEvents();
  }

  ngOnDestroy(): void {
    this.removeEvents();
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadGroupTypes() {
    const sub = this.groupTypeService.getAll({ sort: 'name:asc' }).subscribe();
    this.subscriptions.push(sub);
  }

  setSelectedGroupType(groupType: OrganisationGroupType) {
    this.selectedGroupType = groupType;
    this.selectGroupType.emit(this.selectedGroupType);
  }

  setupEditorForm() {
    this.editorForm = new FormGroup({
      id: new FormControl(),
      organisation_id: new FormControl(this.organisationService.getActiveOrganisation().id),
      name: new FormControl('', Validators.required),
      description: new FormControl('')
    });
  }

  /**
   *
   */
  showEditorModal(groupType: OrganisationGroupType = null) {
    this.setupEditorForm();

    if (groupType) {
      this.editorForm.patchValue(groupType);
    }

    this.modalService.open(this.editorModal, {});
  }

  /**
 *
 */
  onSubmit(e: Event) {
    e.preventDefault();

    if (!this.editorForm.valid) {
      return;
    }

    const groupType = new OrganisationGroupType(this.editorForm.value);

    if (groupType.id) {
      return this.groupTypeService.update(groupType);
    }

    return this.groupTypeService.create(groupType);
  }

  /**
   * Setup listeners for model changes
   */
  setupEvents() {
    this.events.on('OrganisationGroupType:created', () => this.modalService.dismissAll());
    this.events.on('OrganisationGroupType:updated', () => this.modalService.dismissAll());
    this.events.on('OrganisationGroupType:deleted', () => Swal.close());
  }

  /**
   * Removes event listeners
   */
  removeEvents() {
    this.events.off('OrganisationGroupType:created');
    this.events.off('OrganisationGroupType:updated');
    this.events.off('OrganisationGroupType:deleted');
  }

  /**
   * Batch delete a select list of member records
   */
  deleteGroupType(groupType: OrganisationGroupType) {
    Swal.fire({
      title: this.translate.instant('Confirm Deletion'),
      text: this.translate.instant(`This action will delete record from the database. This action currently cannot be reverted`, { name: groupType.name }),
      icon: 'warning',
      showCancelButton: true,
    }).then((action) => {
      if (action.value) {
        Swal.fire(
          this.translate.instant('Deleting Group Type'),
          this.translate.instant('Please wait') + ' ...',
          'error'
        );
        Swal.showLoading();
        this.groupTypeService.remove(groupType);
      }
    });
  }
}

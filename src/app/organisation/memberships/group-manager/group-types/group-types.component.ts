import { Component, OnDestroy, OnInit, output, viewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { OrganisationGroupType } from '../../../../shared/model/api/organisation-group-type';
import { CurrencyService } from '../../../../shared/services/api/currency.service';
import { OrganisationGroupTypeService } from '../../../../shared/services/api/organisation-group-type.service';
import { OrganisationService } from '../../../../shared/services/api/organisation.service';
import { EventsService } from '../../../../shared/services/events.service';
import { NgClass } from '@angular/common';
import { LoadingRotateDashedComponent } from '../../../../shared/components/forms/loading-rotate-dashed/loading-rotate-dashed.component';
import { NoDataAvailableComponent } from '../../../../shared/components/forms/no-data-available/no-data-available.component';

@Component({
    selector: 'app-group-types',
    templateUrl: './group-types.component.html',
    styleUrls: ['./group-types.component.scss'],
    imports: [LoadingRotateDashedComponent, NoDataAvailableComponent, NgClass, FormsModule, ReactiveFormsModule, TranslateModule]
})
export class GroupTypesComponent implements OnInit, OnDestroy {

  readonly selectGroupType = output<OrganisationGroupType>();
  public editorForm: UntypedFormGroup;
  readonly editorModal = viewChild<any>('editorModal');

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
    this.editorForm = new UntypedFormGroup({
      id: new UntypedFormControl(),
      organisation_id: new UntypedFormControl(this.organisationService.getActiveOrganisation().id),
      name: new UntypedFormControl('', Validators.required),
      description: new UntypedFormControl('')
    });
  }

  /**
   *
   */
  showEditorModal(groupType: OrganisationGroupType | null = null) {
    this.setupEditorForm();

    if (groupType) {
      this.editorForm.patchValue(groupType);
    }

    this.modalService.open(this.editorModal(), {});
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

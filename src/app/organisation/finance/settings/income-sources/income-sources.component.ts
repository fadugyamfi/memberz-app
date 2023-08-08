import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { PageEvent } from '../../../../shared/components/pagination/pagination.component';
import { ContributionType } from '../../../../shared/model/api/contribution-type';
import { ContributionTypeService } from '../../../../shared/services/api/contribution-type.service';
import { CurrencyService } from '../../../../shared/services/api/currency.service';
import { OrganisationService } from '../../../../shared/services/api/organisation.service';
import { EventsService } from '../../../../shared/services/events.service';

@Component({
  selector: 'app-income-sources',
  templateUrl: './income-sources.component.html',
  styleUrls: ['./income-sources.component.scss']
})
export class IncomeSourcesComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  public editorForm: UntypedFormGroup;
  @ViewChild('editorModal', { static: true }) editorModal: any;

  public configuringFixedAmount = false;

  constructor(
    public contributionTypeService: ContributionTypeService,
    public events: EventsService,
    public modalService: NgbModal,
    public currencyService: CurrencyService,
    public organisationService: OrganisationService
  ) { }

  ngOnInit(): void {
    this.fetchCurrencies();
    this.fetchContributionTypes();
    this.setupEditorForm();
    this.setupEvents();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.removeEvents();
  }

  setupEvents() {
    this.events.on('ContributionType:created', () => this.modalService.dismissAll());
    this.events.on('ContributionType:updated', () => this.modalService.dismissAll());
    this.events.on('ContributionType:deleted', () => Swal.close());
  }

  removeEvents() {
    this.events.off('ContributionType:created');
    this.events.off('ContributionType:updated');
    this.events.off('ContributionType:deleted');
  }

  fetchCurrencies() {
    const sub = this.currencyService.getAll({ sort: 'currency_code:asc' }).subscribe();
    this.subscriptions.push(sub);
  }

  fetchContributionTypes(page = 1, limit = 30) {
    const sub = this.contributionTypeService.getAll({
      sort: 'name:asc',
      system_generated: false,
      contain: ['currency'].join(),
      page,
      limit,
      with_count: ['contribution'].join()
    }).subscribe();
    this.subscriptions.push(sub);
  }

  onPaginate(event: PageEvent) {
    this.fetchContributionTypes(event.page, event.limit);
  }

  setupEditorForm() {
    this.editorForm = new UntypedFormGroup({
      id: new UntypedFormControl(),
      organisation_id: new UntypedFormControl( this.organisationService.getActiveOrganisation().id ),
      name: new UntypedFormControl('', Validators.required),
      description: new UntypedFormControl(),
      member_required: new UntypedFormControl(),
      fix_amount_per_period: new UntypedFormControl(),
      fixed_amount: new UntypedFormControl(),
      currency_id: new UntypedFormControl('')
    });

    this.editorForm.valueChanges.subscribe(value => {
      this.configuringFixedAmount = value.fix_amount_per_period;
    });
  }

  /**
   *
   */
  showEditorModal(contributionType: ContributionType = null) {
    this.setupEditorForm();

    if (contributionType) {
      contributionType.member_required = contributionType.member_required == 'Required' ? 'true' : 'false';
      this.editorForm.patchValue(contributionType);
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

    const contributionType = new ContributionType(this.editorForm.value);
    contributionType.member_required = contributionType.member_required ? 'Required' : 'Not Required';

    const queryParams = {
      contain: ['currency'].join(),
      with_count: ['contribution'].join()
    };

    if (contributionType.id) {
      return this.contributionTypeService.update(contributionType, queryParams);
    }

    return this.contributionTypeService.create(contributionType, queryParams);
  }

  deleteType(contributionType: ContributionType) {
    Swal.fire({
      title: 'Confirm Deletion',
      text: `This action will delete "${contributionType.name}" from the database. This action currently cannot be reverted`,
      icon: 'warning',
      showCancelButton: true,
    }).then((action) => {
      if (action.value) {
        Swal.fire('Deleting Income Source', 'Please wait ...', 'error');
        Swal.showLoading();
        this.contributionTypeService.remove(contributionType);
      }
    });
  }
}

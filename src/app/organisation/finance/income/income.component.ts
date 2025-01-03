import { Component, OnDestroy, OnInit, viewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { PageEvent, PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { Contribution } from '../../../shared/model/api/contribution';
import { ContributionTypeService } from '../../../shared/services/api/contribution-type.service';
import { ContributionPaymentTypeService } from '../../../shared/services/api/contribution-payment-type.service';
import { ContributionService } from '../../../shared/services/api/contribution.service';
import { EventsService } from '../../../shared/services/events.service';
import { CurrencyService } from '../../../shared/services/api/currency.service';
import Swal from 'sweetalert2';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ViewProfileDirective } from '../../../shared/directives/view-profile.directive';
import { MemberControlComponent } from '../../../shared/components/forms/member-control/member-control.component';
import { SelectPaymentTypeControlComponent } from '../../../shared/components/forms/select-payment-type-control/select-payment-type-control.component';
import { SelectMonthControlComponent } from '../../../shared/components/forms/select-month-control/select-month-control.component';
import { SelectYearControlComponent } from '../../../shared/components/forms/select-year-control/select-year-control.component';
import { SelectCurrencyControlComponent } from '../../../shared/components/forms/select-currency-control/select-currency-control.component';
import { SelectBankControlComponent } from '../../../shared/components/forms/select-bank-control/select-bank-control.component';
import { IncomeEditorComponent } from './income-editor/income-editor.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-income',
    templateUrl: './income.component.html',
    styleUrls: ['./income.component.scss'],
    imports: [ViewProfileDirective, PaginationComponent, FormsModule, ReactiveFormsModule, MemberControlComponent, SelectPaymentTypeControlComponent, SelectMonthControlComponent, SelectYearControlComponent, SelectCurrencyControlComponent, SelectBankControlComponent, IncomeEditorComponent, CurrencyPipe, DatePipe, TranslateModule]
})
export class IncomeComponent implements OnInit, OnDestroy {

  readonly searchModal = viewChild<any>('searchModal');
  readonly editorModal = viewChild<any>('incomeEditorModal');

  private subscriptions: Subscription[] = [];
  public searchForm: UntypedFormGroup;
  public contributions: Contribution[] = [];

  public years = null;

  constructor(
    public contributionService: ContributionService,
    public contributionTypeService: ContributionTypeService,
    public paymentTypeService: ContributionPaymentTypeService,
    public currencyService: CurrencyService,
    public events: EventsService,
    public modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.fetchContributions();
    this.setupSearchForm();
    this.fetchContributionTypes();
    this.setupEvents();
  }

  ngOnDestroy() {
    this.removeEvents();
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.events.trigger("close:membership:flyout");
  }

  fetchContributions(options = {}, page = 1, limit = 50) {
    const sub = this.contributionService.getAll({
      ...options,
      page,
      limit,
      sort: 'latest',
      contain: ['organisation_member.member'].join()
    }).subscribe(contributions => this.contributions = contributions);

    this.subscriptions.push(sub);
  }

  fetchContributionTypes() {
    const sub = this.contributionTypeService.getAll({ sort: 'name:asc' }).subscribe();
    this.subscriptions.push(sub);
  }

  /**
   * Sets up the search form group and validations
   */
  setupSearchForm() {
    this.searchForm = new UntypedFormGroup({
      receipt_dt: new UntypedFormControl(''),
      receipt_no: new UntypedFormControl(''),
      description_like: new UntypedFormControl(''),
      organisation_member_id: new UntypedFormControl(''),
      module_contribution_type_id: new UntypedFormControl(''),
      module_contribution_payment_type_id: new UntypedFormControl(''),
      week: new UntypedFormControl(''),
      month: new UntypedFormControl(''),
      year: new UntypedFormControl(''),
      currency_id: new UntypedFormControl(''),
      bank_id: new UntypedFormControl(''),
      cheque_number_like: new UntypedFormControl(),
      cheque_status: new UntypedFormControl(''),
      amount: new UntypedFormControl(),
      created_gte: new UntypedFormControl(),
      created_lte: new UntypedFormControl()
    });
  }

  /**
   * Shows the search modal
   */
  showSearchModal() {
    this.modalService.open(this.searchModal(), { size: 'lg' });
  }

  /**
   * Handles the searching functionality
   *
   * @param e Event
   */
  onSearch(e: Event) {
    e.preventDefault();
    this.fetchContributions(this.searchForm.value);
    this.modalService.dismissAll();
  }

  /**
   * Handles the pagination events
   *
   * @param event PageEvent
   */
  onPaginate(event: PageEvent): void {
    this.fetchContributions(this.searchForm.value, event.page, event.limit);
  }

  setupEvents() {
    this.events.on('Contribution:created', (contribution) => this.contributions.unshift(contribution));

    this.events.on('Contribution:updated', (contribution) => {
      const index = this.contributions.findIndex(c => c.id == contribution.id);
      this.contributions[index] = contribution;
    });

    this.events.on('Contribution:deleted', () => Swal.close());
  }

  removeEvents() {
    this.events.off(['Contribution:created', 'Contribution:updated', 'Contribution:deleted']);
  }

  deleteIncome(contribution: Contribution) {
    Swal.fire({
      title: 'Confirm Deletion',
      text: `This action will delete this ${contribution.currency_code} ${contribution.amount} record from the database. This action currently cannot be reverted`,
      icon: 'warning',
      showCancelButton: true,
    }).then((action) => {
      if (action.value) {
        Swal.fire('Deleting Income Record', 'Please wait ...', 'error');
        Swal.showLoading();
        this.contributionService.remove(contribution);
      }
    });
  }
}

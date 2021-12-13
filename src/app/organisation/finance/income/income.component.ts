import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { PageEvent } from '../../../shared/components/pagination/pagination.component';
import { Contribution } from '../../../shared/model/api/contribution';
import { ContributionTypeService } from '../../../shared/services/api/contribution-type.service';
import { ContributionPaymentTypeService } from '../../../shared/services/api/contribution-payment-type.service';
import { ContributionService } from '../../../shared/services/api/contribution.service';
import { EventsService } from '../../../shared/services/events.service';
import { CurrencyService } from '../../../shared/services/api/currency.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss']
})
export class IncomeComponent implements OnInit, OnDestroy {

  @ViewChild('searchModal', { static: true }) searchModal: any;
  @ViewChild('incomeEditorModal', { static: true }) editorModal: any;

  private subscriptions: Subscription[] = [];
  public searchForm: FormGroup;

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
  }

  fetchContributions(options = {}, page = 1, limit = 50) {
    const sub = this.contributionService.getAll({
      ...options,
      page,
      limit,
      sort: 'latest',
      contain: ['organisation_member.member'].join()
    }).subscribe();

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
    this.searchForm = new FormGroup({
      receipt_dt: new FormControl(''),
      receipt_no: new FormControl(''),
      description_like: new FormControl(''),
      organisation_member_id: new FormControl(''),
      module_contribution_type_id: new FormControl(''),
      module_contribution_payment_type_id: new FormControl(''),
      week: new FormControl(''),
      month: new FormControl(''),
      year: new FormControl(''),
      currency_id: new FormControl(''),
      bank_id: new FormControl(''),
      cheque_number_like: new FormControl(),
      cheque_status: new FormControl(''),
      amount: new FormControl(),
      created_gte: new FormControl(),
      created_lte: new FormControl()
    });
  }

  /**
   * Shows the search modal
   */
  showSearchModal() {
    this.modalService.open(this.searchModal, { size: 'lg' });
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
    this.events.on('Contribution:deleted', () => Swal.close());
  }

  removeEvents() {
    this.events.off('Contribution:deleted');
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

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Contribution } from '../../../../shared/model/api/contribution';
import { ContributionPaymentTypeService } from '../../../../shared/services/api/contribution-payment-type.service';
import { ContributionTypeService } from '../../../../shared/services/api/contribution-type.service';
import { ContributionService } from '../../../../shared/services/api/contribution.service';
import { CurrencyService } from '../../../../shared/services/api/currency.service';
import * as moment from 'moment';
import { ContributionType } from '../../../../shared/model/api/contribution-type';
import { ContributionReceiptSetting } from '../../../../shared/model/api/contribution-receipt-setting';
import { ContributionReceiptSettingService} from '../../../../shared/services/api/contribution-receipt-setting.service';
import { OrganisationService } from '../../../../shared/services/api/organisation.service';
import { EventsService } from '../../../../shared/services/events.service';
import { ContributionPaymentType } from '../../../../shared/model/api/contribution-payment-type';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-income-editor',
  templateUrl: './income-editor.component.html',
  styleUrls: ['./income-editor.component.scss']
})
export class IncomeEditorComponent implements OnInit, OnDestroy {

  @ViewChild('editorModal', { static: true }) editorModal: any;

  public editorForm: FormGroup;
  public periods: FormArray;
  private subscriptions: Subscription[] = [];
  public selectedContributionType: ContributionType;
  public selectedContribution: Contribution;
  public selectedPaymentType: ContributionPaymentType;
  public years;
  public receiptSettings: ContributionReceiptSetting;
  private modal: NgbModalRef;

  constructor(
    public contributionService: ContributionService,
    public contributionTypeService: ContributionTypeService,
    public paymentTypeService: ContributionPaymentTypeService,
    public currencyService: CurrencyService,
    public modalService: NgbModal,
    public receiptSettingService: ContributionReceiptSettingService,
    public orgService: OrganisationService,
    public events: EventsService,
    public translate: TranslateService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.fetchContributionTypes();
    this.fetchReceiptSettings();
    this.setupEvents();
  }

  ngOnDestroy() {
    this.removeEvents();
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   *
   */
  setupEditorForm(contribution: Contribution = null) {
    this.editorForm = new FormGroup({
      id: new FormControl(),
      receipt_dt: new FormControl(moment().format('YYYY-MM-DD'), [Validators.required]),
      receipt_no: new FormControl(''),
      description: new FormControl(''),
      organisation_member_id: new FormControl(''),
      module_contribution_type_id: new FormControl('', [Validators.required]),
      module_contribution_payment_type_id: new FormControl('', [Validators.required]),
      bank_id: new FormControl(''),
      cheque_number: new FormControl(''),
      cheque_status: new FormControl('Not Cleared'),
      periods: new FormArray([ this.createPeriodItem(contribution) ])
    });

    this.editorForm.valueChanges.subscribe(value => {
      if ( value.module_contribution_type_id ) {
        this.selectedContributionType = this.contributionTypeService.getItems().find(type => {
          // tslint:disable-next-line: triple-equals
          return type.id == value.module_contribution_type_id;
        });

        if ( this.selectedContributionType.isMemberSpecific() ) {
          this.editorForm.controls.organisation_member_id.addValidators(Validators.required);
        } else {
          this.editorForm.controls.organisation_member_id.removeValidators(Validators.required);
        }
      }

      if ( value.module_contribution_payment_type_id ) {
        this.selectedPaymentType = this.paymentTypeService.getItems().find(type => {
          // tslint:disable-next-line: triple-equals
          return type.id == value.module_contribution_payment_type_id;
        });
      }
    });

    this.periods = this.editorForm.get('periods') as FormArray;

    if ( !this.receiptSettings.isReceiptModeAuto() ) {
      this.editorForm.controls.receipt_no.addValidators(Validators.required);
    }
  }

  createPeriodItem(contribution: Contribution = null): FormGroup {
    const weekOfMonth = (input = moment()) => {
      const firstDayOfMonth = input.clone().startOf('month');
      const firstDayOfWeek = firstDayOfMonth.clone().startOf('week');

      const offset = firstDayOfMonth.diff(firstDayOfWeek, 'days');

      return Math.ceil((input.date() + offset) / 7);
    };

    const currentDate = moment();

    return new FormGroup({
      week: new FormControl( contribution?.week || weekOfMonth(currentDate) ),
      month: new FormControl( contribution?.month || currentDate.month() + 1, [Validators.required]),
      year: new FormControl( contribution?.year || currentDate.year(), [Validators.required]),
      currency_id: new FormControl( contribution ? contribution.currency_id : this.receiptSettings.default_currency, [Validators.required]),
      amount: new FormControl( contribution?.amount || '', [Validators.required]),
    });
  }

  addPeriod(): void {
    this.periods.push(this.createPeriodItem());
  }

  removePeriodAt(index: number) {
    this.periods.removeAt(index);
  }

  /**
   *
   */
  show(contribution: Contribution = null) {
    this.setupEditorForm(contribution);

    if (contribution) {
      this.editorForm.patchValue(contribution);
    }

    this.selectedContribution = contribution;

    this.modal = this.modalService.open(this.editorModal, { size: 'xl' });
  }

  hide() {
    this.modal.close();
  }

  fetchReceiptSettings() {
    const sub = this.receiptSettingService.fetchSettings().subscribe({
      next: settings => {
        this.receiptSettings = settings;
        this.setupEditorForm();
      },
      error: (err) => {
        Swal.fire({
          title: this.translate.instant('Receipts Not Configured'),
          text: this.translate.instant('Configure your receipt settings in order to add transactions'),
          icon: 'error',
          showCancelButton: true,
          confirmButtonText: this.translate.instant('Configure Now')
        }).then(action => {
          if( action.isConfirmed ) {
            this.router.navigate(['/organisation/finance/settings/receipts']);
          }
        });
      }
    });

    this.subscriptions.push(sub);
  }

  fetchContributionTypes() {
    const sub = this.contributionTypeService.getAll({ sort: 'name:asc' }).subscribe({
      next: (sources) => {
        if( !sources || sources.length == 0 ) {
          Swal.fire({
            title: this.translate.instant('Income Sources Not Configured'),
            text: this.translate.instant('Configure your income sources in order to add transactions'),
            icon: 'error',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('Configure Now')
          }).then(action => {
            if( action.isConfirmed ) {
              this.router.navigate(['/organisation/finance/settings/income-sources']);
            }
          });
        }
      },
      error: (err) => {

      }
    });
    this.subscriptions.push(sub);
  }

  selectedContributionTypeIsMemberSpecific() {
    return this.selectedContributionType?.isMemberSpecific();
  }

  paymentMethodIsCheque() {
    return this.selectedPaymentType?.name === 'Cheque';
  }

  setupEvents() {
    this.events.on('Contribution:created', () => this.hide());
    this.events.on('Contribution:updated', () => this.hide());
  }

  removeEvents() {
    this.events.off('Contribution:created');
    this.events.off('Contribution:updated');
  }

  onSubmit(e: Event) {
    e.preventDefault();

    if ( !this.editorForm.valid ) {
      return;
    }

    const formValues = this.editorForm.value;
    const contributions: Contribution[] = formValues.periods.map(period => {
      return new Contribution({
        id: formValues.id,
        organisation_id: this.orgService.getActiveOrganisation().id,
        receipt_dt: formValues.receipt_dt,
        receipt_no: formValues.receipt_no,
        description: formValues.description,
        organisation_member_id: formValues.organisation_member_id,
        module_contribution_type_id: formValues.module_contribution_type_id,
        module_contribution_payment_type_id: formValues.module_contribution_payment_type_id,
        amount: period.amount,
        currency_id: period.currency_id,
        week: period.week,
        year: period.year,
        month: period.month
      });
    });

    this.contributionService.setPrepredItems(true);

    contributions.forEach(contribution => {
      if ( contribution.id ) {
        this.contributionService.update(contribution);
      } else {
        this.contributionService.create(contribution);
      }
    });
  }
}

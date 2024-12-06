import { Component, OnDestroy, OnInit, viewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { OrganisationPaymentPlatform } from '../../../shared/model/api/organisation-payment-platform';
import { OrganisationPaymentPlatformService } from '../../../shared/services/api/organisation-payment-platform.service';
import { PaymentPlatformService } from '../../../shared/services/api/payment-platform.service';
import { OrganisationService } from '../../../shared/services/api/organisation.service';
import { EventsService } from '../../../shared/services/events.service';
import { PaymentPlatform } from '../../../shared/model/api/payment-platform';
import { times } from 'chartist';
import Swal from 'sweetalert2';
import { TitleCasePipe } from '@angular/common';
import { SelectCurrencyControlComponent } from '../../../shared/components/forms/select-currency-control/select-currency-control.component';
import { SelectCountryControlComponent } from '../../../shared/components/forms/select-country-control/select-country-control.component';

@Component({
    selector: 'app-payment-platforms',
    templateUrl: './payment-platforms.component.html',
    styleUrls: ['./payment-platforms.component.scss'],
    imports: [FormsModule, ReactiveFormsModule, SelectCurrencyControlComponent, SelectCountryControlComponent, TitleCasePipe, TranslateModule]
})
export class PaymentPlatformsComponent implements OnInit, OnDestroy {

  readonly editorModal = viewChild<any>('editorModal');
  public editorForm: UntypedFormGroup;
  public orgPaymentPlatforms: OrganisationPaymentPlatform[];
  public subscriptions: Subscription[] = [];
  public paymentPlatforms: PaymentPlatform[];
  public modal: NgbModalRef;

  constructor(
    public paymentPlatformService: PaymentPlatformService,
    public orgPlatformService: OrganisationPaymentPlatformService,
    public events: EventsService,
    public translate: TranslateService,
    public organisationService: OrganisationService,
    public modalService: NgbModal
  ) { }

  ngOnInit() {
    this.setupEditorForm();
    this.fetchPaymentPlatforms();
    this.fetchOrganisationPaymentPlatforms();
    this.setupEvents();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.removeEvents();
  }

  setupEvents() {
    this.events.on('OrganisationPaymentPlatform:created', () => this.modal.close());
    this.events.on('OrganisationPaymentPlatform:updated', () => this.modal.close());
    this.events.on('OrganisationPaymentPlatform:deleted', () => Swal.close());
  }

  removeEvents() {
    this.events.off([
      'OrganisationPaymentPlatform:created',
      'OrganisationPaymentPlatform:updated',
      'OrganisationPaymentPlatform:deleted'
    ]);
  }

  fetchOrganisationPaymentPlatforms(page = 1, limit = 9) {
    const params = {
      contain: ['payment-platform'].join(','),
      limit,
      page
    }
    const sub = this.orgPlatformService.getAll(params).subscribe();

    this.subscriptions.push(sub);
  }

  get configKeysGroup(): UntypedFormGroup {
    return this.editorForm?.controls.config as UntypedFormGroup;
  }

  get configKeyNames() {
    return Object.keys(this.configKeysGroup.controls);
  }

  fetchPaymentPlatforms() {
    const CASH_PLATFORM_ID = 3;

    const sub = this.paymentPlatformService.getAll({ limit: 100 }).subscribe(paymentPlatforms => {
      this.paymentPlatforms = paymentPlatforms.filter(p => p.id != CASH_PLATFORM_ID); // exclude cash
    });
    this.subscriptions.push(sub);
  }

  setupEditorForm() {
    const organisation = this.organisationService.getActiveOrganisation();

    this.editorForm = new UntypedFormGroup({
      id: new UntypedFormControl(),
      organisation_id: new UntypedFormControl(organisation.id),
      payment_platform_id: new UntypedFormControl('', [Validators.required]),
      config: new UntypedFormGroup({}, [Validators.required]),
      currency_id: new UntypedFormControl(organisation.currency_id, [Validators.required]),
      country_id: new UntypedFormControl(organisation.country_id, [Validators.required]),
      platform_mode: new UntypedFormControl('sandbox', [Validators.required]),
    });

    this.editorForm.controls.payment_platform_id.valueChanges.subscribe(value => {
      const configGroup = this.editorForm.controls.config as UntypedFormGroup;
      for (let name in configGroup.controls) {
        configGroup.removeControl(name);
      }

      const paymentPlatform = this.paymentPlatforms.find(platform => platform.id == value);
      paymentPlatform?.config_keys.forEach(key => {
        configGroup.addControl(key, new UntypedFormControl('', Validators.required));
      });
    });
  }

  /**
   *
   */
  showEditorModal(orgPaymentPlatform: OrganisationPaymentPlatform | null = null) {
    this.setupEditorForm();

    if (orgPaymentPlatform) {
      this.editorForm.patchValue(orgPaymentPlatform);
    }

    this.modal = this.modalService.open(this.editorModal(), { size: 'lg' });
  }

  onSubmit(event) {
    event.preventDefault();

    if (!this.editorForm.valid) {
      return;
    }

    const platform = new OrganisationPaymentPlatform(this.editorForm.value);

    if (platform.id) {
      return this.orgPlatformService.update(platform);
    }

    return this.orgPlatformService.create(platform);
  }

  /**
  * Batch delete a select list of member records
  */
  deletePlatform(platform: OrganisationPaymentPlatform) {
    Swal.fire({
      title: this.translate.instant('Confirm Deletion'),
      text: this.translate.instant(`This action will delete record from the database. This action currently cannot be reverted`),
      icon: 'warning',
      showCancelButton: true,
    }).then((action) => {
      if (action.value) {
        Swal.fire(
          this.translate.instant('Deleting Payment Platform'),
          this.translate.instant('Please wait') + ' ...',
          'error'
        );
        Swal.showLoading();
        this.orgPlatformService.remove(platform);
      }
    });
  }
}

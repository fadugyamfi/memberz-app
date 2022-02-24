import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { OrganisationPaymentPlatform } from '../../../shared/model/api/organisation-payment-platform';
import { OrganisationPaymentPlatformService } from '../../../shared/services/api/organisation-payment-platform.service';
import { PaymentPlatformService } from '../../../shared/services/api/payment-platform.service';
import { OrganisationService } from '../../../shared/services/api/organisation.service';
import { EventsService } from '../../../shared/services/events.service';
import { PaymentPlatform } from '../../../shared/model/api/payment-platform';
import { times } from 'chartist';

@Component({
  selector: 'app-payment-platforms',
  templateUrl: './payment-platforms.component.html',
  styleUrls: ['./payment-platforms.component.scss']
})
export class PaymentPlatformsComponent implements OnInit, OnDestroy {

  @ViewChild('editorModal', { static: true }) editorModal: any;
  public editorForm: FormGroup;
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
    this.events.on('OrganisationPaymentPlatform:created', (platform) => {
      this.modal.close();
    });

    this.events.on('OrganisationPaymentPlatform:updated', (platform) => {
      this.modal.close();
    });
  }

  removeEvents() {
    this.events.off(['OrganisationPaymentPlatform:created', 'OrganisationPaymentPlatform:updated']);
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

  get configKeysGroup(): FormGroup {
    return this.editorForm?.controls.config as FormGroup;
  }

  get configKeyNames() {
    return Object.keys(this.configKeysGroup.controls);
  }

  fetchPaymentPlatforms() {
    const sub = this.paymentPlatformService.getAll({ limit: 100 }).subscribe(paymentPlatforms => this.paymentPlatforms = paymentPlatforms);
    this.subscriptions.push(sub);
  }

  setupEditorForm() {
    const organisation = this.organisationService.getActiveOrganisation();

    this.editorForm = new FormGroup({
      id: new FormControl(),
      organisation_id: new FormControl(organisation.id),
      payment_platform_id: new FormControl('', [Validators.required]),
      config: new FormGroup({}, [Validators.required]),
      currency_id: new FormControl(organisation.currency_id, [Validators.required]),
      country_id: new FormControl(organisation.country_id, [Validators.required]),
      platform_mode: new FormControl('sandbox', [Validators.required]),
    });

    this.editorForm.controls.payment_platform_id.valueChanges.subscribe(value => {
      const configGroup = this.editorForm.controls.config as FormGroup;
      for(let name in configGroup.controls) {
        configGroup.removeControl(name);
      }

      const paymentPlatform = this.paymentPlatforms.find(platform => platform.id == value);
      paymentPlatform.config_keys.forEach(key => {
        configGroup.addControl(key, new FormControl('', Validators.required));
      });
    });
  }

  /**
   *
   */
  showEditorModal(orgPaymentPlatform: OrganisationPaymentPlatform = null) {
    this.setupEditorForm();

    if (orgPaymentPlatform) {
      this.editorForm.patchValue(orgPaymentPlatform);
    }

    this.modal = this.modalService.open(this.editorModal, { size: 'lg' });
  }

  onSubmit(event) {
    event.preventDefault();

    if( !this.editorForm.valid ) {
      return;
    }

    const platform = new OrganisationPaymentPlatform(this.editorForm.value);

    if( platform.id ) {
      return this.orgPlatformService.update(platform);
    }

    return this.orgPlatformService.create(platform);
  }
}

import { Component, OnInit, AfterViewInit, Input, EventEmitter, Output } from '@angular/core';
import { EventsService } from '../../../../shared/services/events.service';
import { SubscriptionTypeService } from '../../../../shared/services/api/subscription-type.service';
import { SubscriptionType } from '../../../../shared/model/api/subscription-type';
import { UntypedFormGroup, UntypedFormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import moment from 'moment';
import { OrganisationService } from '../../../../shared/services/api/organisation.service';
import { Organisation } from '../../../../shared/model/api/organisation';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { NgIf, UpperCasePipe } from '@angular/common';

@Component({
    selector: 'app-payment-step',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.scss'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, NgxIntlTelInputModule, NgIf, UpperCasePipe]
})
export class PaymentComponent implements OnInit, AfterViewInit {

  public subscriptionType: SubscriptionType;
  public paymentForm: UntypedFormGroup;
  private _organisation: Organisation;

  @Output() savePayment = new EventEmitter();

  constructor(
    public events: EventsService,
    public subTypeService: SubscriptionTypeService,
    public orgService: OrganisationService
  ) { }

  ngOnInit() {
    this.setupPaymentForm();
  }

  ngAfterViewInit() {
    setTimeout(() => this.updatePlanCostAttributes(1), 1000);
  }

  @Input()
  set organisation(value: Organisation) {
    this._organisation = value;
  }

  get organisation(): Organisation {
    return this._organisation;
  }

  loadSubscriptionType() {
    this.subscriptionType = this.subTypeService.getSelectedModel();
  }

  setupPaymentForm() {
    this.paymentForm = new UntypedFormGroup({
      subscription_length: new UntypedFormControl('', [Validators.required]),
      plan_cost: new UntypedFormControl(0),
      plan_expiration: new UntypedFormControl('1970-01-01')
    });

    this.paymentForm.controls.subscription_length.valueChanges.subscribe(value => {
      this.updatePlanCostAttributes(value);
    });
  }

  isActive(length: number) {
    return { active: this.paymentForm.value['subscription_length'] == length };
  }

  updatePlanCostAttributes(subscription_length) {
    const subType = this.subTypeService.getSelectedModel();

    if( !subType ) return;

    const remainder = subscription_length / 6;
    const discountLength = remainder >= 1 ? subscription_length - remainder : subscription_length;
    const cost = parseFloat(subType.initial_price) * parseInt(discountLength);

    this.paymentForm.patchValue({
      plan_cost: cost.toFixed(2),
      plan_expiration: moment().add(subscription_length, 'months').format('DD MMM, YYYY')
    });
  }

  savePaymentInfo() {
    //this.organisation = Object.assign(this.organisation, this.paymentForm.value);
    this.savePayment.emit(this.paymentForm.value);
  }
}

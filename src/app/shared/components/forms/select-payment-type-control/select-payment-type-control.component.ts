import { Component, forwardRef, OnDestroy, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ContributionPaymentTypeService } from '../../../services/api/contribution-payment-type.service';
import { NgFor } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

export const PAYMENT_TYPE_CONTROL_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  useExisting: forwardRef(() => SelectPaymentTypeControlComponent),
  multi: true
};

@Component({
    selector: 'app-select-payment-type-control',
    templateUrl: './select-payment-type-control.component.html',
    styleUrls: ['./select-payment-type-control.component.scss'],
    providers: [PAYMENT_TYPE_CONTROL_ACCESSOR],
    standalone: true,
    imports: [FormsModule, NgFor, TranslateModule]
})
export class SelectPaymentTypeControlComponent implements OnInit, OnDestroy {

  private paymentSub: Subscription;

  private _value = '';
  public disabled = false;
  public onChange = (_: any) => { };
  public onTouched = () => { };

  constructor(
    public paymentTypeService: ContributionPaymentTypeService
  ) { }

  ngOnInit(): void {
    this.fetchPaymentTypes();
  }

  ngOnDestroy() {
    this.paymentSub.unsubscribe();
  }

  fetchPaymentTypes() {
    this.paymentSub = this.paymentTypeService.getAll({ cacheResults: true }).subscribe();
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
    this.onChange(this.value);
  }

  writeValue(obj: any): void {
    this.value = obj || '';
  }

  registerOnChange(fn: (_: any) => {}): void { this.onChange = fn; }
  registerOnTouched(fn: () => {}): void { this.onTouched = fn; }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  reset() {
    this.value = null;
  }
}

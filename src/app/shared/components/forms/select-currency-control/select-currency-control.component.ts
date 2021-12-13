import { Component, forwardRef, OnDestroy, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CurrencyService } from '../../../services/api/currency.service';

export const CURRENCY_CONTROL_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  useExisting: forwardRef(() => SelectCurrencyControlComponent),
  multi: true
};

@Component({
  selector: 'app-select-currency-control',
  templateUrl: './select-currency-control.component.html',
  styleUrls: ['./select-currency-control.component.scss'],
  providers: [CURRENCY_CONTROL_ACCESSOR]
})
export class SelectCurrencyControlComponent implements OnInit, OnDestroy {

  private currencySub: Subscription;

  private _value = '';
  public disabled = false;
  public onChange = (_: any) => { };
  public onTouched = () => { };

  constructor(
    public currencyService: CurrencyService
  ) { }

  ngOnInit(): void {
    this.fetchCurrencies();
  }

  ngOnDestroy() {
    this.currencySub.unsubscribe();
  }

  fetchCurrencies() {
    this.currencySub = this.currencyService.getAll({ cacheResults: true, limit: 100 }).subscribe();
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

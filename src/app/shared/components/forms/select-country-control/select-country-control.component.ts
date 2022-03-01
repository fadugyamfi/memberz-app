import { Component, forwardRef, OnDestroy, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CountryService } from '../../../services/api/country.service';

export const COUNTRY_CONTROL_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  useExisting: forwardRef(() => SelectCountryControlComponent),
  multi: true
};

@Component({
  selector: 'app-select-country-control',
  templateUrl: './select-country-control.component.html',
  styleUrls: ['./select-country-control.component.scss'],
  providers: [COUNTRY_CONTROL_ACCESSOR]
})
export class SelectCountryControlComponent implements OnInit, OnDestroy {

  private countrySub: Subscription;

  private _value = '';
  public disabled = false;
  public onChange = (_: any) => { };
  public onTouched = () => { };

  constructor(
    public countryService: CountryService
  ) { }

  ngOnInit(): void {
    this.fetchCurrencies();
  }

  ngOnDestroy() {
    this.countrySub.unsubscribe();
  }

  fetchCurrencies() {
    this.countrySub = this.countryService.getAll({ cacheResults: true, limit: 100 }).subscribe();
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
import { Component, OnInit, forwardRef, input, output } from '@angular/core';
import { NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { SlicePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

export const MONTH_CONTROL_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  useExisting: forwardRef(() => SelectMonthControlComponent),
  multi: true
};

@Component({
    selector: 'app-select-month-control',
    templateUrl: './select-month-control.component.html',
    styleUrls: ['./select-month-control.component.scss'],
    providers: [MONTH_CONTROL_ACCESSOR],
    imports: [FormsModule, SlicePipe, TranslateModule]
})
export class SelectMonthControlComponent implements OnInit {

  readonly selectedMonthEvent = output<any>();

  private _value: string | null = '';
  public disabled = false;
  public onChange = (_: any) => { };
  public onTouched = () => { };

  public months = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
  ];

  public readonly shortNames = input(false);

  constructor() { }

  ngOnInit(): void {
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
    this.onChange(this.value);
    this.selectedMonthEvent.emit(value);
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

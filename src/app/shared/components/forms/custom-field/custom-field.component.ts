
import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

export const CUSTOMFIELD_CONTROL_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  useExisting: forwardRef(() => CustomFieldComponent),
  multi: true
};

export interface CustomFieldOption {
  label: string;
  value: string;
}

export interface CustomFieldConfig {
  label: string;
  type: string;
  options: CustomFieldOption[];
  placeholder: string;
}

@Component({
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, TranslateModule],
  selector: 'app-custom-field',
  templateUrl: './custom-field.component.html',
  styleUrls: ['./custom-field.component.scss'],
  providers: [CUSTOMFIELD_CONTROL_ACCESSOR]
})
export class CustomFieldComponent implements OnInit {

  @Input() config: CustomFieldConfig;

  private _value = '';
  public disabled = false;
  public onChange = (_: any) => { };
  public onTouched = () => { };

  constructor() { }

  ngOnInit(): void {
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

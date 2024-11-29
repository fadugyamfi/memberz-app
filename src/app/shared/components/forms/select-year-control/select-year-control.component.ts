import { Component, OnInit, Output, EventEmitter, OnDestroy, forwardRef, Input } from '@angular/core';
import { ContributionService } from '../../../services/api/contribution.service';
import { Subscription } from 'rxjs';
import { NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

export const YEAR_CONTROL_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  useExisting: forwardRef(() => SelectYearControlComponent),
  multi: true
};
@Component({
    selector: 'app-select-year-control',
    templateUrl: './select-year-control.component.html',
    styleUrls: ['./select-year-control.component.scss'],
    providers: [YEAR_CONTROL_ACCESSOR],
    standalone: true,
    imports: [FormsModule, TranslateModule]
})
export class SelectYearControlComponent implements OnInit, OnDestroy {

  @Output() selectedYearEvent = new EventEmitter();
  @Input() classes: string = "";
  public years: any;
  public subscriptions: Subscription[] = [];

  private _value = '';
  public disabled = false;
  public onChange = (_: any) => { };
  public onTouched = () => { };

  constructor(public contributionService: ContributionService) { }

  ngOnInit() {
    this.findYears();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  findYears() {
    const sub = this.contributionService.getAvailableYears().subscribe(years => {
      this.years = years;
    });

    this.subscriptions.push(sub);
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
    this.onChange(this.value);
    this.selectedYearEvent.emit(value);
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

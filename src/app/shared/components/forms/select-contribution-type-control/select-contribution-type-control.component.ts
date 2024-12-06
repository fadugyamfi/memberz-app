import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ContributionTypeService } from '../../../services/api/contribution-type.service';

import { TranslateModule } from '@ngx-translate/core';

export const PAYMENT_TYPE_CONTROL_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  useExisting: forwardRef(() => SelectContributionTypeControlComponent),
  multi: true
};

@Component({
    selector: 'app-select-contribution-type-control',
    templateUrl: './select-contribution-type-control.component.html',
    styleUrls: ['./select-contribution-type-control.component.scss'],
    providers: [PAYMENT_TYPE_CONTROL_ACCESSOR],
    imports: [FormsModule, TranslateModule]
})
export class SelectContributionTypeControlComponent implements OnInit, OnDestroy {

  private contributionSub: Subscription;

  @Input() classes: string = "";
  @Input() memberSpecificOnly = false;

  private _value = '';
  public disabled = false;
  public onChange = (_: any) => { };
  public onTouched = () => { };

  constructor(
    public contributionTypeService: ContributionTypeService
  ) { }

  ngOnInit(): void {
    this.fetchContributionTypes();
  }

  ngOnDestroy() {
    this.contributionSub.unsubscribe();
  }

  fetchContributionTypes() {
    const params = { sort: 'name:asc' };

    if( this.memberSpecificOnly ) {
      params['member_required'] = 'Required';
    }

    this.contributionSub = this.contributionTypeService.getAll(params).subscribe();
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

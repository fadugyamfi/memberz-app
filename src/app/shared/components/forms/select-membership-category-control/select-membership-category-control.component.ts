import { Component, forwardRef, OnDestroy, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { OrganisationMemberCategoryService } from '../../../services/api/organisation-member-category.service';

import { TranslateModule } from '@ngx-translate/core';

export const PAYMENT_TYPE_CONTROL_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  useExisting: forwardRef(() => SelectMembershipCategoryControlComponent),
  multi: true
};

@Component({
    selector: 'app-select-membership-category-control',
    templateUrl: './select-membership-category-control.component.html',
    styleUrls: ['./select-membership-category-control.component.scss'],
    providers: [PAYMENT_TYPE_CONTROL_ACCESSOR],
    standalone: true,
    imports: [FormsModule, TranslateModule]
})
export class SelectMembershipCategoryControlComponent implements OnInit, OnDestroy {

  private contributionSub: Subscription;

  private _value: string|null = '';
  public disabled = false;
  public onChange = (_: any) => { };
  public onTouched = () => { };

  constructor(
    public categoryService: OrganisationMemberCategoryService
  ) { }

  ngOnInit(): void {
    this.fetchMembershipCategories();
  }

  ngOnDestroy() {
    this.contributionSub.unsubscribe();
  }

  fetchMembershipCategories() {
    this.contributionSub = this.categoryService.getAll({ sort: 'name:asc' }).subscribe();
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

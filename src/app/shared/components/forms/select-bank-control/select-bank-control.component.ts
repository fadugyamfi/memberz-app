import { Component, forwardRef, OnDestroy, OnInit, input } from '@angular/core';
import { Subscription } from 'rxjs';
import { BankService } from '../../../services/api/bank.service';
import { NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { OrganisationService } from '../../../services/api/organisation.service';

import { TranslateModule } from '@ngx-translate/core';

export const BANK_CONTROL_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  useExisting: forwardRef(() => SelectBankControlComponent),
  multi: true
};

@Component({
    selector: 'app-select-bank-control',
    templateUrl: './select-bank-control.component.html',
    styleUrls: ['./select-bank-control.component.scss'],
    providers: [BANK_CONTROL_ACCESSOR],
    imports: [FormsModule, TranslateModule]
})
export class SelectBankControlComponent implements OnInit, OnDestroy {

  public readonly controlClass = input<string>('');

  private bankSub: Subscription;

  private _value = '';
  public disabled = false;
  public onChange = (_: any) => { };
  public onTouched = () => { };

  constructor(
    public bankService: BankService,
    public orgService: OrganisationService
  ) { }

  ngOnInit(): void {
    this.fetchBanks();
  }

  ngOnDestroy() {
    this.bankSub.unsubscribe();
  }

  fetchBanks() {
    this.bankSub = this.bankService.getAll({
      cacheResults: true,
      country_id: this.orgService.getActiveOrganisation().country_id,
      limit: 100
    }).subscribe();
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

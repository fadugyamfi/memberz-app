import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SmsTemplateTagService } from '../../../services/utilities/sms-template-tag.service';


export const TEMPLATE_TAG_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  useExisting: forwardRef(() => SmsTemplateTagControlComponent),
  multi: true
};

@Component({
  selector: 'input-sms-template-tag-control',
  templateUrl: './sms-template-tag-control.component.html',
  styleUrls: ['./sms-template-tag-control.component.scss'],
  providers: [TEMPLATE_TAG_ACCESSOR]
})
export class SmsTemplateTagControlComponent implements OnInit {

  @Output() change = new EventEmitter();

  @Input() public textarea: HTMLInputElement;
  @Input() public disabled = false;

  private _value = '';
  public onChange = (_: any) => { };
  public onTouched = () => { };

  constructor(
    public smsTagService: SmsTemplateTagService,
  ) { }

  ngOnInit(): void {
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
    this.onChange(this.value);
    this.change.emit(this.value);
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

  insertInTextarea(newText: string, el: HTMLInputElement) {
    if( !el ) return;

    const [start, end] = [el.selectionStart, el.selectionEnd];
    el.setRangeText(newText, start, end, 'select');
    el.focus();
  }
}

import { Component, OnInit, Input, forwardRef, Output, EventEmitter } from '@angular/core';
import { Member } from '../../../model/api/member';
import { OrganisationMember } from '../../../model/api/organisation-member';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap, catchError } from 'rxjs/operators';
import { OrganisationMemberService } from '../../../services/api/organisation-member.service';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ImagePreloadDirective } from '../../../directives/image-preload.directive';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { NgIf } from '@angular/common';
import { AvatarModule } from 'ngx-avatars';

export const MEMBER_CONTROL_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  useExisting: forwardRef(() => MemberControlComponent),
  multi: true
};

@Component({
    selector: 'app-member-control',
    templateUrl: './member-control.component.html',
    styleUrls: ['./member-control.component.scss'],
    providers: [MEMBER_CONTROL_ACCESSOR],
    standalone: true,
    imports: [ImagePreloadDirective, NgbTypeaheadModule, NgIf, AvatarModule]
})
export class MemberControlComponent {

  @Input() member: Member;
  @Input() withMobileNumber = false;
  @Input() returnMembershipId = false;
  @Input() readonly = false;
  @Output() selected = new EventEmitter();

  private _membership?: OrganisationMember | null;
  public searching = false;
  public searchFailed = false;

  private value = '';
  private inputEl?: any = null;

  public model?: string | null;
  public disabled = false;
  public onChange = (_: any) => { };
  public onTouched = () => { };

  constructor(
    public orgMemberService: OrganisationMemberService
  ) { }

  @Input()
  set membership(value: OrganisationMember | null) {
    this._membership = value;

    if ( this.membership ) {
      this.model = this.membership.member?.firstThenLastName();
    }
  }

  get membership(): OrganisationMember | null | undefined {
    return this._membership;
  }

  setValue(value) {
    this.value = value;
    this.onChange(this.value);
  }

  writeValue(obj: any): void {
    this.value = obj || '';

    if (this.value) {
      this.orgMemberService.getById(this.value).subscribe(member => {
        this.membership = member;
      });
    }
  }

  registerOnChange(fn: (_: any) => {}): void { this.onChange = fn; }
  registerOnTouched(fn: () => {}): void { this.onTouched = fn; }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public formatter = (profile: OrganisationMember) => profile.member && profile.member.firstThenLastName();

  public searchMember = (text$: Observable<string>) =>
    text$.pipe(
      tap(() => this.searching = true),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(term => {
        const params = {
          term,
          sort: ['last_name:asc', 'first_name:asc'].join(','),
          limit: 50
        };

        if (this.withMobileNumber) {
          params['mobile_number_isNotNull'] = true;
        }

        return this.orgMemberService.search(params).pipe(
          tap(() => this.searchFailed = false),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          })
        );
      }),
      tap(() => this.searching = false)
    )

  setSelectedMember(data, input) {
    this.inputEl = input;
    this.membership = data.item;
    this.setValue( this.returnMembershipId ? this.membership?.id : this.membership?.member_id);
    this.selected.emit(this.membership);
  }

  reset() {
    if (this.inputEl) {
      setTimeout(() => this.inputEl.value = '', 100);
    }

    this.model = null;
    this.membership = null;
    this.setValue(null);
  }
}

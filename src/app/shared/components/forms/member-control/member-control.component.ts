import { Component, OnInit, Input, forwardRef, Output, EventEmitter } from '@angular/core';
import { Member } from '../../../model/cakeapi/member';
import { OrganisationMember } from '../../../model/cakeapi/organisation-member';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap, catchError } from 'rxjs/operators';
import { OrganisationMemberService } from '../../../services/cakeapi/organisation-member.service';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

export const MEMBER_CONTROL_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  // tslint:disable-next-line: no-use-before-declare
  useExisting: forwardRef(() => MemberControlComponent),
  multi: true
};

@Component({
  selector: 'app-member-control',
  templateUrl: './member-control.component.html',
  styleUrls: ['./member-control.component.scss'],
  providers: [MEMBER_CONTROL_ACCESSOR]
})
export class MemberControlComponent implements OnInit {

  @Input() member: Member;
  @Output() selected = new EventEmitter();

  public searching = false;
  public searchFailed = false;
  public selectedMember: OrganisationMember;

  public value = '';
  public disabled = false;
  public onChange = (_: any) => { };
  public onTouched = () => { };

  constructor(
    public orgMemberService: OrganisationMemberService
  ) { }

  ngOnInit() {
  }

  setValue(value) {
    this.value = value;
    this.onChange(this.value);
  }

  writeValue(obj: any): void {
    this.value = obj || '';

    if (this.value) {
      this.orgMemberService.getAll({ member_id: this.value, limit: 1 }).subscribe(members => {
        this.selectedMember = members[0];
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
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap(term => {
        const params = {
          first_name_like: term
        };
        return this.orgMemberService.search<OrganisationMember[]>(params).pipe(
          tap(() => this.searchFailed = false),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          })
        );
      }),
      tap(() => this.searching = false)
    )

  setSelectedMember(data) {
    this.selectedMember = data.item;
    this.setValue(this.selectedMember.member_id);
    this.selected.emit(this.selectedMember);
  }
}

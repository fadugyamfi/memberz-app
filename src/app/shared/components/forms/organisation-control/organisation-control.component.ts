import { Component, OnInit, Input, forwardRef, Output, EventEmitter } from '@angular/core';
import { Organisation } from '../../../model/api/organisation';
import { OrganisationMember } from '../../../model/api/organisation-member';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap, catchError, map } from 'rxjs/operators';
import { OrganisationService } from '../../../services/api/organisation.service';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ImagePreloadDirective } from '../../../directives/image-preload.directive';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

import { AvatarModule } from 'ngx-avatars';

export const ORGANISATION_CONTROL_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  useExisting: forwardRef(() => OrganisationControlComponent),
  multi: true
};

@Component({
    selector: 'app-organisation-control',
    templateUrl: './organisation-control.component.html',
    styleUrls: ['./organisation-control.component.scss'],
    providers: [ORGANISATION_CONTROL_ACCESSOR],
    imports: [ImagePreloadDirective, NgbTypeaheadModule, AvatarModule]
})
export class OrganisationControlComponent {

  @Input() organisation: Organisation | null;
  @Input() readonly = false;
  @Output() selected = new EventEmitter();

  public searching = false;
  public searchFailed = false;

  private value = '';
  private inputEl: any;

  public model = null;
  public disabled = false;
  public onChange = (_: any) => { };
  public onTouched = () => { };

  constructor(
    public organisationService: OrganisationService
  ) { }


  setValue(value) {
    this.value = value;
    this.onChange(this.value);
  }

  writeValue(obj: any): void {
    this.value = obj || '';

    if (this.value) {
      this.organisationService.getById(this.value).subscribe(organisation => {
        this.organisation = organisation;
      });
    }
  }

  registerOnChange(fn: (_: any) => {}): void { this.onChange = fn; }
  registerOnTouched(fn: () => {}): void { this.onTouched = fn; }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public formatter = (organisation: Organisation) => organisation.name;

  public searchOrganisation = (text$: Observable<string>) =>
    text$.pipe(
      tap(() => this.searching = true),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(term => {
        const params = {
          term: term,
          limit: 10
        };

        return this.organisationService.get(`${this.organisationService.url}/list`, params).pipe(
          map((res) => {
            return res['data'].map((data: object) => new Organisation(data))
          }),
          tap(() => this.searchFailed = false),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          })
        );
      }),
      tap(() => this.searching = false)
    )

  setSelectedOrganisation(data, input) {
    this.inputEl = input;
    this.organisation = data.item;
    this.setValue( this.organisation?.id );
    this.selected.emit(this.organisation);
  }

  reset() {
    if (this.inputEl) {
      setTimeout(() => this.inputEl.value = '', 100);
    }

    this.model = null;
    this.organisation = null;
    this.setValue(null);
  }
}

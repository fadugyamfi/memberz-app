import * as moment from 'moment';
import { Component, OnInit } from '@angular/core';
import { Observable, Subscription, tap } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { EventsService } from '../../../../shared/services/events.service';
import { PageEvent } from '../../../../shared/components/pagination/pagination.component';
import { OrganisationMemberService } from 'src/app/shared/services/api/organisation-member.service';
import { UntypedFormGroup, UntypedFormControl, Validators, UntypedFormArray } from '@angular/forms';

@Component({
  selector: 'app-view-birthdays',
  templateUrl: './view-birthdays.component.html',
  styleUrls: ['./view-birthdays.component.scss']
})
export class ViewBirthdaysComponent implements OnInit {

  public subscriptions: Subscription[] = [];
  public selectForm: UntypedFormGroup;
  public birthdays: any[] = [];

  private searchParam = {
    day: null,
    week: null,
    month: null,
    page: null,
    limit: null
  };

  public fetching = false;

  constructor(
    public organisationMemberService: OrganisationMemberService,
    public events: EventsService,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.setupSelectForm();
    this.fetchBirthdays();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  fetchBirthdays(birthdayFor = 'today', page = 1, limit = 30) {
    this.fetching = true;
    this.birthdays = null;
    this.getBirthDayParam(birthdayFor);
    this.searchParam.page = page;
    this.searchParam.limit = limit;


    let sub = this.organisationMemberService.birthdays(this.searchParam).subscribe((data: any[]) => {
      this.fetching = false;

      if (data.length == 0) { return }
      this.birthdays = data;
    });

    this.subscriptions.push(sub);

  }

  getBirthDayParam(value: string){
    switch(value){
      case 'today':
        this.searchParam.day = moment().day();
        break;
      case 'tomorrow':
        this.searchParam.day = moment().day() + 1;
        break;
      case 'thisWeek':
        this.searchParam.week = moment().week();
        break;
      case 'nextWeek':
        this.searchParam.week = moment().week() + 1;
        break;
      case 'thisMonth':
        this.searchParam.month = moment().month();
        break;
    }
  }

  hasDataAvailable() {
    return this.birthdays && this.birthdays.length > 0;
  }

  /**
   * Sets up the select form
   */
  setupSelectForm() {
    this.selectForm = new UntypedFormGroup({
      birthday_for: new UntypedFormControl('today')
    });
  }

  /**
   * Handles the pagination events
   *
   * @param event PageEvent
   */
  onPaginate(event: PageEvent) {
    this.fetchBirthdays(this.selectForm.value, event.page, event.limit);
  }
}

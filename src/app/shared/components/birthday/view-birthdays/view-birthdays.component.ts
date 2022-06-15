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

  fetchBirthdays(birthday_for = 'today', page = 1, limit = 30){
    console.log(birthday_for)
    return [];
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

import { Component, OnInit, viewChild } from '@angular/core';
import { catchError, map, Observable, Subscription, tap } from 'rxjs';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { EventsService } from '../../../../shared/services/events.service';
import { PageEvent } from '../../../../shared/components/pagination/pagination.component';
import { OrganisationMemberService } from '../../../services/api/organisation-member.service';
import { UntypedFormGroup, UntypedFormControl, Validators, UntypedFormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import dayjs from 'dayjs';
import { DaterangepickerDirective } from 'ngx-daterangepicker-material';
import { OrganisationMember } from '../../../model/api/organisation-member';
import Swal from 'sweetalert2';
import { ExcelService } from '../../../services/excel.service';
import { PrintService } from '../../../services/print.service';
import { SelectMonthControlComponent } from '../../forms/select-month-control/select-month-control.component';
import { SelectMembershipCategoryControlComponent } from '../../forms/select-membership-category-control/select-membership-category-control.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPrintDirective } from 'ngx-print';
import { AsyncPipe, DatePipe } from '@angular/common';
import { NoDataAvailableComponent } from '../../forms/no-data-available/no-data-available.component';
import { ViewProfileDirective } from '../../../directives/view-profile.directive';
import { ProfileImageComponent } from '../../profile-view/profile-image/profile-image.component';
import { PaginationComponent } from '../../pagination/pagination.component';
import { LoadingRotateDashedComponent } from '../../forms/loading-rotate-dashed/loading-rotate-dashed.component';

@Component({
    selector: 'app-view-birthdays',
    templateUrl: './view-birthdays.component.html',
    styleUrls: ['./view-birthdays.component.scss'],
    imports: [FormsModule, ReactiveFormsModule, SelectMonthControlComponent, SelectMembershipCategoryControlComponent, NgbDropdownModule, NgxPrintDirective, NoDataAvailableComponent, ViewProfileDirective, ProfileImageComponent, PaginationComponent, LoadingRotateDashedComponent, AsyncPipe, DatePipe, TranslateModule]
})
export class ViewBirthdaysComponent implements OnInit {

  readonly pickerDirective = viewChild(DaterangepickerDirective);

  public subscriptions: Subscription[] = [];
  public selectForm: UntypedFormGroup;
  public birthdays$;
  public memberships: OrganisationMember[];

  public ranges: any = {
    'Today': [dayjs(), dayjs()],
    'Yesterday': [dayjs().subtract(1, 'days'), dayjs().subtract(1, 'days')],
    'Last 7 Days': [dayjs().subtract(6, 'days'), dayjs()],
    'Last 30 Days': [dayjs().subtract(29, 'days'), dayjs()],
    'This Month': [dayjs().startOf('month'), dayjs().endOf('month')],
    'Last Month': [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')]
  }


  public fetching = false;

  constructor(
    public organisationMemberService: OrganisationMemberService,
    public events: EventsService,
    public translate: TranslateService,
    public excelService: ExcelService,
    public printService: PrintService,
  ) { }

  ngOnInit(): void {
    this.setupSelectForm();
    this.fetchBirthdays({ month: dayjs().month() + 1 });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  fetchBirthdays(options = {}, page = 1, limit = 50) {
    this.fetching = true;

    const searchParams = {
      ...options,
      page,
      limit
    };

    return this.birthdays$ = this.organisationMemberService.birthdays(searchParams)
      .pipe(
        map(response => {
          return response['data'].map(data => new OrganisationMember(data));
        }),
        tap((memberships) => {
          this.memberships = memberships;
        }),
        catchError((error) => {
          return error;
        })
      );
  }

  /**
   * Sets up the select form
   */
  setupSelectForm() {
    this.selectForm = new UntypedFormGroup({
      month: new UntypedFormControl(dayjs().month() + 1),
      organisation_member_category_id: new UntypedFormControl()
    });

    this.selectForm.valueChanges.subscribe({
      next: (values) => {
        this.fetchBirthdays(this.selectForm.value)
      }
    })
  }

  /**
   * Handles the pagination events
   *
   * @param event PageEvent
   */
  onPaginate(event: PageEvent) {
    this.fetchBirthdays(this.selectForm.value, event.page, event.limit);
  }

  datesUpdated(dates) {
    console.log(dates);
  }

  openDatepicker() {
    this.pickerDirective()?.open();
  }

  formatMembersDataForExport(members) {
    return members.map((m) => {
      return {
        membership_no: m.organisation_no,
        name: m.member.lastThenFirstName(),
        membership_category: m.organisation_member_category.name,
        phone_number: m.member.mobile_number,
        dob: m.member.dob,
        age: m.member.age
      }
    });
  }

  exportToExcel(type = "page"): void {

    if (type == 'page') {
      if (this.memberships.length == 0) {
        return;
      }

      return this.excelService.generateExcel(this.formatMembersDataForExport(this.memberships), 'birthdays');

    }//end if page


    Swal.fire(
      this.translate.instant('Fetching all data'),
      this.translate.instant('Please wait as organisation data is being fetched') + '...',
      'info'
    );
    Swal.showLoading();

    const sub = this.organisationMemberService.birthdays(this.selectForm.value).subscribe(
      (members) => {
        this.excelService.generateExcel(this.formatMembersDataForExport(members), 'birthdays');
      }
    );

    this.subscriptions.push(sub);

  }

}

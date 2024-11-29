import { Component, OnInit } from '@angular/core';
import { OrganisationEventService } from '../../../shared/services/api/organisation-event.service';
import { Observable, tap } from 'rxjs';
import { OrganisationEvent } from '../../../shared/model/api/organisation-event';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { NgIf, NgFor, AsyncPipe, DatePipe, KeyValuePipe } from '@angular/common';
import { LoadingRotateDashedComponent } from '../../../shared/components/forms/loading-rotate-dashed/loading-rotate-dashed.component';
import { NgxPrintDirective } from 'ngx-print';

@Component({
    selector: 'app-attendance-report',
    templateUrl: './attendance-report.component.html',
    styleUrls: ['./attendance-report.component.scss'],
    standalone: true,
    imports: [NgIf, LoadingRotateDashedComponent, RouterLink, NgxPrintDirective, NgFor, AsyncPipe, DatePipe, KeyValuePipe, TranslateModule]
})
export class AttendanceReportComponent implements OnInit {

  public event$: Observable<OrganisationEvent>;
  private event: OrganisationEvent;

  constructor(
    public eventService: OrganisationEventService,
    public route: ActivatedRoute,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.loadEvent();
  }

  loadEvent() {
    this.event$ = this.eventService.getById(this.route.snapshot.paramMap.get('event_id'))
      .pipe(
        tap(event => this.event = event)
      );
  }

  get printTitle() {
    return this.event?.event_name + ' - ' + this.translate.instant('Attendance Report');
  }
}

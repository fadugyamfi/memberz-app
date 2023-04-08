import { Component, OnInit } from '@angular/core';
import { OrganisationEventService } from '../../../shared/services/api/organisation-event.service';
import { Observable, tap } from 'rxjs';
import { OrganisationEvent } from '../../../shared/model/api/organisation-event';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-attendance-report',
  templateUrl: './attendance-report.component.html',
  styleUrls: ['./attendance-report.component.scss']
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

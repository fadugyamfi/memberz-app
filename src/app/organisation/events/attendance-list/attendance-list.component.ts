import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { PageEvent } from '../../../shared/components/pagination/pagination.component';
import { OrganisationEvent } from '../../../shared/model/api/organisation-event';
import { OrganisationEventAttendee } from '../../../shared/model/api/organisation-event-attendee';
import { OrganisationEventAttendeeService } from '../../../shared/services/api/organisation-event-attendee.service';
import { OrganisationEventService } from '../../../shared/services/api/organisation-event.service';
import { EventsService } from '../../../shared/services/events.service';
import { ExcelService } from '../../../shared/services/excel.service';

@Component({
  selector: 'app-attendance-list',
  templateUrl: './attendance-list.component.html',
  styleUrls: ['./attendance-list.component.scss']
})
export class AttendanceListComponent implements OnInit, OnDestroy {

  public _event: OrganisationEvent;
  public attendees: OrganisationEventAttendee[];
  public subscriptions: Subscription[] = [];

  constructor(
    public route: ActivatedRoute,
    public eventService: OrganisationEventService,
    public attendeeService: OrganisationEventAttendeeService,
    public translate: TranslateService,
    public events: EventsService,
    public excelService: ExcelService
  ) { }

  ngOnInit(): void {
    this.loadEvent();
    this.setupEvents();
  }

  ngOnDestroy(): void {
    this.removeEvents();
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadEvent() {
    this.event = this.eventService.getSelectedModel();

    if (!this.event) {
      const event_id = this.route.snapshot.paramMap.get('event_id');
      const sub = this.eventService.getById(event_id, { contain: 'sessions' }).subscribe(event => this.event = event);
      this.subscriptions.push(sub);
    }
  }

  fetchAttendees(page = 1, limit = 30) {
    const params = { page, limit };
    const sub = this.eventService.getAttendees(this.event, params).subscribe(attendees => this.attendees = attendees);
    this.subscriptions.push(sub);
  }

  set event(value) {
    this._event = value;

    if (this.event) {
      this.fetchAttendees();
    }
  }

  get event() {
    return this._event;
  }

  get printTitle() {
    return this.event?.event_name + ' - ' + this.translate.instant('Attendance List');
  }

  onPaginate(event: PageEvent) {
    this.fetchAttendees(event.page, event.limit);
  }

  /**
   * Setup listeners for model changes
   */
  setupEvents() {
    this.events.on('OrganisationEventAttendee:deleted', (attendee) => {
      const index = this.attendees.findIndex(el => el.id == attendee.id);
      this.attendees.splice(index, 1);
      Swal.close()
    });
  }

  /**
   * Removes event listeners
   */
  removeEvents() {
    this.events.off('OrganisationEventAttendee:deleted');
  }

  deleteAttendee(attendee: OrganisationEventAttendee) {
    Swal.fire({
      title: this.translate.instant('Confirm Deletion'),
      text: this.translate.instant(`This action will delete record from the database. This action currently cannot be reverted`),
      icon: 'warning',
      showCancelButton: true,
    }).then((action) => {
      if (action.value) {
        Swal.fire(
          this.translate.instant('Deleting Event Attendee'),
          this.translate.instant('Please wait') + ' ...',
          'error'
        );
        Swal.showLoading();
        this.attendeeService.remove(attendee);
      }
    });
  }

  exportToExcel() {
    this.excelService.generateExcel( this.formatForExport(), 'attendance-list' )
  }

  formatForExport() {
    return this.attendees.map(attendee => {
      return {
        Session: attendee.session?.session_name,
        Name: attendee.member?.lastThenFirstName(),
        Category: attendee.category?.name,
        'Mobile Number': attendee.member?.mobile_number || '',
        Email: attendee.member?.email || ''
      }
    })
  }
}

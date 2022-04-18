import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { OrganisationEvent } from '../../../shared/model/api/organisation-event';
import { OrganisationEventSession } from '../../../shared/model/api/organisation-event-session';
import { OrganisationCalendarService } from '../../../shared/services/api/organisation-calendar.service';
import { OrganisationEventSessionService } from '../../../shared/services/api/organisation-event-session.service';
import { OrganisationEventService } from '../../../shared/services/api/organisation-event.service';
import { EventsService } from '../../../shared/services/events.service';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss']
})
export class SessionsComponent implements OnInit, OnDestroy {

  @ViewChild('sessionsModal', { static: true }) editorModal: any;

  public modal: NgbModalRef;
  private subscriptions: Subscription[] = [];

  private _event: OrganisationEvent;
  public showEditor = false;
  public editorForm: FormGroup;

  constructor(
    public eventService: OrganisationEventService,
    public calendarService: OrganisationCalendarService,
    public sessionService: OrganisationEventSessionService,
    public events: EventsService,
    public modalService: NgbModal,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.setupEditorForm();
    this.setupEvents();
  }

  ngOnDestroy(): void {
    this.removeEvents();
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  @Input()
  set event(event: OrganisationEvent) {
    this._event = event;
  }

  get event() {
    return this._event;
  }

  setupEditorForm() {
    this.editorForm = new FormGroup({
      id: new FormControl(''),
      session_name: new FormControl('', Validators.required),
      session_dt_date: new FormControl('', Validators.required),
      session_dt_time: new FormControl('', Validators.required),
      registration_code: new FormControl(''),
    });
  }

  add() {
    this.setupEditorForm();
    this.showEditor = true;
  }

  edit(session: OrganisationEventSession) {
    this.setupEditorForm();

    const params = Object.assign({}, session, {
      session_dt_date: moment(session.session_dt).format('YYYY-MM-DD'),
      session_dt_time: moment(session.session_dt).format('HH:mm')
    });

    this.editorForm.patchValue(params);
    this.showEditor = true;
  }

  hideEditor() {
    this.showEditor = false;
  }

  delete(session: OrganisationEventSession) {
    Swal.fire({
      title: this.translate.instant('Confirm Deletion'),
      text: this.translate.instant(`This action will delete record from the database. This action currently cannot be reverted`, { name: session.name }),
      icon: 'warning',
      showCancelButton: true,
    }).then((action) => {
      if (action.value) {
        Swal.fire(
          this.translate.instant('Deleting Event'),
          this.translate.instant('Please wait') +  ' ...',
          'error'
        );
        Swal.showLoading();
        this.sessionService.remove(session);
      }
    });
  }

  show() {
    this.hideEditor();
    this.fetchSessions();
    this.modal = this.modalService.open(this.editorModal, { size: 'xl' });
  }

  hide() {
    this.modal?.close();
  }

  fetchSessions() {
    const params = {
      organisation_event_id: this.event?.id
    }

    const sub = this.sessionService.getAll(params).subscribe();
    this.subscriptions.push(sub);
  }

  onSubmit(e) {
    e.preventDefault();

    const sessionData = this.editorForm.value;
    sessionData.session_dt = `${sessionData.session_dt_date} ${sessionData.session_dt_time}`;

    const session = new OrganisationEventSession(sessionData);

    if( session.id ) {
      return this.sessionService.update(session);
    }

    return this.sessionService.create(session);
  }

  /**
   * Setup listeners for model changes
   */
   setupEvents() {
    this.events.on('OrganisationEventSession:created', () => this.hideEditor());
    this.events.on('OrganisationEventSession:updated', () => this.hideEditor());
    this.events.on('OrganisationEventSession:deleted', () => Swal.close());
  }

  /**
   * Removes event listeners
   */
  removeEvents() {
    this.events.off('OrganisationEventSession:created');
    this.events.off('OrganisationEventSession:updated');
    this.events.off('OrganisationEventSession:deleted');
  }
}

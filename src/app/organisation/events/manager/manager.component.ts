import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription, tap } from 'rxjs';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment';
import { PageEvent } from '../../../shared/components/pagination/pagination.component';
import { OrganisationEvent } from '../../../shared/model/api/organisation-event';
import { OrganisationEventService } from '../../../shared/services/api/organisation-event.service';
import { OrganisationCalendarService } from '../../../shared/services/api/organisation-calendar.service';
import { EventsService } from '../../../shared/services/events.service';
import { OrganisationCalendar } from '../../../shared/model/api/organisation-calendar';
import * as moment from 'moment';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss']
})
export class ManagerComponent implements OnInit {

  @ViewChild('searchModal', { static: true }) searchModal: any;
  @ViewChild('editorModal', { static: true }) editorModal: any;

  public _environment = environment;

  public orgEvents$: Observable<OrganisationEvent[]>;
  public calendars: OrganisationCalendar[];

  public subscriptions: Subscription[] = [];
  public searchForm: FormGroup;
  public editorForm: FormGroup;

  public defaultCalendar: OrganisationCalendar;

  constructor(
    public eventService: OrganisationEventService,
    public calendarService: OrganisationCalendarService,
    public events: EventsService,
    public modalService: NgbModal,
    public translate: TranslateService
  ) { }

  ngOnInit() {
    this.setupEditorForm();
    this.setupSearchForm();
    this.setupEvents();
    // this.showSearchModal();
    this.fetchEvents();
    this.fetchCalendars();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.removeEvents();
  }

  editorConfig() {
    return {
      height: 300,
      menubar: false,
      plugins: [
        'advlist autolink lists link image charmap print preview anchor',
        'searchreplace visualblocks code fullscreen',
        'insertdatetime media table paste code help wordcount'
      ],
      toolbar:
        'undo redo | formatselect | bold italic underline backcolor | \
        alignleft aligncenter alignright alignjustify | \
        bullist numlist outdent indent | removeformat | help'
    };
  }

  fetchEvents(options = {}, page = 1, limit = 15) {
    const params = Object.assign({}, options, { page, limit, sort: 'id:desc', contain: "sessions" });

    this.eventService.setPrepredItems(true);
    const sub = this.eventService.getAll(params).subscribe();

    this.subscriptions.push(sub);
  }

  fetchCalendars() {
    const sub = this.calendarService.getAll({
      page: 1,
      limit: 50,
      sort: 'name:asc'
    }).subscribe(calendars => {
      this.calendars = calendars;
      this.defaultCalendar = this.calendars.find(calendar => calendar.is_default);
    });

    this.subscriptions.push(sub);
  }

  /**
   * Sets up the search form group and validations
   */
  setupSearchForm() {
    this.searchForm = new FormGroup({
      name_like: new FormControl(''),
      start_dt: new FormControl(''),
      end_dt: new FormControl(''),
    });
  }

  /**
   * Shows the search modal
   */
  showSearchModal() {
    this.modalService.open(this.searchModal, {});
  }

  /**
   * Handles the searching functionality
   *
   * @param e Event
   */
  onSearch(e: Event) {
    e.preventDefault();

    const data = this.searchForm.value;

    this.fetchEvents(data);
    this.modalService.dismissAll();
  }

  /**
   * Handles the pagination events
   *
   * @param event PageEvent
   */
  onPaginate(event: PageEvent) {
    this.fetchEvents(this.searchForm.value, event.page, event.limit);
  }

  /**
   *
   */
  setupEditorForm() {
    this.editorForm = new FormGroup({
      id: new FormControl(),
      organisation_id: new FormControl(),
      organisation_calendar_id: new FormControl(this.defaultCalendar ? this.defaultCalendar.id : '', Validators.required),
      event_name: new FormControl('', [Validators.required]),
      short_description: new FormControl('', []),
      long_description: new FormControl('', []),
      start_dt: new FormControl('', [Validators.required]),
      end_dt: new FormControl('', [Validators.required]),
      venue: new FormControl(''),
      all_day: new FormControl(false),
      sessions: new FormArray([])
    });
  }

  /**
   *
   */
  showEditorModal(event: OrganisationEvent = null) {
    this.setupEditorForm();

    if (event) {
      const params = Object.assign({}, event, {
        start_dt: moment(event.start_dt).format('YYYY-MM-DDTHH:mm'),
        end_dt: moment(event.end_dt).format('YYYY-MM-DDTHH:mm')
      });

      this.editorForm.patchValue(params);
    }

    this.modalService.open(this.editorModal, { size: 'lg' });
  }

  /**
   *
   */
  onSubmit(e: Event) {
    e.preventDefault();

    if (!this.editorForm.valid) {
      return;
    }

    const event = new OrganisationEvent(this.editorForm.value);

    if (event.id) {
      return this.eventService.update(event);
    }

    return this.eventService.create(event);
  }


  /**
   * Setup listeners for model changes
   */
  setupEvents() {
    this.events.on('OrganisationEvent:created', () => this.modalService.dismissAll());
    this.events.on('OrganisationEvent:updated', () => this.modalService.dismissAll());
    this.events.on('OrganisationEvent:deleted', () => Swal.close());
  }

  /**
   * Removes event listeners
   */
  removeEvents() {
    this.events.off('OrganisationEvent:created');
    this.events.off('OrganisationEvent:updated');
    this.events.off('OrganisationEvent:deleted');
  }

  /**
   * Batch delete a select list of member records
   */
  deleteEvent(event: OrganisationEvent) {
    Swal.fire({
      title: this.translate.instant('Confirm Deletion'),
      text: this.translate.instant(`This action will delete record from the database. This action currently cannot be reverted`, { name: event.event_name }),
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
        this.eventService.remove(event);
      }
    });
  }

}

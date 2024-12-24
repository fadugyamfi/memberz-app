import { Component, Input, OnDestroy, OnInit, input } from '@angular/core';
import { map } from 'rxjs';
import { OrganisationEvent } from '../../../../shared/model/api/organisation-event';
import { OrganisationEventAttendee } from '../../../../shared/model/api/organisation-event-attendee';
import { OrganisationMember } from '../../../../shared/model/api/organisation-member';
import { OrganisationEventAttendeeService } from '../../../../shared/services/api/organisation-event-attendee.service';
import { EventsService } from '../../../../shared/services/events.service';


@Component({
    selector: 'app-attendance-mark',
    templateUrl: './mark.component.html',
    styleUrls: ['./mark.component.scss']
})
export class MarkComponent implements OnInit, OnDestroy {

  private _membership: OrganisationMember;
  public marking = false;
  public eventAttendee?: OrganisationEventAttendee | null;

  public readonly event = input<OrganisationEvent>();
  public readonly event_session_id = input<number>();

  constructor(
    public attendeeService: OrganisationEventAttendeeService,
    public events: EventsService
  ) { }

  ngOnInit(): void {
    this.setupEvents();
  }

  ngOnDestroy(): void {
      this.removeEvents();
  }

  @Input()
  public set membership(value: OrganisationMember) {
    this._membership = value;
    this.eventAttendee = this._membership.event_attendee;
  }

  public get membership(): OrganisationMember {
    return this._membership;
  }

  markPresent(membership: OrganisationMember) {
    this.marking = true;

    const attendee = new OrganisationEventAttendee({
      organisation_id: membership.organisation_id,
      organisation_event_id: this.event()?.id,
      organisation_event_session_id: this.event_session_id(),
      member_id: membership.member_id
    });

    this.attendeeService
      .post(this.attendeeService.url, attendee)
      .pipe(map((response) => new OrganisationEventAttendee(response['data'])))
      .subscribe({
        next: (model) => {
          this.eventAttendee = model;
          this.membership.event_attendee = attendee;
        },
        complete: () => {
          this.marking = false;
        }
      });
  }

  unmarkPresent(membership: OrganisationMember) {
    this.marking = true;
    this.attendeeService
      .delete(`${this.attendeeService.url}/${this.eventAttendee?.id}`)
      .subscribe({
        next: (data) => {
          this.membership.event_attendee = null;
          this.eventAttendee = null;
          this.marking = false;
        },
        error: (error) => {

        },
        complete: () => {
          this.marking = false;
        }
      });
  }

  setupEvents() {
    this.events.on('OrganisationEventAttendee:created', (attendee: OrganisationEventAttendee) => {
      this.membership.event_attendee = attendee;
      this.eventAttendee = attendee;
      this.marking = false;
    });

    this.events.on('OrganisationEventAttendee:deleted', (attendee: OrganisationEventAttendee) => {
      this.membership.event_attendee = null;
      this.eventAttendee = null;
      this.marking = false;
    });
  }

  removeEvents() {
    this.events.off('OrganisationEventAttendee:created');
    this.events.off('OrganisationEventAttendee:deleted');
  }
}

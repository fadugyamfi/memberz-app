
import { AppModel } from './app.model';
import { OrganisationEvent } from './organisation-event';
import { OrganisationEventSession } from './organisation-event-session';
import { Member } from './member';


export class OrganisationEventAttendee extends AppModel {

  public id: any;
  public _member: Member;
  public _organisation_event: OrganisationEvent;
  public _organisation_session: OrganisationEventSession;
  public member_id: number;
  public organisation_event_session_id: number;
  public interested: boolean;
  public attended: boolean;

  constructor(data) {
    super(data);
  }

  get organisation_event() {
    return this._organisation_event;
  }

  set organisation_event(value) {
    this._organisation_event = value ? new OrganisationEvent(value) : null;
  }

  get organisation_session() {
    return this._organisation_session;
  }

  set organisation_session(value) {
    this._organisation_session = value ? new OrganisationEventSession(value) : null;
  }

  set member(value) {
    this._member = value ? new Member(value) : null;
  }

  get member() {
    return this._member;
  }
}

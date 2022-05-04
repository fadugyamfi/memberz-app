import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrganisationEventService } from '../../../shared/services/api/organisation-event.service';
import { OrganisationEventAttendeeService } from '../../../shared/services/api/organisation-event-attendee.service';
import { OrganisationMemberService } from '../../../shared/services/api/organisation-member.service';
import { OrganisationService } from '../../../shared/services/api/organisation.service';
import { OrganisationEvent } from '../../../shared/model/api/organisation-event';
import { OrganisationMemberCategoryService } from '../../../shared/services/api/organisation-member-category.service';
import { OrganisationMemberCategory } from '../../../shared/model/api/organisation-member-category';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OrganisationMember } from '../../../shared/model/api/organisation-member';
import { OrganisationEventAttendee } from '../../../shared/model/api/organisation-event-attendee';
import { PageEvent } from '../../../shared/components/pagination/pagination.component';
import { OrganisationGroupTypeService } from '../../../shared/services/api/organisation-group-type.service';
import { OrganisationGroupType } from '../../../shared/model/api/organisation-group-type';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-record-attendance',
  templateUrl: './record-attendance.component.html',
  styleUrls: ['./record-attendance.component.scss']
})
export class RecordAttendanceComponent implements OnInit {

  public event: OrganisationEvent;
  public categories: OrganisationMemberCategory[];
  public groupTypes: OrganisationGroupType[];
  public memberships: OrganisationMember[] = [];

  public filterForm: FormGroup;
  public attendees: OrganisationEventAttendee[];
  public subscriptions: Subscription[] = [];

  constructor(
    public route: ActivatedRoute,
    public organisationService: OrganisationService,
    public eventService: OrganisationEventService,
    public attendeeService: OrganisationEventAttendeeService,
    public membershipService: OrganisationMemberService,
    public categoryService: OrganisationMemberCategoryService,
    public groupTypeService: OrganisationGroupTypeService
  ) { }

  ngOnInit(): void {
    this.loadEvent();
    this.loadCategories();
    this.loadGroupTypes();
    this.setupFilterForm();
  }

  loadEvent() {
    const event_id = this.route.snapshot.paramMap.get('event_id');
    this.event = this.eventService.getSelectedModel();

    if( !this.event ) {
      this.eventService.getById(event_id, {
        contain: 'sessions'
      }).subscribe(event => this.event = event);
    }
  }

  loadCategories() {
    const sub = this.categoryService.getAll({ limit: 200, sort: 'name:asc'}).subscribe(categories => this.categories = categories);

    this.subscriptions.push(sub);
  }

  loadGroupTypes() {
    const sub = this.groupTypeService.getAll({
      limit: 1000,
      sort: 'name:asc',
      contain: 'organisationGroups'
    }).subscribe(groupTypes => {
      this.groupTypes = groupTypes;
    });

    this.subscriptions.push(sub);
  }

  setupFilterForm() {
    const organisation = this.organisationService.getActiveOrganisation();

    this.filterForm = new FormGroup({
      organisation_id: new FormControl(organisation.id),
      organisation_member_category_id: new FormControl('', Validators.required),
      organisation_event_session_id: new FormControl('', Validators.required),
      organisation_group_id: new FormControl(''),
      last_name_like: new FormControl(''),
      first_name_like: new FormControl(''),
    });
  }

  onFilter(e) {
    e.preventDefault();

    const params = this.filterForm.value;

    this.fetchEventMemberships(params);
  }

  fetchEventMemberships(params, page = 1, limit = 30) {

    this.membershipService.findMembers(params, page, limit).subscribe(members => this.memberships = members);

    this.attendeeService.getAll({
      limit: 1000,
      organisation_event_session_id: params.organisation_event_session_id
    }).subscribe(attendees => {
      this.attendees = attendees;
    })
  }

  get attendingMemberships() {
    return this.memberships && this.memberships.map(membership => {
      const record = this.attendees.find(attendee => attendee.member_id == membership.member_id);
      membership.event_attendee = record;

      return membership;
    })
  }

  onPaginate(event: PageEvent) {
    const params = this.filterForm.value;

    this.fetchEventMemberships(params, event.page, event.limit);
  }

  markPresent(membership: OrganisationMember) {
    const attendee = new OrganisationEventAttendee({
      organisation_id: membership.organisation_id,
      organisation_event_id: this.event.id,
      organisation_event_session_id: this.filterForm.value.organisation_event_session_id,
      member_id: membership.member_id
    });

    this.attendees.push(attendee);

    this.attendeeService.create(attendee);
  }

  unmarkPresent(membership: OrganisationMember) {
    const index = this.attendees.findIndex(attendee => attendee.id == membership.event_attendee.id);
    this.attendees.splice(index, 1);

    this.attendeeService.remove(membership.event_attendee);
  }
}

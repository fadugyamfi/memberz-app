import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { OrganisationEvent } from '../../../shared/model/api/organisation-event';
import { OrganisationEventService } from '../../../shared/services/api/organisation-event.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public $upcomingEvents: Observable<OrganisationEvent[]>;

  constructor(
    public eventService: OrganisationEventService
  ) { }

  ngOnInit(): void {
    this.fetchUpcomingEvents();
  }

  fetchUpcomingEvents() {
    const params = { page: 1, limit: 5, sort: 'start_dt:asc', start_dt_gt: moment().format('YYYY-MM-DD HH:mm:ss') };

    this.$upcomingEvents = this.eventService.getAll(params);
  }
}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BirthdayComponent } from './birthday/birthday.component';
import { CalendarComponent } from './calendar/calendar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EventListComponent } from './event-list/event-list.component';
import { RecordAttendanceComponent } from './record-attendance/record-attendance.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    data: {
      breadcrumb: "Dashboard",
      title: "Events Dashboard"
    }
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: {
      breadcrumb: "Dashboard",
      title: "Events Dashboard"
    }
  },
  {
    path: 'calendar',
    component: CalendarComponent,
    data: {
      breadcrumb: "Calendar",
      title: "Calendar"
    }
  },
  {
    path: 'birthday',
    component: BirthdayComponent,
    data: {
      breadcrumb: "Birthday",
      title: "Birthday"
    }
  },
  {
    path: 'list',
    component: EventListComponent,
    data: {
      breadcrumb: "Event List",
      title: "Event List"
    }
  },
  {
    path: 'record-attendance/:event_id',
    component: RecordAttendanceComponent,
    data: {
      breadcrumb: "Record Attendance",
      title: "Record Event Attendance"
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }

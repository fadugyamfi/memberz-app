import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';








const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    data: {
      breadcrumb: "Dashboard",
      title: "Events Dashboard"
    }
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    data: {
      breadcrumb: "Dashboard",
      title: "Events Dashboard"
    }
  },
  {
    path: 'calendar',
    loadComponent: () => import('./calendar/calendar.component').then(m => m.CalendarComponent),
    data: {
      breadcrumb: "Calendar",
      title: "Calendar"
    }
  },
  {
    path: 'birthday',
    loadComponent: () => import('./birthday/birthday.component').then(m => m.BirthdayComponent),
    data: {
      breadcrumb: "Birthday",
      title: "Birthday"
    }
  },
  {
    path: 'list',
    loadComponent: () => import('./event-list/event-list.component').then(m => m.EventListComponent),
    data: {
      breadcrumb: "Event List",
      title: "Event List"
    }
  },
  {
    path: 'record-attendance/:event_id',
    loadComponent: () => import('./record-attendance/record-attendance.component').then(m => m.RecordAttendanceComponent),
    data: {
      breadcrumb: "Record Attendance",
      title: "Record Event Attendance"
    }
  },
  {
    path: 'attendance-list/:event_id',
    loadComponent: () => import('./attendance-list/attendance-list.component').then(m => m.AttendanceListComponent),
    data: {
      breadcrumb: "Attendance List",
      title: "Event Attendance List"
    }
  },
  {
    path: 'attendance-report/:event_id',
    loadComponent: () => import('./attendance-report/attendance-report.component').then(m => m.AttendanceReportComponent),
    data: {
      breadcrumb: "Attendance Report",
      title: "Event Attendance Report"
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }

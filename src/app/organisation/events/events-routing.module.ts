import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManagerComponent } from './manager/manager.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    data: {
      breadcrumb: "Dashboard",
      title: "Dashboard"
    }
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: {
      breadcrumb: "Dashboard",
      title: "Dashboard"
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
    path: 'manage',
    component: ManagerComponent,
    data: {
      breadcrumb: "Manager",
      title: "Manager"
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }

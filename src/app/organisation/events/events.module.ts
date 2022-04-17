import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { EditorModule } from '@tinymce/tinymce-angular';

import { EventsRoutingModule } from './events-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ManagerComponent } from './manager/manager.component';


@NgModule({
  declarations: [
    DashboardComponent,
    CalendarComponent,
    ManagerComponent
  ],
  imports: [
    CommonModule,
    EventsRoutingModule,
    SharedModule,
    EditorModule
  ]
})
export class EventsModule { }

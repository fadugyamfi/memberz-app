import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { EditorModule } from '@tinymce/tinymce-angular';

import { EventsRoutingModule } from './events-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CalendarComponent } from './calendar/calendar.component';
import { EventListComponent } from './event-list/event-list.component';
import { SessionsComponent } from './sessions/sessions.component';
import { RecordAttendanceComponent } from './record-attendance/record-attendance.component';
import { BirthdayComponent } from './birthday/birthday.component';
import { AttendanceListComponent } from './attendance-list/attendance-list.component';
import { MarkComponent } from './record-attendance/mark/mark.component';
import { AttendanceReportComponent } from './attendance-report/attendance-report.component';


@NgModule({
    imports: [
        CommonModule,
        EventsRoutingModule,
        SharedModule,
        EditorModule,
        DashboardComponent,
        CalendarComponent,
        EventListComponent,
        SessionsComponent,
        RecordAttendanceComponent,
        BirthdayComponent,
        AttendanceListComponent,
        MarkComponent,
        AttendanceReportComponent
    ]
})
export class EventsModule { }

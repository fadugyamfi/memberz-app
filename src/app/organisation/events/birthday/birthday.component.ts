import { Component, OnInit } from '@angular/core';
import { ViewBirthdaysComponent } from '../../../shared/components/birthday/view-birthdays/view-birthdays.component';
import { SmsMessengerComponent } from '../../../shared/components/messaging/sms-messenger/sms-messenger.component';

@Component({
    selector: 'app-birthday',
    templateUrl: './birthday.component.html',
    styleUrls: ['./birthday.component.scss'],
    standalone: true,
    imports: [ViewBirthdaysComponent, SmsMessengerComponent]
})
export class BirthdayComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

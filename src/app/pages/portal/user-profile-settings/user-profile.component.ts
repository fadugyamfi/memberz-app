import { Component, OnInit } from '@angular/core';
import { UserDetailsEditComponent } from './user-details-edit/user-details-edit.component';
import { TimezoneEditComponent } from './timezone-edit/timezone-edit.component';
import { TwofaEnableComponent } from './twofa-enable/twofa-enable.component';
import { DeleteAccountComponent } from './delete-account/delete-account.component';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss'],
    standalone: true,
    imports: [UserDetailsEditComponent, TimezoneEditComponent, TwofaEnableComponent, DeleteAccountComponent]
})
export class UserProfileComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

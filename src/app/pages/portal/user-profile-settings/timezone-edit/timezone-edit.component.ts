import { Component, OnInit } from '@angular/core';
import { MemberAccount } from 'src/app/shared/model/api/member-account';
import { AuthService } from 'src/app/shared/services/api/auth.service';
import { MemberAccountService } from 'src/app/shared/services/api/member-account.service';
import { EventsService } from 'src/app/shared/services/events.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-timezone-edit',
  templateUrl: './timezone-edit.component.html',
  styleUrls: ['./timezone-edit.component.scss']
})
export class TimezoneEditComponent implements OnInit {

  public timeZone: any;
  private memberAccount: MemberAccount;
  private subscriptions: Subscription[] = [];

  constructor(
    public authService: AuthService,
    public events: EventsService,
    public memberAccountService: MemberAccountService
  ) { }

  ngOnInit(): void {
    this.initializeMemberAccount();
    this.setupEvents();
  }


  ngOnDestroy() {
    this.removeEvents();
  }

  initializeMemberAccount() {
    this.memberAccount = this.authService.userStorageData();
    this.timeZone = this.memberAccount.timezone;
  }

  setupEvents() {
    this.events.on('MemberAccount:updated', () => {
      const sub = this.authService.me(true).subscribe();
      this.subscriptions.push(sub);
      Swal.fire('Request successful', 'Your timezone has been set successfully.', 'success');
    });
  }

  removeEvents() {
    this.events.off('MemberAccount:updated');
  }


  saveTimeZone() {
    this.memberAccount.timezone = this.timeZone.nameValue;

    this.memberAccountService.update(this.memberAccount);
  }

}

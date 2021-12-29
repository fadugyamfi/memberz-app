import { Component, OnInit } from '@angular/core';
import { MemberAccount } from 'src/app/shared/model/api/member-account';
import { AuthService } from 'src/app/shared/services/api/auth.service';
import { MemberAccountService } from 'src/app/shared/services/api/member-account.service';
import { EventsService } from 'src/app/shared/services/events.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.scss']
})
export class DeleteAccountComponent implements OnInit {

  private memberAccount: MemberAccount;

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
  }

  setupEvents() {
    this.events.on('MemberAccount:updated', () => this.authService.logout());
  }

  removeEvents() {
    this.events.off('MemberAccount:updated');
  }

  deleteAccount() {
    Swal.fire({
      title: 'Delete Account',
      text: `This action will delete the account belonging to ${this.memberAccount.name()} and all related data.`,
      icon: 'warning',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      showCancelButton: true,
      cancelButtonColor: '#933'
    }).then((action) => {
      if ( action.value ) {
        Swal.fire('Deleting Account', 'Please wait ...', 'info');
        Swal.showLoading();

        this.memberAccount.deleted = true;
        this.memberAccount.active = false;
        this.memberAccountService.update(this.memberAccount);
      }
    });

   
  }

}

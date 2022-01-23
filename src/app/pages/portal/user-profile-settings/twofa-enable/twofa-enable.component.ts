import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MemberAccount } from 'src/app/shared/model/api/member-account';
import { AuthService } from 'src/app/shared/services/api/auth.service';
import { TwoFactorAuthService } from 'src/app/shared/services/api/two-factor-auth.service';
import { MemberAccountService } from 'src/app/shared/services/api/member-account.service';
import { EventsService } from 'src/app/shared/services/events.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-twofa-enable',
  templateUrl: './twofa-enable.component.html',
  styleUrls: ['./twofa-enable.component.scss']
})
export class TwofaEnableComponent implements OnInit {
  @ViewChild('enableEmailTwofaModal', { static: true }) enableEmailTwofaModal: any;

  public memberAccount: MemberAccount;
  public email: string = "";
  public code = "";
  public subscriptions: Subscription[] = [];

  constructor(
    public modalService: NgbModal,
    public authService: AuthService,
    public events: EventsService,
    public memberAccountService: MemberAccountService,
    public twoFaService: TwoFactorAuthService,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.setupEvents();
    this.initializeMemberAccount();
  }

  initializeMemberAccount() {
    this.memberAccount = this.authService.getLoggedInUser();
    this.email = this.concealEmail(this.memberAccount.username);
  }

  setupEvents() {
    this.events.on('auth:refreshed', () => {
      this.memberAccount = this.authService.getLoggedInUser();
    });
  }

  submitEmailVerification() {
    if(!this.code){
      return;
    }

    this.twoFaService.enableEmailVerification(this.code);

    this.modalService.dismissAll();
  }

  getEmailVerificationCode() {
    const sub = this.twoFaService.send2FACode().subscribe({
      next: (data: any) => {
        if (data.status == "success"){
          this.events.trigger("toast", this.getSuccess(data.message));
        }
      },
      error: (error) => {
        this.twoFaService.requesting = false;
        this.events.trigger('toast', { title: 'Send Error', msg: 'Error requesting code', type: 'error'});
      }
    });

    this.subscriptions.push(sub);
  }

  getSuccess(msg: string) {
    return {
      title: 'Request Success',
      msg,
      type: 'success',
      closeOther: true
    };
  }

  concealEmail(email) {
    return email.replace(/(.{3})(.*)(?=@)/,
      function(gp1, gp2, gp3) {
        for(let i = 0; i < gp3.length; i++) {
          gp2+= "*";
        } return gp2;
      });
  };

  showEnableEmailTwofaModal() {
    this.modalService.open(this.enableEmailTwofaModal, { size: 'lg' });
    this.getEmailVerificationCode();
  }

  disable2FAByEmail() {
    Swal.fire({
      title: this.translate.instant('Disabling Two Factor Authentication By Email'),
      text: this.translate.instant("Are you sure you want to disable 2FA? It will make your account less secure"),
      confirmButtonText: this.translate.instant("Disable"),
      cancelButtonText: this.translate.instant('Cancel'),
      showCancelButton: true,
      icon: 'warning',
    }).then((result) => {
      if( result.isConfirmed ) {
        Swal.close();
        this.twoFaService.disable2FAByEmail();
      }
    });
  }
}

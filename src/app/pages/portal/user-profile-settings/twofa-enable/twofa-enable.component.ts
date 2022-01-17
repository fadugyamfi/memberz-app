import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MemberAccount } from 'src/app/shared/model/api/member-account';
import { AuthService } from 'src/app/shared/services/api/auth.service';
import { MemberAccountService } from 'src/app/shared/services/api/member-account.service';
import { EventsService } from 'src/app/shared/services/events.service';
import { TwoFaService } from 'src/app/shared/services/api/two-fa.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-twofa-enable',
  templateUrl: './twofa-enable.component.html',
  styleUrls: ['./twofa-enable.component.scss']
})
export class TwofaEnableComponent implements OnInit {
  @ViewChild('enableEmailTwofaModal', { static: true }) enableEmailTwofaModal: any;

  private memberAccount: MemberAccount;
  public email: string = "";
  public subscriptions: Subscription[] = [];

  constructor(
    public modalService: NgbModal,
    public authService: AuthService,
    public events: EventsService,
    public memberAccountService: MemberAccountService,
    public twoFaService: TwoFaService
  ) { }

  ngOnInit(): void {
    this.initializeMemberAccount();
  }

  initializeMemberAccount() {
    this.memberAccount = this.authService.userStorageData();
    this.email = this.concealEmail(this.memberAccount.username);
  }


  submitEmailVerification() {
    this.modalService.dismissAll();
  }

  getEmailVerificationCode() {
    const sub = this.twoFaService.sendCode().subscribe((data: any) => {
      if (data.status == "success"){
        this.events.trigger("toast", this.getSuccess(data.message));
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
  }

}

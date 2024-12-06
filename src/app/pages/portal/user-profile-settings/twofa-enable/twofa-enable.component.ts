import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, UntypedFormGroup, UntypedFormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MemberAccount } from 'src/app/shared/model/api/member-account';
import { AuthService } from 'src/app/shared/services/api/auth.service';
import { TwoFactorAuthService } from 'src/app/shared/services/api/two-factor-auth.service';
import { MemberAccountService } from 'src/app/shared/services/api/member-account.service';
import { EventsService } from 'src/app/shared/services/events.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

@Component({
    selector: 'app-twofa-enable',
    templateUrl: './twofa-enable.component.html',
    styleUrls: ['./twofa-enable.component.scss'],
    imports: [FormsModule, ReactiveFormsModule, NgxIntlTelInputModule, TranslateModule]
})
export class TwofaEnableComponent implements OnInit {
  @ViewChild('enableTwoFactorAuthModal', { static: true }) enableTwoFactorAuthModal: any;

  public twoFactorAuthForm: UntypedFormGroup;

  public memberAccount: MemberAccount;
  public subscriptions: Subscription[] = [];

  constructor(
    public modalService: NgbModal,
    public authService: AuthService,
    public events: EventsService,
    public memberAccountService: MemberAccountService,
    public twoFactorAuthService: TwoFactorAuthService,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.setupEvents();
    this.initializeMemberAccount();

    this.twoFactorAuthForm = new UntypedFormGroup({
      verificationType: new UntypedFormControl("email", [Validators.required]),
      code: new UntypedFormControl('', [Validators.required])
    });
  }

  initializeMemberAccount() {
    this.memberAccount = this.authService.getLoggedInUser();
  }

  setupEvents() {
    this.events.on('auth:refreshed', () => {
      this.memberAccount = this.authService.getLoggedInUser();
    });
  }

  submitVerification() {
    if(!this.twoFactorAuthForm.value.code){
      return;
    }

    this.twoFactorAuthService.enableVerification(this.twoFactorAuthForm.value.code);

    this.modalService.dismissAll();
  }

  getVerificationCode() {
    const sub = this.twoFactorAuthService.sendTwoFactorAuthCode(this.twoFactorAuthForm.value.verificationType).subscribe({
      next: (data: any) => {
        if (data.status == "success"){
          this.events.trigger("toast", this.getSuccess(data.message));
        }
      },
      error: (error) => {
        this.twoFactorAuthService.requesting = false;
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

  showEnableTwoFactorAuthModal() {
    this.modalService.open(this.enableTwoFactorAuthModal, { size: 'lg' });
  }

  disableTwoFactorAuth() {
    Swal.fire({
      title: this.translate.instant('Disabling Two Factor Authentication'),
      text: this.translate.instant("Are you sure you want to disable 2FA? It will make your account less secure"),
      confirmButtonText: this.translate.instant("Disable"),
      cancelButtonText: this.translate.instant('Cancel'),
      showCancelButton: true,
      icon: 'warning',
    }).then((result) => {
      if( result.isConfirmed ) {
        Swal.close();
        this.twoFactorAuthService.disableTwoFactorAuth();
      }
    });
  }
}

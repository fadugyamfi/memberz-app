import { StorageService } from '../storage.service';
import { MemberAccount } from '../../model/api/member-account';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { OrganisationService } from './organisation.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EventsService } from '../events.service';
import { APIService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class TwoFactorAuthService extends APIService<MemberAccount> {
  public userData: MemberAccount;
  public _sessionId: MemberAccount;
  public currentLang: string;

  constructor(
    public http: HttpClient,
    public events: EventsService,
    public storage: StorageService,
    public router: Router,
    public organisationService: OrganisationService,
    public modalService: NgbModal,
    public translate: TranslateService
  ) {
    super(http, events, storage);

    this.url = '/auth';
    this.model_name = 'Auth';

  }

  send2FACode(verification_type: string) {
     const param = {verification_type};

    return this.post('/2fa/send-code', param);
    
  }

  public enableVerification(code: string) {
    const param = { code };
    Swal.fire(
      this.translate.instant('Enabling Login Verification'),
      '',
      'info'
    );
    Swal.showLoading();

    return this.post('/2fa/enable', param).subscribe({
      next: () => {
        this.events.trigger('auth:refresh');

        Swal.fire(
          this.translate.instant('Enabling Login Verification'),
          this.translate.instant('You will be required to provide a code at your next login'),
          'success'
        );
      },

      error: () => {
        Swal.fire(
          this.translate.instant('Failed To Enable Login Verification'),
          this.translate.instant('Please try again'),
          'error'
        );
        Swal.hideLoading();
        this.requesting = false;
      }
    });
  }

  public disable2FA() {
    Swal.fire(
      this.translate.instant('Disabling Two Factor Authentication'),
      this.translate.instant('Please wait'),
      'info'
    );
    Swal.showLoading();

    return this.post('/2fa/disable', {}).subscribe({
      next: () => {
        this.events.trigger('auth:refresh');
        Swal.fire(this.translate.instant('Two Factor Authentication Disabled'), '', 'info');
      },
      error: () => {
        Swal.hideLoading();
        Swal.fire(
          this.translate.instant('Error'),
          this.translate.instant('Could not disable Two Factor Authentication'),
          'error'
        );
      }
    })
  }
}

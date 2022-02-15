import { APIService } from './api.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EventsService } from '../events.service';
import { StorageService } from '../storage.service';
import { map, switchMap } from 'rxjs/operators';
import { MemberAccount } from '../../model/api/member-account';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { OrganisationService } from './organisation.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegisterUserContract } from '../../contracts/register-user-contract';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends APIService<MemberAccount> {
  public userData: MemberAccount;
  public _sessionId: MemberAccount;
  public currentLang: string;
  public DAYS_TO_REMEMBER_USER = 30;

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

    translate.setDefaultLang('en');

    if (this.storage.has('current_lang')) {
      this.currentLang = this.storage.get('current_lang');
      translate.use(this.currentLang);
    }

    this.setupEvents();
    this.loadUserData();
  }

  public setupEvents() {
    this.events.on('api:authentication:required', () => this.logout());
    this.events.on('auth:logout', () => this.logout());
    this.events.on('auth:refresh', () => this.me(true).subscribe());
  }

  public login(username: string, password: string, remember_me: boolean = false) {
    const DURATION = remember_me ? this.DAYS_TO_REMEMBER_USER : 1;
    const params = { username, password };

    this.storage.set('loginUser', params);
    this.storage.set('remember_me', remember_me);

    return this.post(`${this.url}/login`, params).subscribe({
      next: (res) => {
        if (res['status'] == '2fa') {
          this.router.navigate(['/auth/2fa']);
        } else {
          this.performLogin(res, DURATION, remember_me);
        }
      },
      error: () => {
        Swal.fire(
          this.translate.instant('Login Failed'),
          this.translate.instant('Username or Password may be incorrect') + '.' + this.translate.instant('Please try again'),
          'error'
        );
        this.requesting = false;
      }
    });
  }


  public validateTwoFaLogin(username: string, password: string, remember_me: boolean = false, code: string) {
    const DURATION = remember_me ? this.DAYS_TO_REMEMBER_USER : 1;
    const params = { username, password, code };

    return this.post(`${this.url}/2fa-validate`, params).subscribe({
      next: (res) => {
        this.performLogin(res, DURATION, remember_me);
      },
      error: () => {
        Swal.fire(
          this.translate.instant('Login Failed'),
          this.translate.instant('Username or Password may be incorrect') + '.' + this.translate.instant('Please try again'),
          'error'
        );
        this.requesting = false;
      }
    });
  }

  private performLogin(res, DURATION, remember_me) {
    this.storage.remove('loginUser');
    this.storage.remove('remember_me');
    this.storage.set('auth', res, DURATION, 'day');

    this.me(remember_me).subscribe(() => this.router.navigate(['/portal/home']));
  }

  public register(data: RegisterUserContract) {
    Swal.fire(
      this.translate.instant('Registering Your Account'),
      this.translate.instant('You will be logged in automatically when successful'),
      'info'
    );
    Swal.showLoading();

    return this.post(`${this.url}/register`, data).subscribe({
      next: () => {
        this.login(data.email, data.password);
        Swal.fire(
          this.translate.instant('Registration Successful'),
          this.translate.instant('Logging in to the application'),
          'success'
        );
        Swal.showLoading();
      },
      error: () => {
        Swal.fire(
          this.translate.instant('Registration Failed'),
          this.translate.instant('Please try again'),
          'error'
        );
        Swal.hideLoading();
        this.requesting = false;
      }
    });
  }

  public forgotPassword(email: string) {
    return this.post(`${this.url}/forgot-password`, {
      username: email,
    }).subscribe({
      next: () => {
        Swal.fire(
          this.translate.instant('Request Successful'),
          this.translate.instant('A password reset link has been sent to your email') + '.' +
          this.translate.instant('Please use that link to reset your password'),
          'success'
        );
        this.router.navigate(['/auth/login']);
      },
      error: () => (this.requesting = false)
    });
  }

  public resetPassword(username: string, password: string, token: string) {
    const params = { username, password, token };

    return this.post(`${this.url}/reset-password`, params).subscribe({
      next: () => this.router.navigate(['/auth/login']),
      error: () => (this.requesting = false)
    });
  }

  public me(remember_user: boolean = false) {
    const DURATION = remember_user ? this.DAYS_TO_REMEMBER_USER : 1;

    return this.get(`${this.url}/me`).pipe(
      map((response) => {
        const user = new MemberAccount(response);
        this.storage.set('user', user, DURATION, 'day');
        this.loadUserData();
        this.events.trigger('auth:refreshed');
        return user;
      })
    );
  }

  // Sign out
  public logout() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };

    if (!this.storage.isValid('auth')) {
      this.clearSession();
      this.router.navigate(['/auth/login']);
      return;
    }

    this.post(`${this.url}/logout`, {}).subscribe({
      next: () => this.clearAndRedirect(), // on success
      error: () => this.clearAndRedirect() // on error
    });
  }

  public clearAndRedirect() {
    Swal.close();
    this.modalService.dismissAll();
    this.clearSession();
    this.router.navigate(['/auth/login']);
  }

  public clearSession() {
    this.organisationService.clearActiveOrganisation();
    this.storage.remove('user');
    this.storage.remove('auth');
  }

  loadUserData() {
    if (this.storage.has('user')) {
      this.userData = this.userStorageData();
      this._sessionId = this.userData;
    }
  }

  getLoggedInUser() {
    return this.userData;
  }

  public userStorageData() {
    return new MemberAccount(this.storage.get('user'));
  }

  get isLoggedIn(): boolean {
    return this.storage.has('auth') && this.storage.has('user');
  }

  get showLoader() {
    return this.requesting;
  }
}

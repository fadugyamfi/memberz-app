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
import { RegisterUserContract } from "../../contracts/register-user-contract";

@Injectable({
    providedIn: 'root'
})
export class AuthService extends APIService<MemberAccount> {

    public userData;
    public _sessionId;

    constructor(
        public http: HttpClient,
        public events: EventsService,
        public storage: StorageService,
        public router: Router,
        public organisationService: OrganisationService,
        public modalService: NgbModal
    ) {
        super(http, events, storage);

        this.url = '/auth';
        this.model_name = 'Auth';

        this.setupEvents();
        this.loadUserData();
    }

    public setupEvents() {
        this.events.on('api:authentication:required', () => this.logout());
    }

    public login(username: string, password: string, remember_me: boolean = false) {
        const DURATION = remember_me ? 14 : 1;
        const params = { username, password };

        return this.post(`${this.url}/login`, params).pipe(
            map(response => {
                this.storage.set('auth', response, DURATION, 'day');
                return response;
            }),
            switchMap(() => this.me(remember_me))
        ).subscribe(
            () => this.router.navigate(['/portal/home']),
            () => {
                Swal.fire('Login Failed', 'Username or Password may be incorrect. Please try again', 'error');
                this.requesting = false;
            },
            () => this.requesting = false
        );
    }

    public register(data: RegisterUserContract){
       return this.post(`${this.url}/register`, data).subscribe(
           () => this.login(data.email, data.password),
           () => this.requesting = false
       );
    }

    public forgotPassword(email: string){
        return this.post(`${this.url}/forgot-password`, {username: email}).subscribe(
            () => this.router.navigate(['/auth/login']),
            () => this.requesting = false
        )
    }

    public resetPassword(username: string, password: string, token: string) {
        const params = { username, password, token };

        return this.post(`${this.url}/reset-password`, params).subscribe(
            () => this.router.navigate(['/auth/login']),
            () => this.requesting = false
        );
    }

    public me(remember_user: boolean = false) {
        const DURATION = remember_user ? 14 : 1;

        return this.get(`${this.url}/me`).pipe(map(response => {
            const user = new MemberAccount(response);
            this.storage.set('user', user, DURATION, 'day');
            this.loadUserData();
            return user;
        }));
    }

    // Sign out
    public logout() {
        this.router.routeReuseStrategy.shouldReuseRoute = function () {
            return false;
        };

        if (!this.storage.isValid('auth')) {
            this.clearSession();
            this.router.navigate(['/auth/login']);
            return;
        }

        this.post(`${this.url}/logout`, {}).subscribe(
            () => this.clearAndRedirect(), // on success
            () => this.clearAndRedirect() // on error
        );
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
            this.userData = new MemberAccount(this.storage.get('user'));
            this._sessionId = this.userData;
        }
    }

    get isLoggedIn(): boolean {
        return this.storage.has('auth') && this.storage.has('user');
    }

    get showLoader() {
        return this.requesting;
    }
}

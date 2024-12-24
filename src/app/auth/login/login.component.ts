import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/api/auth.service';
import { SearchCountryField, CountryISO, PhoneNumberFormat, NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { environment } from '../../../environments/environment';

import { TawkChatComponent } from '../../components/tawk-chat/tawk-chat.component';
import { TranslateModule } from '@ngx-translate/core';

type UserFields = 'username' | 'password';
type FormErrors = { [u in UserFields]: string };

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [RouterLink, FormsModule, ReactiveFormsModule, NgxIntlTelInputModule, TawkChatComponent, TranslateModule]
})
export class LoginComponent implements OnInit {

  public _environment = environment;
  public newUser = false;
  public loginForm: UntypedFormGroup;
  public formErrors: FormErrors = {
    'username': '',
    'password': '',
  };
  public errorMessage: any;
  public emailLogin: boolean = true;

  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.Ghana, CountryISO.Nigeria, CountryISO.Togo];

  constructor(
    public authService: AuthService,
    private fb: UntypedFormBuilder,
    public route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required],
      remember_me: [true]
    });
  }

  ngOnInit() {
    this.authService.requesting = false;
    this.doNewExperienceLogin();
  }

  doNewExperienceLogin() {
    const trial = this.route.snapshot.queryParamMap.get('net'); // net = new experience trial
    const access_token = this.route.snapshot.queryParamMap.get('access_token');
    const expires_in = this.route.snapshot.queryParamMap.get('expires_in');

    if (!trial) {
      return;
    }

    const auth = { access_token, expires_in, token_type: 'bearer' };
    this.authService.performLogin(auth, 30, true);
  }

  toggleEmailLogin() {
    this.emailLogin = !this.emailLogin;
  }

  // Login With Google
  // loginGoogle() {
  //   this.authService.GoogleAuth();
  // }

  // // Login With Twitter
  // loginTwitter(): void {
  //   this.authService.signInTwitter();
  // }

  // // Login With Facebook
  // loginFacebook() {
  //   this.authService.signInFacebok();
  // }

  // Simple Login
  login() {
    const login = this.loginForm.value;
    if (!this.emailLogin) {
      login.username = login.username.e164Number;
    }
    this.authService.login(login.username, login.password, login.remember_me);
  }

}

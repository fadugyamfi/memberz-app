import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { MemberAccountService } from '../../shared/services/cakeapi/member-account.service';
import { StorageService } from '../../shared/services/storage.service';
import { AuthService } from '../../shared/services/cakeapi/auth.service';

type UserFields = 'email' | 'password';
type FormErrors = { [u in UserFields]: string };

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public newUser = false;
  public user: firebase.User;
  public loginForm: FormGroup;
  public formErrors: FormErrors = {
    'email': '',
    'password': '',
  };
  public errorMessage: any;

  constructor(
    public authService: AuthService,
    private afauth: AngularFireAuth,
    private fb: FormBuilder,
    private router: Router,
    private memberAccountService: MemberAccountService,
    private storage: StorageService
  ) {
    this.loginForm = fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      remember_me: [true]
    });
  }

  ngOnInit() {
    this.authService.requesting = false;
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
    // this.authService.SignIn(this.loginForm.value['email'], this.loginForm.value['password']);
    const login = this.loginForm.value;
    this.authService.login(login.email, login.password, login.remember_me);
  }

}

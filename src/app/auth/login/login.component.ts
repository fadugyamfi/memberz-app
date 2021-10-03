import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../shared/services/api/auth.service';

type UserFields = 'email' | 'password';
type FormErrors = { [u in UserFields]: string };

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public newUser = false;
  // public user: firebase.User;
  public loginForm: FormGroup;
  public formErrors: FormErrors = {
    'email': '',
    'password': '',
  };
  public errorMessage: any;

  constructor(
    public authService: AuthService,
    private fb: FormBuilder
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
    const login = this.loginForm.value;
    this.authService.login(login.email, login.password, login.remember_me);
  }

}

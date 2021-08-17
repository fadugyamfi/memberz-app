import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../shared/services/api/auth.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

type UserFields = 'email' | 'password' | 'confirm_password';
type FormErrors = { [u in UserFields]: string };

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  public passwordMismatch: boolean = false;
  private token: string = '';
  public resetPasswordForm: FormGroup;
  public formErrors: FormErrors = {
    'email': '',
    'password': '',
    'confirm_password': ''
  };

  constructor(public authService: AuthService, private fb: FormBuilder, private route: ActivatedRoute,) {
    this.resetPasswordForm = fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirm_password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.authService.requesting = false;
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      console.log(this.token);
    });
  }

  resetPassword() {
    const input = this.resetPasswordForm.value;

    if (input.password !== input.confirm_password){
      return this.passwordMismatch = true;
    }

    this.passwordMismatch = false;

    this.authService.resetPassword(input.email, input.password, this.token);
  }

}

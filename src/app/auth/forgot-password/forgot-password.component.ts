import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../shared/services/api/auth.service';

type UserFields = 'email';
type FormErrors = { [u in UserFields]: string };

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  public forgotPasswordForm: FormGroup;
  public formErrors: FormErrors = {
    'email': '',
  };

  constructor(
    public authService: AuthService,
    private fb: FormBuilder
  ) {
    this.forgotPasswordForm = fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
   }

  ngOnInit(): void {
    this.authService.requesting = false;
  }

  send() {
    const input = this.forgotPasswordForm.value;
    this.authService.forgotPassword(input.email);
  }

}

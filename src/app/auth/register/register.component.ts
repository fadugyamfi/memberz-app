import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../shared/services/api/auth.service';

type UserFields = 'email' | 'password' | 'first_name' | 'last_name' | 'dob' | 'mobile_number' | 'gender';
type FormErrors = { [u in UserFields]: string };
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public registerForm: FormGroup;
  public formErrors: FormErrors = {
    'first_name': "",
    'last_name': "",
    'dob': "",
    'mobile_number': '',
    'gender': "",
    'email': '',
    'password': '',
  };
  public errorMessage: any;

  constructor(public authService: AuthService, private fb: FormBuilder) {
    this.registerForm = fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      dob: ['', Validators.required],
      mobile_number: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      remember_me: [true]
    });
  }

  ngOnInit(): void {
    this.authService.requesting = false;
  }

  register(){
    const input = this.registerForm.value;
    this.authService.register(input);
  }

}

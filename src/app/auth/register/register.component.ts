import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormControl } from "@angular/forms";
import { AuthService } from "../../shared/services/api/auth.service";
import { EventsService } from "../../shared/services/events.service";
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';

type UserFields =
  | "email"
  | "password"
  | "first_name"
  | "last_name"
  | "dob"
  | "mobile_number"
  | "gender";
type FormErrors = { [u in UserFields]: string };
@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {
  public registerForm: FormGroup;
  public formErrors: FormErrors = {
    first_name: "",
    last_name: "",
    dob: "",
    mobile_number: "",
    gender: "",
    email: "",
    password: "",
  };

  separateDialCode = true;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
	preferredCountries: CountryISO[] = [CountryISO.Ghana, CountryISO.Nigeria, CountryISO.Togo];

  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    public events: EventsService
  ) {
    this.registerForm = fb.group({
      first_name: new FormControl("", [Validators.minLength(3), Validators.maxLength(30)]),
      last_name: new FormControl("", [Validators.minLength(3), Validators.maxLength(30)]),
      name: new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
      dob: new FormControl("", []),
      gender: new FormControl("", []),
      mobile_number: new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(15)]),
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [Validators.required,  Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]),
    });
  }

  ngOnInit() {
    this.authService.requesting = false;
  }

  register() {
    const input = this.registerForm.value;
    const names: string[] = input.name.split(" ");
    input.first_name = names[0];
    input.last_name = names.filter((v, i) => i > 0).join(' ');
    input.mobile_number = input.mobile_number.e164Number;

    this.authService.register(input);
  }
}

import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, Validators, UntypedFormGroup, UntypedFormControl } from "@angular/forms";
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
  public registerForm: UntypedFormGroup;
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
    private fb: UntypedFormBuilder,
    public events: EventsService
  ) {
    this.registerForm = fb.group({
      first_name: new UntypedFormControl("", [Validators.minLength(3), Validators.maxLength(30)]),
      last_name: new UntypedFormControl("", [Validators.minLength(3), Validators.maxLength(30)]),
      name: new UntypedFormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
      dob: new UntypedFormControl("", []),
      gender: new UntypedFormControl("", []),
      mobile_number: new UntypedFormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(15)]),
      email: new UntypedFormControl("", [Validators.required, Validators.email]),
      password: new UntypedFormControl("", [Validators.required,  Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]),
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

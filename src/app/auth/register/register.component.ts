import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormControl } from "@angular/forms";
import { AuthService } from "../../shared/services/api/auth.service";
import { ToastrService } from "ngx-toastr";
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
export class RegisterComponent implements OnInit, OnDestroy {
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
    public toastrService: ToastrService,
    public events: EventsService
  ) {
    this.registerForm = fb.group({
      first_name: new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
      last_name: new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
      dob: new FormControl("", [Validators.required]),
      gender: new FormControl("", [Validators.required]),
      mobile_number: new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(15)]),
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [Validators.required,  Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]),
    });
  }

  ngOnInit() {

    this.authService.requesting = false;

    this.events.on("toast", (toast) => {
      switch (toast.type) {
        case "error":
          this.toastrService.error(toast.msg, toast.title);
          break;

        case "success":
          this.toastrService.success(toast.msg, toast.title);
          break;

        default:
          this.toastrService.info(toast.msg, toast.title);
      }
    });
  }

  ngOnDestroy() {
    this.events.off("toast");
  }

  register() {
    const input = this.registerForm.value;
    this.authService.register(input);
  }
}

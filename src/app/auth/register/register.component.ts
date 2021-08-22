import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { AuthService } from "../../shared/services/api/auth.service";
import { ToastrService } from "ngx-toastr";
import { EventsService } from "../../shared/services/events.service";

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

  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    public toastrService: ToastrService,
    public events: EventsService
  ) {
    this.registerForm = fb.group({
      first_name: ["", Validators.required],
      last_name: ["", Validators.required],
      dob: ["", Validators.required],
      gender: ["", Validators.required],
      mobile_number: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
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

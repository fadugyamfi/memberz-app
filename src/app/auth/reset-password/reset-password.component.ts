import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { AuthService } from "../../shared/services/api/auth.service";
import { ActivatedRoute} from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { EventsService } from "../../shared/services/events.service";

type UserFields = "email" | "password" | "confirm_password";
type FormErrors = { [u in UserFields]: string };

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.scss"],
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  public passwordMismatch: boolean = false;
  private token: string = "";
  public resetPasswordForm: FormGroup;
  public formErrors: FormErrors = {
    email: "",
    password: "",
    confirm_password: "",
  };

  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public toastrService: ToastrService,
    public events: EventsService
  ) {
    this.resetPasswordForm = fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
      confirm_password: ["", Validators.required],
    });
  }

  ngOnInit() {
    this.authService.requesting = false;
    this.route.queryParams.subscribe((params) => {
      this.token = params["token"];
    });
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

  resetPassword() {
    const input = this.resetPasswordForm.value;

    if (input.password !== input.confirm_password) {
      return (this.passwordMismatch = true);
    }

    this.passwordMismatch = false;

    this.authService.resetPassword(input.email, input.password, this.token);
  }
}

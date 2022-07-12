import { Component, OnDestroy, OnInit } from "@angular/core";
import { UntypedFormBuilder, Validators, UntypedFormGroup, UntypedFormControl } from "@angular/forms";
import { AuthService } from "../../shared/services/api/auth.service";
import { ActivatedRoute, Router} from "@angular/router";
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

  private token = "";
  private email = '';
  public passwordMismatch: boolean = false;
  public resetPasswordForm: UntypedFormGroup;
  public formErrors: FormErrors = {
    email: "",
    password: "",
    confirm_password: "",
  };

  constructor(
    public authService: AuthService,
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    public toastrService: ToastrService,
    public events: EventsService,
    public router: Router
  ) {

  }

  ngOnInit() {
    this.authService.requesting = false;

    this.route.queryParams.subscribe((params) => {
      this.token = params["token"];
      this.email = params['email'];
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

    this.setupForm();
  }

  ngOnDestroy() {
    this.events.off("toast");
  }

  setupForm() {
    this.resetPasswordForm = this.fb.group({
      email: [this.email, [Validators.required, Validators.email]],
      password: ["", Validators.required],
      confirm_password: new UntypedFormControl("", [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]),
    });
  }

  resetPassword() {
    const input = this.resetPasswordForm.value;

    if (input.password !== input.confirm_password) {
      return (this.passwordMismatch = true);
    }

    this.passwordMismatch = false;

    this.authService.resetPassword(input.email, input.password, this.token);
  }

  cancelReset() {
    this.router.navigate(['/auth/login']);
  }
}

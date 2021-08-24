import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../shared/services/api/auth.service';
import { ToastrService } from "ngx-toastr";
import { EventsService } from "../../shared/services/events.service";

type UserFields = 'email';
type FormErrors = { [u in UserFields]: string };

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {

  public forgotPasswordForm: FormGroup;
  public formErrors: FormErrors = {
    'email': '',
  };

  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    public toastrService: ToastrService,
    public events: EventsService
  ) {
    this.forgotPasswordForm = fb.group({
      email: ['', [Validators.required, Validators.email]],
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

  send() {
    const input = this.forgotPasswordForm.value;
    this.authService.forgotPassword(input.email);
  }

}

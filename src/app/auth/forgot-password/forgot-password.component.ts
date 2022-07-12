import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators, UntypedFormGroup } from '@angular/forms';
import { AuthService } from '../../shared/services/api/auth.service';
import { ToastrService } from "ngx-toastr";
import { EventsService } from "../../shared/services/events.service";
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

type UserFields = 'email';
type FormErrors = { [u in UserFields]: string };

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {

  public forgotPasswordForm: UntypedFormGroup;
  public formErrors: FormErrors = {
    'email': '',
  };

  constructor(
    public authService: AuthService,
    private fb: UntypedFormBuilder,
    public toastrService: ToastrService,
    public events: EventsService,
    public router: Router,
    public translate: TranslateService
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
    Swal.fire(
      this.translate.instant('Sending Password Reset Link'),
      this.translate.instant("Please wait") + ' ...',
      'info'
    );
    Swal.showLoading();
  }

  cancel() {
    this.router.navigate(['/auth/login']);
  }
}

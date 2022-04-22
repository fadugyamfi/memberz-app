import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from 'src/app/shared/services/storage.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../shared/services/api/auth.service';


type Field = 'code'
type FormErrors = { [u in Field]: string };

@Component({
  selector: 'app-two-fa-check',
  templateUrl: './two-fa-check.component.html',
  styleUrls: ['./two-fa-check.component.scss']
})
export class TwoFaCheckComponent implements OnInit {

  public twoFaCheckForm: FormGroup;
  public formErrors: FormErrors = {
    'code': ''
  };
  public errorMessage: any;
  public email: '';

  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    private storage: StorageService,
    private route: ActivatedRoute,
    private router: Router,
    public translate: TranslateService
  ) {
    this.twoFaCheckForm = fb.group({
      code: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.authService.requesting = false;
    this.doNewExperienceSetup();
  }

  doNewExperienceSetup() {
    const netCheck = this.route.snapshot.queryParamMap.get('net');
    const auth = this.route.snapshot.queryParamMap.get('auth');

    if( !netCheck ) {
      return;
    }

    const decodedAuth = atob(auth);
    const parts = decodedAuth.split(":");
    const username = parts[0];
    const password = parts[1];

    this.storage.set('loginUser', { username, password });
  }


  validate() {
    const twoFactorAuthForm = this.twoFaCheckForm.value;
    const login = this.storage.get('loginUser');
    const remember_me = this.storage.get('remember_me');

    if( !login || !remember_me ) {
      Swal.fire(
        this.translate.instant('Invalid Form State'),
        this.translate.instant('Please attempt login again'),
        'error'
      ).then(() => {
        return this.router.navigate(['/auth/login']);
      })
    }

    this.authService.validateTwoFactorAuthLogin(login.username, login.password, remember_me, twoFactorAuthForm['code']);
  }
}

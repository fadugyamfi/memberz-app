import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from 'src/app/shared/services/storage.service';
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
    private route: ActivatedRoute
  ) {
    this.twoFaCheckForm = fb.group({
      code: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.authService.requesting = false;
    this.doNewExperienceSetup();
    this.email = this.concealEmail(this.storage.get('loginUser').username);
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

  concealEmail(email) {
    return email.replace(/(.{3})(.*)(?=@)/,
      function(gp1, gp2, gp3) {
        for(let i = 0; i < gp3.length; i++) {
          gp2+= "*";
        } return gp2;
      });
  };

  validate() {
    const twoFaForm = this.twoFaCheckForm.value;
    const login = this.storage.get('loginUser');
    const remember_me = this.storage.get('remember_me');
    this.authService.validateTwoFaLogin(login.username, login.password, remember_me, twoFaForm['code']);
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { AuthService } from 'src/app/shared/services/api/auth.service';
import { EventsService } from 'src/app/shared/services/events.service';

@Component({
  selector: 'app-user-details-edit',
  templateUrl: './user-details-edit.component.html',
  styleUrls: ['./user-details-edit.component.scss']
})
export class UserDetailsEditComponent implements OnInit, OnDestroy {

  public profileForm: FormGroup;

  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.Ghana, CountryISO.Nigeria, CountryISO.Togo];

  constructor(
    public authService: AuthService,
    public events: EventsService,
    public toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.setupProfileForm();
    this.initiliazeToastr();
    this.initializeProfileData();
  }

  ngOnDestroy() {
    this.events.off("toast");
  }

  initializeProfileData(){
    let data = this.authService.userStorageData();
    
    let userData = {
      first_name: data.member.first_name,
      last_name: data.member.last_name,
      dob: data.member.dob.split('T')[0],
      gender: data.member.gender,
      mobile_number: data.member.mobile_number,
      email: data.username
    };

    this.profileForm.patchValue(userData);
  }

  initiliazeToastr() {
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


  setupProfileForm() {
    this.profileForm = new FormGroup({
      first_name: new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
      last_name: new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
      dob: new FormControl("", [Validators.required]),
      gender: new FormControl("", [Validators.required]),
      mobile_number: new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(15)]),
      email: new FormControl("", [Validators.required, Validators.email]),
    });
  }


  updateProfile() {
    const input = this.profileForm.value;
    input.mobile_number = input.mobile_number.e164Number;
    this.authService.updateProfile(input);
  }

}

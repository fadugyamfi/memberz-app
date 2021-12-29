import { Component, OnDestroy, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { AuthService } from 'src/app/shared/services/api/auth.service';
import { EventsService } from 'src/app/shared/services/events.service';
import { MemberService } from 'src/app/shared/services/api/member.service';
import { Member } from 'src/app/shared/model/api/member';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

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

  private memberData: Member;
  private subscriptions: Subscription[] = [];

  constructor(
    public authService: AuthService,
    public events: EventsService,
    public toastrService: ToastrService,
    public memberService: MemberService
  ) { }

  ngOnInit(): void {
    this.setupProfileForm();
    this.initiliazeToastr();
    this.initializeProfileData();
    this.setupEvents();
  }

  ngOnDestroy() {
    this.events.off("toast");
    this.removeEvents();
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  initializeProfileData() {
    let data = this.authService.userStorageData();
    this.memberData = data._member;
    this.memberData.dob = data.member.dob.split('T')[0];

    this.profileForm.patchValue(this.memberData);
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
      occupation: new FormControl(""),
      business_name: new FormControl("")
    });
  }

  setupEvents() {
  this.events.on('Member:updated', () => {
    const sub =  this.authService.me(true).subscribe();
    this.subscriptions.push(sub);
    Swal.fire('Request successful', 'Your personal information has been updated.', 'success');
  });
  }

  removeEvents() {
    this.events.off('Member:updated');
  }

  updateProfile() {
    const input = this.profileForm.value;
    input.mobile_number = input.mobile_number.e164Number;
    let postData: Member = Object.assign(this.memberData, input);
    this.memberService.update(postData);
  }

}

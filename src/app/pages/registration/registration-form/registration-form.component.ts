import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { Member } from '../../../shared/model/api/member';
import { MemberAccount } from '../../../shared/model/api/member-account';
import { Organisation } from '../../../shared/model/api/organisation';
import { OrganisationMember } from '../../../shared/model/api/organisation-member';
import { OrganisationRegistrationForm } from '../../../shared/model/api/organisation-registration-form';
import { MemberAccountService } from '../../../shared/services/api/member-account.service';
import { MemberService } from '../../../shared/services/api/member.service';
import { OrganisationMemberService } from '../../../shared/services/api/organisation-member.service';
import { OrganisationRegistrationFormService } from '../../../shared/services/api/organisation-registration-form.service';
import { OrganisationService } from '../../../shared/services/api/organisation.service';
import { EventsService } from '../../../shared/services/events.service';

@Component({
  selector: 'membership-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss']
})
export class RegistrationFormComponent implements OnInit, OnDestroy {

  public organisation: Organisation;
  public registrationFormConfig: OrganisationRegistrationForm;
  public subscriptions: Subscription[] = [];

  public membershipForm: FormGroup;
  public profileForm: FormGroup;
  public accountForm: FormGroup;

  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.Ghana, CountryISO.Nigeria, CountryISO.Togo];

  constructor(
    public organisationService: OrganisationService,
    public registrationFormService: OrganisationRegistrationFormService,
    public route: ActivatedRoute,
    public router: Router,
    public translate: TranslateService,
    public profileService: MemberService,
    public membershipService: OrganisationMemberService,
    public events: EventsService,
    public accountService: MemberAccountService
  ) { }

  ngOnInit(): void {
    this.setupRegistrationForm();
    this.setupEvents();

    if( this.route.snapshot.paramMap.has('slug') && this.route.snapshot.paramMap.has('org_slug') ) {
      this.loadOrganisationAndThenFormBySlugs();
    } else {
      this.loadOrganisation();
      this.loadRegistrationFormDefinition();
    }
  }

  ngOnDestroy(): void {
    this.removeEvents();
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadOrganisationAndThenFormBySlugs() {
    const orgSlug = this.route.snapshot.paramMap.get('org_slug');
    const slug = this.route.snapshot.paramMap.get('slug');

    const sub = this.organisationService.getAll({ slug: orgSlug }).subscribe(organisations => {

      if( !organisations || organisations.length == 0 ) {
        Swal.fire('Invalid Configuration', 'Link provided was invalid. Registration cannot proceed', 'error').then(() => {
          this.router.navigate(['/']);
        });
        return;
      }

      this.organisation = new Organisation(organisations[0]);

      const sub2 = this.registrationFormService.getAll({ organisation_id: this.organisation.id, slug }).subscribe(forms => {
        if( !forms || forms.length == 0 ) {
          Swal.fire('Invalid Configuration', 'Link provided was invalid. Registration cannot proceed', 'error').then(() => {
            this.router.navigate(['/']);
          });
          return;
        }

        this.registrationFormConfig = new OrganisationRegistrationForm(forms[0]);
        console.log(this.registrationFormConfig.decoded_custom_fields);
        this.setupRegistrationForm();
      });

      this.subscriptions.push(sub2);
    });

    this.subscriptions.push(sub);
  }

  loadOrganisation() {
    const slug = this.route.snapshot.paramMap.get('org_slug');
    const sub = this.organisationService.getAll({ slug }).subscribe(organisations => {
      this.organisation = new Organisation(organisations[0]);
      this.setupRegistrationForm();
    });

    this.subscriptions.push(sub);
  }

  loadRegistrationFormDefinition() {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    const sub = this.registrationFormService.getAll({ uuid }).subscribe(forms => {
      this.registrationFormConfig = new OrganisationRegistrationForm(forms[0]);
      this.setupRegistrationForm();
    });

    this.subscriptions.push(sub);
  }

  getSuccessPageRoute() {
    return ['/', this.organisation?.slug, 'register', this.registrationFormConfig?.uuid, 'success'];
  }

  setupRegistrationForm() {
    this.membershipForm = new FormGroup({
      organisation_registration_form_id: new FormControl(this.registrationFormConfig?.id, Validators.required),
      organisation_member_category_id: new FormControl(this.registrationFormConfig?.organisation_member_category_id),
      organisation_id: new FormControl(this.organisation?.id, Validators.required),
      member_id: new FormControl(''),
      approved: new FormControl(0),
      custom_attributes: new FormGroup({}),
      source: new FormControl('registration')
    });

    this.registrationFormConfig?.decoded_custom_fields.forEach(field => {
      const control = new FormControl('');

      if( field.required ) {
        control.addValidators([Validators.required]);
      }

      (this.membershipForm.controls.custom_attributes as FormGroup).addControl(field.name, control);
    });

    this.profileForm = new FormGroup({
      title: new FormControl(),
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      middle_name: new FormControl(''),
      mobile_number: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]),
      dob: new FormControl(''),
      gender: new FormControl(''),
      occupation: new FormControl(),
      business_name: new FormControl(),
      email: new FormControl('', [Validators.email]),
      active: new FormControl(1)
    });

    if( !this.registrationFormConfig?.excludesGender() ) {
      this.profileForm.controls.gender.addValidators([Validators.required]);
    }

    if( !this.registrationFormConfig?.excludesEmail() ) {
      this.profileForm.controls.email.addValidators([Validators.required]);
    }

    this.accountForm = new FormGroup({
      create_account: new FormControl( !this.registrationFormConfig?.excludesEmail() ),
      member_id: new FormControl('', [Validators.required]),
      username: new FormControl('', Validators.required),
      password: new FormControl(this.makeRandom(20))
    });
  }

  makeRandom(lengthOfCode: number, possible: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,./;'[]\=-)(*&^%$#@!~`") {
    let text = "";
    for (let i = 0; i < lengthOfCode; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
      return text;
  }

  onSubmit(e) {
    e.preventDefault();

    if (this.profileForm.invalid || this.membershipForm.invalid) {
      return;
    }

    const params = this.profileForm.value;
    params.mobile_number = params.mobile_number.e164Number;

    const profile = new Member(params);

    Swal.fire(
      this.translate.instant('Registering Your Membership'),
      this.translate.instant('Registration in progress') + '.' + this.translate.instant('Please wait') + '...',
      'info'
    );
    Swal.showLoading();

    this.profileService.create(profile);
  }

  setupEvents() {
    this.events.on('Member:created', (member) => {
      this.membershipForm.patchValue({ member_id: member.id });

      if( this.accountForm.value.create_account ) {
        this.createAccount(member);
      } else {
        this.createMembership();
      }
    });

    this.events.on('OrganisationMember:created', (membership) => {
      Swal.close();
      this.router.navigate(['/', this.organisation.slug, 'register', 's', this.registrationFormConfig.slug, 'success']);
    });

    this.events.on('MemberAccount:created', (account) => {
      Swal.close();
      this.createMembership();
    });
  }

  removeEvents() {
    this.events.off('Member:created');
    this.events.off('OrganisationMember:created');
    this.events.off('MemberAccount:created');
  }

  createAccount(member) {
    Swal.fire('Creating Your Platform Account', 'Please wait', 'info');
    Swal.showLoading();

    this.accountForm.patchValue({
      member_id: member.id,
      username: member.email,
      mobile_number: member.mobile_number
    });

    const account = new MemberAccount(this.accountForm.value);

    this.accountService.create(account);
  }

  createMembership() {
    Swal.fire('Creating Your Membership', 'Please wait', 'info');
    Swal.showLoading();

    const membership = new OrganisationMember(this.membershipForm.value);
    const params = { contain: ['member.profile_photo', 'organisation_member_category'].join() };
    this.membershipService.create(membership, params);
  }
}

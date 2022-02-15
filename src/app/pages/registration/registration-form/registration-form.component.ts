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
  public tenantHeaders = {};

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

    const sub = this.organisationService.getBySlug(orgSlug).subscribe({
      next: (organisation) => {
        this.organisation = organisation;
        this.organisationService.setSelectedModel(this.organisation);

        this.tenantHeaders = {
          'X-Tenant-Id': organisation.uuid
        };

        const sub2 = this.registrationFormService.getBySlugs(this.organisation.slug, slug, {}, this.tenantHeaders).subscribe(form => {
          this.configurationRegistrationForm(form);
        });

        this.subscriptions.push(sub2);
      },

      error: (err) => {
        Swal.fire('Invalid Configuration', 'Link provided was invalid. Registration cannot proceed', 'error').then(() => {
          this.router.navigate(['/']);
        });
      }
    });

    this.subscriptions.push(sub);
  }

  loadOrganisation() {
    const slug = this.route.snapshot.paramMap.get('org_slug');
    const sub = this.organisationService.getAll({ slug }).subscribe(organisations => {
      this.organisation = new Organisation(organisations[0]);
      this.organisationService.setSelectedModel(this.organisation);
      this.setupRegistrationForm();
    });

    this.subscriptions.push(sub);
  }

  loadRegistrationFormDefinition() {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    const sub = this.registrationFormService.getAll({ uuid }).subscribe(forms => {
      if( !forms || forms.length == 0 ) {
        Swal.fire('Invalid Configuration', 'Link provided was invalid. Registration cannot proceed', 'error').then(() => {
          this.router.navigate(['/']);
        });
        return;
      }

      this.configurationRegistrationForm(forms[0]);
    });

    this.subscriptions.push(sub);
  }

  configurationRegistrationForm(form: OrganisationRegistrationForm) {
    this.registrationFormConfig = new OrganisationRegistrationForm(form);
    this.registrationFormService.setSelectedModel(this.registrationFormConfig);

    if( this.registrationFormConfig.isClosed ) {
      Swal.fire(
        this.translate.instant('Registration Closed'),
        this.translate.instant('Registration for with this form is currently closed'),
        'warning'
      ).then(() => {
        this.router.navigate(['/']);
      });
      return;
    }

    this.setupRegistrationForm();
  }

  getSuccessPageRoute(membership) {
    return ['/', this.organisation?.slug, 'register', this.registrationFormConfig?.slug, 'success', membership.id];
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
      agree_to_terms: new FormControl(false, Validators.required),
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

    this.profileService.post(`/organisations/${this.organisation.slug}/members`, profile, {}, this.tenantHeaders)
      .subscribe({
        next: (result) => {
          const member = new Member(result['data']);
          this.profileService.setSelectedModel(member);
          this.membershipForm.patchValue({ member_id: member.id });

          if( this.accountForm.value.create_account ) {
            this.createAccount(member);
          } else {
            this.createMembership();
          }
        },
        error: () => {
          Swal.fire(this.translate.instant('Registration Failed'), this.translate.instant('Try again or contact support'), 'error');
        }
      });
  }

  setupEvents() {
    // TODO
  }

  removeEvents() {
    // TODO
  }

  createAccount(member) {
    Swal.fire( this.translate.instant('Creating Your Platform Account'), this.translate.instant('Please wait'), 'info');
    Swal.showLoading();

    this.accountForm.patchValue({
      member_id: member.id,
      username: member.email,
      mobile_number: member.mobile_number
    });

    let account = new MemberAccount(this.accountForm.value);

    this.accountService.post(`/organisations/${this.organisation.slug}/member_accounts`, account, {}, this.tenantHeaders)
      .subscribe({
        next: (response) => {
          Swal.close();
          this.accountService.setSelectedModel( new MemberAccount(response['data']) );
          this.createMembership();
        },
        error: () => {
          Swal.fire(
            this.translate.instant('Registration Failed'),
            this.translate.instant(`Could not your account for future access`),
            'error'
          );
        }
      });
  }

  createMembership() {
    Swal.fire( this.translate.instant('Creating Your Membership'), this.translate.instant('Please wait'), 'info');
    Swal.showLoading();

    let membership = new OrganisationMember(this.membershipForm.value);
    const params = { contain: ['member.profile_photo', 'organisation_member_category'].join() };

    this.membershipService.post(`/organisations/${this.organisation.slug}/organisation_members`, membership, params, this.tenantHeaders)
      .subscribe({
        next: (response) => {
          Swal.close();

          membership = new OrganisationMember(response['data']);
          this.membershipService.setSelectedModel(membership);
          this.router.navigate(['/', this.organisation.slug, 'register', this.registrationFormConfig.slug, 'success', membership.id]);
        },
        error: () => {
          Swal.fire(
            this.translate.instant('Registration Failed'),
            this.translate.instant('Could not create your membership with :orgname', { orgname: this.organisation.name }),
            'error'
          );
        }
      })
  }

  canShare() {
    return typeof navigator['canShare'] != 'undefined';
  }

  async shareForm() {
    const shareData = {
      title: this.registrationFormConfig.name + ' Membership Registration',
      text: 'Register with ' + this.organisation.name,
      url: window.location.href
    }

    try {
      await navigator.share(shareData);
      Swal.fire('Form shared successfully', '', 'info');
    } catch(err) {
      Swal.fire('Form share failed: ' + err, '', 'error');
    }
  }

  cancel() {
    this.router.navigate(['/', this.organisation.slug]);
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Member } from '../../../model/api/member';
import { OrganisationMember } from '../../../model/api/organisation-member';
import { OrganisationMemberCategory } from '../../../model/api/organisation-member-category';
import { MemberService } from '../../../services/api/member.service';
import { OrganisationMemberCategoryService } from '../../../services/api/organisation-member-category.service';
import { OrganisationMemberService } from '../../../services/api/organisation-member.service';
import { OrganisationService } from '../../../services/api/organisation.service';
import { EventsService } from '../../../services/events.service';

@Component({
  selector: 'app-profile-editor',
  templateUrl: './profile-editor.component.html',
  styleUrls: ['./profile-editor.component.scss']
})
export class ProfileEditorComponent implements OnInit, OnDestroy {

  public categories: OrganisationMemberCategory[];
  public profileForm: UntypedFormGroup;
  public membershipForm: UntypedFormGroup;

  public mbshp: OrganisationMember;
  public subscriptions: Subscription[] = [];
  public editorTitle = 'Add New Member Profile';
  public editorIcon = 'fa-user-plus';

  constructor(
    public categoryService: OrganisationMemberCategoryService,
    public organisationService: OrganisationService,
    public profileService: MemberService,
    public membershipService: OrganisationMemberService,
    public events: EventsService,
    public router: Router,
    public route: ActivatedRoute,
    public $t: TranslateService
  ) { }

  ngOnInit() {
    this.setupEditorForm();
    this.setupEvents();
    this.fetchMemberCategories();

    if ( this.membershipService.editing ) {
      this.editorTitle = this.$t.instant('Edit Member Profile');
      this.editorIcon = 'fa-pencil';
      this.loadProfile();
    } else {
      this.editorTitle = this.$t.instant('Add New Member Profile');
      this.editorIcon = 'fa-user-plus';
    }
  }

  ngOnDestroy() {
    this.removeEvents();
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  set membership(value) {
    this.mbshp = value;

    if (value) {
      this.membershipForm.patchValue(this.membership);
      this.membershipForm.controls.organisation_no.enable();
      this.profileForm.patchValue(this.membership.member);
    }
  }

  get membership() {
    return this.mbshp;
  }

  loadProfile() {

    this.membership = this.membershipService.getSelectedModel();

      // if (!this.membership) {
      //   const ps = this.membershipService.getProfile(membershipId).subscribe((profile: OrganisationMember) => {
      //     this.membership = profile;
      //   });

      //   this.subscriptions.push(ps);
      // }
  }

  /**
   * Loads the list of member categories to display on the form
   */
  fetchMemberCategories() {
    this.categoryService.getAll({
      active: 1,
      limit: '100',
      sort: 'default:desc,name:asc'
    }).subscribe((categories: OrganisationMemberCategory[]) => {
      this.categories = categories;
    });
  }

  setupEditorForm() {
    const activeOrganisation = this.organisationService.getActiveOrganisation();

    this.membershipForm = new UntypedFormGroup({
      id: new UntypedFormControl(),
      organisation_id: new UntypedFormControl(activeOrganisation.id),
      member_id: new UntypedFormControl(),
      organisation_no: new UntypedFormControl({ value: '', disabled: true }),
      organisation_member_category_id: new UntypedFormControl('', [Validators.required]),
      active: new UntypedFormControl(1),
      approved: new UntypedFormControl(1)
    });

    this.profileForm = new UntypedFormGroup({
      id: new UntypedFormControl(),
      title: new UntypedFormControl(),
      first_name: new UntypedFormControl('', [Validators.required]),
      last_name: new UntypedFormControl('', [Validators.required]),
      gender: new UntypedFormControl('', [Validators.required]),
      middle_name: new UntypedFormControl(''),
      dob: new UntypedFormControl(''),
      marital_status: new UntypedFormControl(''),
      occupation: new UntypedFormControl(),
      business_name: new UntypedFormControl(),
      nationality: new UntypedFormControl(''),
      place_of_birth: new UntypedFormControl(''),
      email: new UntypedFormControl('', [Validators.email]),
      mobile_number: new UntypedFormControl(''),
      active: new UntypedFormControl(1)
    });
  }

  onSubmit(e: Event) {
    e.preventDefault();

    if (this.profileForm.invalid || this.membershipForm.invalid) {
      return;
    }

    const profile = new Member(this.profileForm.value);
    const membership = new OrganisationMember(this.membershipForm.value);
    const params = { contain: ['member.profile_photo', 'organisation_member_category'].join() };

    if (membership.id) {
      Swal.fire(
        this.$t.instant('Saving Changes'),
        this.$t.instant('Saving Membership Changes') + '.' + this.$t.instant('Please wait') + '...',
        'info'
      );
      Swal.showLoading();

      this.profileService.update(profile);
      this.membershipService.update(membership, params);
      return;
    }

    Swal.fire(
      this.$t.instant('Creating New Membership'),
      this.$t.instant('Creating Membership') + '.' + this.$t.instant('Please wait') + '...',
      'info'
    );
    Swal.showLoading();

    this.profileService.create(profile);
  }

  setupEvents() {
    this.events.on('Member:created', (member) => {
      this.membershipForm.patchValue({ member_id: member.id });
      const membership = new OrganisationMember(this.membershipForm.value);
      const params = { contain: ['member.profile_photo', 'organisation_member_category'].join() };
      this.membershipService.create(membership, params);
    });

    this.events.on('OrganisationMember:created', (membership) => {
      Swal.close();
      this.membershipService.setEditing(false);
      this.membershipService.setSelectedModel(membership);
    });

    this.events.on('OrganisationMember:updated', (membership) => {
      Swal.close();
      this.membershipService.setEditing(false);
      this.membershipService.setSelectedModel(membership);
    });
  }

  removeEvents() {
    this.events.off('Member:created');
    this.events.off('OrganisationMember:created');
    this.events.off('OrganisationMember:updated');
  }

  cancel() {
    const action = this.membership ? 'Update' : 'Creation';
    Swal.fire({
      title: this.$t.instant(`Cancel Membership ${action}?`),
      text: this.$t.instant(`This action will cancel the membership creation / update and any changes made will be lost`)
        + '.' + this.$t.instant(`Are you sure you want to continue?`),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.$t.instant('Yes'),
      cancelButtonText: this.$t.instant('No'),
      cancelButtonColor: '#933'
    }).then((confirmAction) => {
      if (confirmAction.value) {
        this.membershipService.setEditing(false);
      }
    });
  }
}

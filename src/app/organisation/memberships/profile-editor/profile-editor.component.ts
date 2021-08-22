import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OrganisationMemberService } from '../../../shared/services/api/organisation-member.service';
import { Member } from '../../../shared/model/api/member';
import { OrganisationMember } from '../../../shared/model/api/organisation-member';
import { MemberService } from '../../../shared/services/api/member.service';
import { OrganisationService } from '../../../shared/services/api/organisation.service';
import { EventsService } from '../../../shared/services/events.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { OrganisationMemberCategory } from '../../../shared/model/api/organisation-member-category';
import { OrganisationMemberCategoryService } from '../../../shared/services/api/organisation-member-category.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profile-editor',
  templateUrl: './profile-editor.component.html',
  styleUrls: ['./profile-editor.component.scss']
})
export class ProfileEditorComponent implements OnInit, OnDestroy {

  public categories: OrganisationMemberCategory[];
  public profileForm: FormGroup;
  public membershipForm: FormGroup;

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

    if ( this.route.snapshot.data.editMode ) {
      this.editorTitle = 'Edit Member Profile';
      this.editorIcon = 'fa-pencil';
      this.loadProfile();
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

    const sub = this.route.params.subscribe(params => {
      const membershipId = params.id; // (+) converts string 'id' to a number

      // check if a memberhsip id was passed, if not clear any existing membership information
      // so we can create a new member
      if (!membershipId) {
        this.membershipService.clearSelectedModel();
        return;
      }

      this.membership = this.membershipService.getSelectedModel();

      if (!this.membership) {
        const ps = this.membershipService.getProfile(membershipId).subscribe((profile: OrganisationMember) => {
          this.membership = profile;
        });

        this.subscriptions.push(ps);
      }

    });

    this.subscriptions.push(sub);
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

    this.membershipForm = new FormGroup({
      id: new FormControl(),
      organisation_id: new FormControl(activeOrganisation.id),
      member_id: new FormControl(),
      organisation_no: new FormControl({ value: '', disabled: true }),
      organisation_member_category_id: new FormControl('', [Validators.required]),
      active: new FormControl(1),
      approved: new FormControl(1)
    });

    this.profileForm = new FormGroup({
      id: new FormControl(),
      title: new FormControl(),
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      middle_name: new FormControl(''),
      dob: new FormControl(''),
      gender: new FormControl('', [Validators.required]),
      occupation: new FormControl(),
      business_name: new FormControl(),
      email: new FormControl('', [Validators.email]),
      mobile_number: new FormControl(''),
      active: new FormControl(1)
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
      this.router.navigate(['/organisation/memberships/view', membership.id]);
    });

    this.events.on('OrganisationMember:updated', (membership) => {
      Swal.close();
      this.router.navigate(['/organisation/memberships/view', membership.id]);
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
        if (this.membership) {
          this.router.navigate(['/organisation/memberships/view', this.membership.id]);
        } else {
          this.router.navigate(['/organisation/memberships/profiles']);
        }
      }
    });
  }
}

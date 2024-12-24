import { Component, OnInit, AfterViewInit, OnDestroy, viewChild } from '@angular/core';
import { OrganisationMember } from '../../../shared/model/api/organisation-member';
import { OrganisationMemberCategory } from '../../../shared/model/api/organisation-member-category';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { OrganisationMemberService } from '../../../shared/services/api/organisation-member.service';
import { OrganisationMemberCategoryService } from '../../../shared/services/api/organisation-member-category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbDropdownConfig, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { EventsService } from '../../../shared/services/events.service';
import { StorageService } from '../../../shared/services/storage.service';
import Swal from 'sweetalert2';
import { PageEvent, PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

import { ViewProfileDirective } from '../../../shared/directives/view-profile.directive';

@Component({
    selector: 'app-pending-approvals',
    templateUrl: './pending-approvals.component.html',
    styleUrls: ['./pending-approvals.component.scss'],
    imports: [NgbDropdownModule, ViewProfileDirective, PaginationComponent, TranslateModule]
})
export class PendingApprovalsComponent implements OnInit, AfterViewInit, OnDestroy {

  readonly searchModal = viewChild<any>('searchModal');

  public members: OrganisationMember[] = [];
  public categories: OrganisationMemberCategory[];
  public searchForm: UntypedFormGroup;
  public allSelected = false;
  public registrationFormId: number;

  constructor(
    public membershipService: OrganisationMemberService,
    public categoryService: OrganisationMemberCategoryService,
    public router: Router,
    public route: ActivatedRoute,
    public modalService: NgbModal,
    public dropdownConfig: NgbDropdownConfig,
    public events: EventsService,
    public storage: StorageService,
    public $t: TranslateService
  ) {
    dropdownConfig.placement = 'bottom';
    dropdownConfig.autoClose = true;
  }

  ngOnInit() {
    this.fetchRegistrationFormId();
    this.fetchMemberCategories();
    this.setupSearchForm();
    this.setupEvents();
  }

  ngAfterViewInit() {
    this.loadMemberships();
  }

  ngOnDestroy() {
    this.removeEvents();
    this.events.trigger("close:membership:flyout");
  }

  fetchRegistrationFormId() {
    this.registrationFormId = +(this.route.snapshot.paramMap.get('id') as string);
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

  /**
   * Loads the list of members from the backend
   *
   * @param page Page number
   * @param limit Total records to load
   */
  loadMemberships(page = 1, limit = 15) {
    this.members = [];

    const options = { page, limit, registration_form_id: this.registrationFormId };

    this.membershipService.unapproved(options).subscribe((members: OrganisationMember[]) => {
      this.members = members;
      this.allSelected = false;
    });
  }

  /**
   * Returns true if data has been loaded from the search
   */
  dataAvailable() {
    return this.members && this.members.length > 0;
  }

  /**
   * Returns true if no data is available
   */
  emptyDataset() {
    return this.members && this.members.length === 0;
  }

  /**
   * Sets the member profile to view and navigates to the details page
   *
   * @param profile OrganisationMember
   */
  viewProfile(profile: OrganisationMember) {
    this.membershipService.setSelectedModel(profile);
    this.events.trigger('open:membership:flyout', profile);
  }

  /**
   * Sets the member profile to edit and navigates to the editor page
   */
  editProfile(profile: OrganisationMember) {
    this.membershipService.setSelectedModel(profile);
    this.router.navigate(['/organisation/memberships/edit', profile.id]);
  }

  /**
   * Sets up the search form group and validations
   */
  setupSearchForm() {
    this.searchForm = new UntypedFormGroup({
      organisation_member_category_id: new UntypedFormControl(''),
      organisation_no: new UntypedFormControl(''),
      first_name_like: new UntypedFormControl(),
      last_name_like: new UntypedFormControl(),
      email_like: new UntypedFormControl(),
      mobile_number_like: new UntypedFormControl()
    });
  }

  /**
   * Setup listeners for model changes
   */
  setupEvents() {
    this.events.on('OrganisationMember:updated', (profile) => {
      Swal.close();
      this.members.forEach((g, index) => {
        if (g.id === profile.id) {
          this.members[index] = profile;
          return false;
        }
      });
    });

    this.events.on('OrganisationMember:deleted', (profile) => {
      Swal.close();
      this.members.forEach((g, index) => {
        if (g.id === profile.id) {
          this.members.splice(index, 1);
          return false;
        }
      });
    });
  }

  /**
   * Remove listeners waiting on model changes
   */
  removeEvents() {
    this.events.off('OrganisationMember:updated');
    this.events.off('OrganisationMember:deleted');
  }

  /**
   * Handles the pagination events
   *
   * @param event PageEvent
   */
  onPaginate(event: PageEvent) {
    this.loadMemberships(event.page, event.limit);
  }

  /**
   * Toggles the selected state of members on the list
   */
  toggleAllSelected() {
    this.allSelected = !this.allSelected;
    this.members.forEach(profile => profile.selected = this.allSelected);
  }

  toggleSelected(profile: OrganisationMember) {
    profile.selected = !profile.selected;
  }

  /**
   * Returns are list of members selected from the list
   */
  getSelectedMembers(): OrganisationMember[] {
    return this.members.filter(profile => profile.selected);
  }

  /**
   * Returns true f any item in the HTML list is selected
   */
  itemSelected(): boolean {
    return this.members && this.members.some(profile => profile.selected);
  }

  /**
   * Batch approve a select list of member records
   */
  approveSelected() {
    Swal.fire({
      title: this.$t.instant('Confirm Approval'),
      text: this.$t.instant('This action will approve the selected members assign them membership numbers as necessary'),
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#d33'
    }).then((action) => {
      if (action.value) {
        Swal.fire(
          this.$t.instant('Approving Selected Profiles'),
          this.$t.instant('Please wait') + '...',
          'warning'
        );
        Swal.showLoading();

        const selected = this.getSelectedMembers().map(profile => {
          profile.approved = 1;
          profile.active = 1;
          return profile;
        });

        this.membershipService.batchUpdate(selected);
      }
    });
  }

  /**
   * Batch reject a select list of member records
   */
  rejectSelected() {
    Swal.fire({
      title: this.$t.instant('Confirm Rejection'),
      text: this.$t.instant('This action will reject the registration of the selected members'),
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#d33'
    }).then((action) => {
      if (action.value) {
        Swal.fire(
          this.$t.instant('Rejected Selected Registrations'),
          this.$t.instant('Please wait') + "...",
          'warning'
        );
        Swal.showLoading();

        const selected = this.getSelectedMembers().map(profile => {
          profile.approved = 0;
          profile.active = 0;
          return profile;
        });

        this.membershipService.batchUpdate(selected);
      }
    });
  }

}

import { Component, OnInit, AfterViewInit, OnDestroy, viewChild } from '@angular/core';
import { OrganisationMemberService } from '../../../shared/services/api/organisation-member.service';
import { OrganisationMember } from '../../../shared/model/api/organisation-member';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbDropdownConfig, NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormGroup, UntypedFormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrganisationMemberCategoryService } from '../../../shared/services/api/organisation-member-category.service';
import { OrganisationMemberCategory } from '../../../shared/model/api/organisation-member-category';
import { PageEvent, PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { EventsService } from '../../../shared/services/events.service';
import Swal from 'sweetalert2';
import { StorageService } from '../../../shared/services/storage.service';
import { Subscription } from 'rxjs';
import { OrganisationGroupTypeService } from '../../../shared/services/api/organisation-group-type.service';
import { OrganisationAnniversaryService } from '../../../shared/services/api/organisation-anniversary.service';
import { ExcelService } from '../../../shared/services/excel.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { PrintService } from '../../../shared/services/print.service';
import { OrganisationGroupType } from '../../../shared/model/api/organisation-group-type';
import moment from 'moment';
import { NgClass, CurrencyPipe, DatePipe } from '@angular/common';
import { PrintContentDirective } from '../../../shared/directives/print-content.directive';
import { MembershipCardComponent } from '../../../shared/components/profile-view/membership-card/membership-card.component';
import { ProfileImageComponent } from '../../../shared/components/profile-view/profile-image/profile-image.component';

@Component({
    selector: 'app-profiles',
    templateUrl: './profiles.component.html',
    styleUrls: ['./profiles.component.scss'],
    providers: [NgbDropdownConfig],
    imports: [NgbDropdownModule, NgClass, PrintContentDirective, MembershipCardComponent, ProfileImageComponent, NgbTooltipModule, PaginationComponent, FormsModule, ReactiveFormsModule, CurrencyPipe, DatePipe, TranslateModule]
})
export class ProfilesComponent implements OnInit, AfterViewInit, OnDestroy {

  readonly searchModal = viewChild<any>('searchModal');
  readonly changeCategoryModal = viewChild<any>('changeCategoryModal');

  public members: OrganisationMember[] = [];
  public categories: OrganisationMemberCategory[];
  public searchForm: UntypedFormGroup;
  public changeCategoryForm: UntypedFormGroup;
  public allSelected = false;
  public showCards = false;

  public cacheDataKey = 'searched_members';
  public cachePagingKey = 'searched_members_paging';
  public cacheOptionsKey = 'searched_members_options';
  public cacheAdvancedToggleKey = 'searched_members_advanced';

  public subscriptions: Subscription[] = [];

  public showAdvanced = false;
  public selectedGroupType?: OrganisationGroupType;

  constructor(
    public organisationMemberService: OrganisationMemberService,
    public categoryService: OrganisationMemberCategoryService,
    public router: Router,
    public modalService: NgbModal,
    public dropdownConfig: NgbDropdownConfig,
    public events: EventsService,
    public storage: StorageService,
    public groupTypeService: OrganisationGroupTypeService,
    public anniversaryService: OrganisationAnniversaryService,
    public excelService: ExcelService,
    public translate: TranslateService,
    public printService: PrintService,
    public route: ActivatedRoute
  ) {
    dropdownConfig.placement = 'bottom';
    dropdownConfig.autoClose = true;
  }

  ngOnInit() {
    this.fetchMemberCategories();
    this.setupSearchForm();
    this.setupChangeCategoryForm();
    this.setupEvents();
    this.fetchGroupTypes();
    this.fetchAnniversaryTypes();

    if (this.route.snapshot.data['printing']) {
      this.loadMemberships(this.printService.params);
    }
  }

  ngAfterViewInit() {
    if (this.storage.isValid(this.cacheDataKey)) {
      setTimeout(() => this.loadDataFromCache())
    } else {
      this.showSearchModal();
    }
  }

  ngOnDestroy() {
    this.removeEvents();
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  /**
   * Loads the list of member categories to display on the form
   */
  fetchMemberCategories() {
    const sub = this.categoryService.getAll({
      active: 1, limit: '100', sort: 'default:desc,name:asc'
    }).subscribe((categories: OrganisationMemberCategory[]) => {
      this.categories = categories;
    });

    this.subscriptions.push(sub);
  }

  /**
   * Load all available groups
   */
  fetchGroupTypes() {
    const sub = this.groupTypeService.getAll({
      contain: ['organisation_groups'].join(),
      limit: 100
    }).subscribe(() => {
      if (this.searchForm.value.organisation_group_type_id) {
        this.setSelectedGroupType(this.searchForm.value.organisation_group_type_id);
      }
    });

    this.subscriptions.push(sub);
  }

  fetchAnniversaryTypes() {
    const sub = this.anniversaryService.getAll({ limit: 100 }).subscribe();
    this.subscriptions.push(sub);
  }

  loadDataFromCache() {
    this.members = this.storage.get(this.cacheDataKey).map(data => new OrganisationMember(data));
    this.organisationMemberService.pagination.next(this.storage.get(this.cachePagingKey));
    this.searchForm.patchValue(this.storage.get(this.cacheOptionsKey));
    this.showAdvanced = this.storage.get(this.cacheAdvancedToggleKey);
  }

  clearCacheData() {
    this.storage.remove(this.cacheDataKey);
    this.storage.remove(this.cachePagingKey);
    this.storage.remove(this.cacheOptionsKey);
    this.storage.remove(this.cacheAdvancedToggleKey);
  }

  storeCacheData() {
    const duration = 10;
    const unit = 'minutes';
    this.storage.set(this.cacheDataKey, this.members, duration, unit);
    this.storage.set(this.cacheOptionsKey, this.searchForm.value, duration, unit);
    this.storage.set(this.cachePagingKey, this.organisationMemberService.pagingMeta, duration, unit);
    this.storage.set(this.cacheAdvancedToggleKey, this.showAdvanced, duration, unit);
  }

  /**
   * Loads the list of members from the backend
   *
   * @param options Configuration options
   * @param page Page number
   * @param limit Total records to load
   */
  loadMemberships(options: object, page = 1, limit = 15) {
    this.members = [];
    this.clearCacheData();

    const sub = this.organisationMemberService.findMembers(options, page, limit).subscribe((members: OrganisationMember[]) => {
      this.members = members;
      this.storeCacheData();
      this.allSelected = false;
    });

    this.subscriptions.push(sub);
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
    this.organisationMemberService.setSelectedModel(profile);
    this.router.navigate(['/organisation/memberships/view', profile.id]);
  }

  /**
   * Sets the member profile to edit and navigates to the editor page
   */
  editProfile(profile: OrganisationMember) {
    this.organisationMemberService.setSelectedModel(profile);
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
      mobile_number_like: new UntypedFormControl(),
      created_gte: new UntypedFormControl(),
      created_lte: new UntypedFormControl(),

      // advanced options
      dob_gte: new UntypedFormControl(''),
      dob_lte: new UntypedFormControl(''),
      gender: new UntypedFormControl(''),
      marital_status: new UntypedFormControl(''),
      dayname: new UntypedFormControl(''),
      monthname: new UntypedFormControl(''),
      age_gte: new UntypedFormControl('', [Validators.min(0), Validators.max(150)]),
      age_lte: new UntypedFormControl('', [Validators.min(0), Validators.max(150)]),
      occupation_like: new UntypedFormControl(''),
      business_name_like: new UntypedFormControl(''),
      organisation_group_type_id: new UntypedFormControl(''),
      organisation_group_id: new UntypedFormControl(''),
      organisation_anniversary_id: new UntypedFormControl(''),
      anniversary_start_date: new UntypedFormControl(''),
      anniversary_end_date: new UntypedFormControl('')
    });

    this.searchForm.valueChanges.subscribe(values => {
      this.setSelectedGroupType(values.organisation_group_type_id);
    });
  }

  /**
   * Setup listeners for model changes
   */
  setupEvents() {
    this.events.on('switching_organisation', () => this.clearCacheData());
    this.events.on('OrganisationMember:deleted', () => Swal.close());
  }

  /**
   * Remove listeners waiting on model changes
   */
  removeEvents() {
    this.events.off('switching_organisation');
    this.events.off('OrganisationMember:updated');
    this.events.off('OrganisationMember:deleted');
  }

  /**
   * Shows the search modal
   */
  showSearchModal() {
    this.modalService.open(this.searchModal(), { size: 'lg' });
  }

  /**
   * Handles the searching functionality
   *
   * @param e Event
   */
  onSearch(e: Event) {
    e.preventDefault();

    const data = this.searchForm.value;

    this.loadMemberships(data);
    this.modalService.dismissAll();
  }

  /**
   * Handles the pagination events
   *
   * @param event PageEvent
   */
  onPaginate(event: PageEvent) {
    this.loadMemberships(this.searchForm.value, event.page, event.limit);
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
   * Batch delete a select list of member records
   */
  deleteSelected() {
    Swal.fire({
      title: this.translate.instant('Confirm Deletion'),
      text: this.translate.instant('This action will delete the selected members from the database and currently cannot be reverted'),
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#d33'
    }).then((action) => {
      if (action.value) {
        Swal.fire(
          this.translate.instant('Deleting Selected Profiles'),
          this.translate.instant('Please wait') + ' ...',
          'warning'
        );
        Swal.showLoading();

        const selected = this.getSelectedMembers();

        this.organisationMemberService.batchDelete(selected);
      }
    });
  }

  /**
   * Batch delete a select list of member records
   */
  deleteProfile(profile: OrganisationMember) {
    Swal.fire({
      title: this.translate.instant('Confirm Deletion'),
      text: this.translate.instant('This action will delete this member from the database. This action currently cannot be reverted'),
      icon: 'warning',
      showCancelButton: true,
    }).then((action) => {
      if (action.value) {
        Swal.fire(
          this.translate.instant('Deleting Profile'),
          this.translate.instant('Please wait') + ' ...',
          'info'
        );
        Swal.showLoading();
        this.organisationMemberService.remove(profile);
      }
    });
  }

  setupChangeCategoryForm() {
    this.changeCategoryForm = new UntypedFormGroup({
      organisation_member_category_id: new UntypedFormControl('', [Validators.required])
    });
  }

  onChangeCategory(e: Event) {
    e.preventDefault();

    Swal.fire({
      title: this.translate.instant('Confirm Category Change'),
      text: this.translate.instant('This action will change the membership category of the selected members. Are you sure you want to continue?'),
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No'
    }).then((action) => {
      if (action.value) {
        const data = this.changeCategoryForm.value;
        const selected = this.getSelectedMembers().map(profile => Object.assign(profile, data));

        this.organisationMemberService.batchUpdate(selected, { contain: ['member', 'organisation_member_category'].join() });
        this.changeCategoryForm.reset();
        this.modalService.dismissAll();
      }
    });
  }

  /**
   * Shows the change category modal
   */
  showChangeCategoryModal() {
    this.modalService.open(this.changeCategoryModal(), {});
  }

  toggleAdvanced() {
    this.showAdvanced = !this.showAdvanced;
  }

  setSelectedGroupType(groupTypeId) {
    // tslint:disable-next-line: triple-equals
    this.selectedGroupType = this.groupTypeService.getItems().find(type => type.id == groupTypeId);
  }

  exportToExcel(type = "page"): void {

    if (type == 'page') {
      if (this.members.length == 0) {
        return;
      }

      return this.excelService.generateExcel(this.formatMembersDataForExport(this.members), 'members_data');

    }//end if page


    Swal.fire(
      this.translate.instant('Fetching all data'),
      this.translate.instant('Please wait as organisation data is being fetched') + '...',
      'info'
    );
    Swal.showLoading();

    const sub = this.organisationMemberService.findMembers(this.searchForm.value, 1, 99999).subscribe((members: OrganisationMember[]) => {
      this.excelService.generateExcel(this.formatMembersDataForExport(members), 'members_data');
      this.loadMemberships(this.searchForm.value);
    });

    this.subscriptions.push(sub);

  }


  formatMembersDataForExport(members: OrganisationMember[]) {
    return members.map((m) => {
      return {
        membership_no: m.organisation_no,
        name: m.member?.lastThenFirstName(),
        membership_category: m.organisation_member_category?.name,
        email: m.member?.email,
        phone_number: m.member?.mobile_number,
        date_of_birth: m.member?.dob,
        gender: m.member?.gender,
        marital_status: m.member?.marital_status,
        occupation: m.member?.occupation,
        place_of_work: m.member?.business_name,
        nationality: m.member?.nationality,
        last_attended_on: m.last_attendance?.created ? moment(m.last_attendance?.created).format('YYYY-MM-DD') : 'N/A',
        last_payment_date: m.last_contribution?.created ? moment(m.last_contribution?.created).format('YYYY-MM-DD') : 'N/A'
      }
    });
  }


  print(): void {
    this.printService.print({
      url: 'memberships/profiles',
      options: {
        title: "List Of Organisation Members Profiles"
      },
      params: Object.assign({}, this.searchForm.value, {
        limit: this.organisationMemberService.pagingMeta.total
      })
    });
  }

  public doPrinting() {
    if (this.route.snapshot.data['printing']) {
      this.printService.onDataReady();
    }
  }

}

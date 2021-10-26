import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { UserActivityService } from '../../../shared/services/api/user-activities.service';
import { Subscription } from 'rxjs';
import { UserActivity } from '../../../shared/model/api/user-activity';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl } from '@angular/forms';
import { EventsService } from '../../../shared/services/events.service';
import { PageEvent } from '../../../shared/components/pagination/pagination.component';
import { MemberAccount } from 'src/app/shared/model/api/member-account';
import { MemberAccountService } from 'src/app/shared/services/api/member-account.service';
import { StorageService } from '../../../shared/services/storage.service';
import { OrganisationAccountService } from '../../../shared/services/api/organisation-account.service';
import { OrganisationAccount } from '../../../shared/model/api/organisation-account';

@Component({
  selector: 'app-user-activities',
  templateUrl: './user-activities.component.html',
  styleUrls: ['./user-activities.component.scss'],
})
export class UserActivitiesComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('searchModal', { static: true }) searchModal: any;

  public activities: UserActivity[];
  public subscriptions: Subscription[] = [];
  public searchForm: FormGroup;
  public memberAccounts: MemberAccount[] = [];
  public orgAccounts: OrganisationAccount[] = [];
  public cacheDataKey = 'searched_activities';
  public cachePagingKey = 'searched_activities_paging';
  public cacheOptionsKey = 'searched_activities_options';
  public logGroups = [];

  constructor(
    public eventService: EventsService,
    public userActivitiesService: UserActivityService,
    public modalService: NgbModal,
    public memberAccountService: MemberAccountService,
    public orgAccountService: OrganisationAccountService,
    public events: EventsService,
    public storage: StorageService,
  ) { }

  ngOnInit(): void {
    this.getAdminAccounts();
    this.fetchLogGroups();
    this.setupSearchForm();
    this.setupEvents();
  }

  ngAfterViewInit() {
    if (this.storage.isValid(this.cacheDataKey)) {
      this.loadDataFromCache();
    } else {
      this.showSearchModal();
    }
  }

  getAdminAccounts() {
    this.orgAccountService.getAll({
      active: 1,
      limit: 100,
      contain: 'member'
    }).subscribe((orgAccounts: OrganisationAccount[]) => {
      this.orgAccounts = orgAccounts.sort((a, b) => a.name > b.name ? 1 : (a.name < b.name ? -1 : 0) );
    });
  }

  findActivities(options = {}, page = 1, limit = 15) {
    this.activities = null;

    const sub = this.userActivitiesService
      .findActivities(options, page, limit)
      .subscribe((activities) => {
        this.activities = activities;
      });

    this.subscriptions.push(sub);
  }

  fetchLogGroups() {
    const sub = this.userActivitiesService.getLogGroups().subscribe((groups: any[]) => {
      this.logGroups = groups.map(group => {
        // group.log_display_name = group.log_name.replace(/_/g, ' ');
        return group;
      });
    });

    this.subscriptions.push(sub);
  }

  /**
   * Setup listeners for model changes
   */
  setupEvents() {
    this.events.on('switching_organisation', () => this.clearCacheData());
  }

  clearCacheData() {
    this.storage.remove(this.cacheDataKey);
    this.storage.remove(this.cachePagingKey);
    this.storage.remove(this.cacheOptionsKey);
  }

  loadDataFromCache() {
    this.activities = this.storage.get(this.cacheDataKey).map(data => new UserActivity(data));
    this.events.trigger('UserActivity:paging', this.storage.get(this.cachePagingKey));
    this.searchForm.patchValue(this.storage.get(this.cacheOptionsKey));
  }

  storeCacheData() {
    const duration = 5;
    const unit = 'minutes';
    this.storage.set(this.cacheDataKey, this.activities, duration, unit);
    this.storage.set(this.cacheOptionsKey, this.searchForm.value, duration, unit);
    this.storage.set(this.cachePagingKey, this.userActivitiesService.pagingMeta, duration, unit);
  }

  recordsPresent() {
    return this.activities && this.activities.length > 0;
  }

  /**
   * Sets up the search form group and validations
   */
  setupSearchForm() {
    this.searchForm = new FormGroup({
      causer_id: new FormControl(''),
      log_name: new FormControl(''),
      created_at_gte: new FormControl(),
      created_at_lte: new FormControl()
    });
  }

  /**
   * Shows the search modal
   */
  showSearchModal() {
    this.modalService.open(this.searchModal, {});
  }

  /**
   * Handles the searching functionality
   *
   * @param e Event
   */
  onSearch(e: Event) {
    e.preventDefault();

    const data = this.searchForm.value;

    this.findActivities(data);
    this.modalService.dismissAll();
  }

  /**
   * Handles the pagination events
   *
   * @param event PageEvent
   */
  onPaginate(event: PageEvent) {
    this.findActivities(this.searchForm.value, event.page, event.limit);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.events.off('switching_organisation');
  }
}

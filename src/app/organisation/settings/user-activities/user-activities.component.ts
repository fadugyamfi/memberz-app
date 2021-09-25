import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { UserActivityService } from '../../../shared/services/api/user-activities.service';
import { Observable, Subscription, of } from 'rxjs';
import { UserActivity } from '../../../shared/model/api/user-activity';
import { map, debounceTime, distinctUntilChanged, tap, switchMap, catchError } from 'rxjs/operators';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EventsService } from '../../../shared/services/events.service';
import { PageEvent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-user-activities',
  templateUrl: './user-activities.component.html',
  styleUrls: ['./user-activities.component.scss']
})
export class UserActivitiesComponent implements OnInit, OnDestroy {

  @ViewChild('searchModal', { static: true }) searchModal: any;

  public activities: UserActivity[];
  public subscriptions: Subscription[] = [];
  public searchForm: FormGroup;

  constructor(public eventService: EventsService, public userActivitiesService: UserActivityService, public modalService: NgbModal) { }

  ngOnInit(): void {
    this.setupSearchForm();
    this.findActivities();
  }

  findActivities(options = {}, page = 1, limit = 15) {
    this.activities = null;

    const sub = this.userActivitiesService.findActivities(options, page, limit).subscribe(categories => {
      this.activities = categories;
    });

    this.subscriptions.push(sub);
  }

  recordsPresent() {
    return this.activities && this.activities.length > 0;
  }

  /**
   * Sets up the search form group and validations
   */
   setupSearchForm() {
    // this.searchForm = new FormGroup({
    //   name_like: new FormControl(''),
    // });
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
      this.subscriptions.forEach(sub => sub.unsubscribe());
    }

}

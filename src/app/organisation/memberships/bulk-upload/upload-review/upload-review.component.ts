import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PageEvent } from '../../../../shared/components/pagination/pagination.component';
import { OrganisationFileImport } from '../../../../shared/model/api/organisation-file-import';
import { OrganisationMember } from '../../../../shared/model/api/organisation-member';
import { OrganisationMemberImport } from '../../../../shared/model/api/organisation-Member-import';
import { OrganisationMemberImportService } from '../../../../shared/services/api/organisation-member-import.service';
import { EventsService } from '../../../../shared/services/events.service';

@Component({
  selector: 'app-upload-review',
  templateUrl: './upload-review.component.html',
  styleUrls: ['./upload-review.component.scss']
})
export class UploadReviewComponent implements OnInit, OnDestroy {

  public _organisationFileImport: OrganisationFileImport;
  private subscriptions: Subscription[] = [];

  @Output()
  public clear = new EventEmitter();

  constructor(
    public memberImportService: OrganisationMemberImportService,
    public router: Router,
    public events: EventsService
  ) { }

  ngOnInit(): void {
    this.fetchImportedMemberships();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  @Input()
  set organisationFileImport(value: OrganisationFileImport) {
    this._organisationFileImport = value;
  }

  get organisationFileImport(): OrganisationFileImport {
    return this._organisationFileImport;
  }

  exitReview() {
    this.clear.emit();
  }

  badgeClasses() {
    return {
      'bg-success': this.organisationFileImport.import_status == 'completed',
      'bg-warning': this.organisationFileImport.import_status == 'pending',
      'bg-danger': this.organisationFileImport.import_status == 'failed'
    };
  }

  fetchImportedMemberships(page = 1, limit = 100) {
    const sub = this.memberImportService.getAll({
      limit,
      page,
      organisation_file_import_id: this.organisationFileImport.id,
      contain: 'organisation_member.organisation_member_category'
    }).subscribe();

    this.subscriptions.push(sub);
  }

  /**
   * Handles the pagination events
   *
   * @param event PageEvent
   */
   onPaginate(event: PageEvent) {
    this.fetchImportedMemberships(event.page, event.limit);
  }

  /**
   * Sets the member profile to view and navigates to the details page
   *
   * @param profile OrganisationMember
   */
   viewProfile(profile: OrganisationMember) {
    // this.organisationMemberService.setSelectedModel(profile);
    this.router.navigate(['/organisation/memberships/view', profile.id]);
  }
}

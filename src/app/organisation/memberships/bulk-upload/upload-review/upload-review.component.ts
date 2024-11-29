import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { PageEvent, PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { OrganisationFileImport } from '../../../../shared/model/api/organisation-file-import';
import { OrganisationMember } from '../../../../shared/model/api/organisation-member';
import { OrganisationMemberImportService } from '../../../../shared/services/api/organisation-member-import.service';
import { EventsService } from '../../../../shared/services/events.service';

import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-upload-review',
    templateUrl: './upload-review.component.html',
    styleUrls: ['./upload-review.component.scss'],
    standalone: true,
    imports: [RouterLink, PaginationComponent, TranslateModule]
})
export class UploadReviewComponent implements OnInit, OnDestroy {

  public ofi: OrganisationFileImport;
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
    this.ofi = value;
  }

  get organisationFileImport(): OrganisationFileImport {
    return this.ofi;
  }

  exitReview() {
    this.clear.emit();
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
    this.router.navigate(['/organisation/memberships/view', profile.id]);
  }
}

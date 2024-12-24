import { Component, Input, OnDestroy, OnInit, output } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { PageEvent, PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { OrganisationGroup } from '../../../../shared/model/api/organisation-group';
import { OrganisationMemberGroup } from '../../../../shared/model/api/organisation-member-group';
import { OrganisationMemberGroupService } from '../../../../shared/services/api/organisation-member-group.service';
import { EventsService } from '../../../../shared/services/events.service';

import { LoadingRotateDashedComponent } from '../../../../shared/components/forms/loading-rotate-dashed/loading-rotate-dashed.component';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-group-members',
    templateUrl: './group-members.component.html',
    styleUrls: ['./group-members.component.scss'],
    imports: [LoadingRotateDashedComponent, RouterLink, PaginationComponent, TranslateModule]
})
export class GroupMembersComponent implements OnInit, OnDestroy {

  readonly back = output();
  private _group: OrganisationGroup;

  constructor(
    public groupMemberService: OrganisationMemberGroupService,
    public translate: TranslateService,
    public events: EventsService
  ) { }

  ngOnInit(): void {
    this.setupEvents();
  }

  ngOnDestroy(): void {
    this.removeEvents();
  }

  loadGroupMembers(page = 1, limit = 30) {
    this.groupMemberService.getAll({
      organisation_group_id: this.group.id,
      contain: ['organisationMember.member', 'organisationMember.organisationMemberCategory'].join(),
      page,
      limit
    }).subscribe();
  }

  goBack() {
    this.back.emit();
  }

  @Input()
  set group(value: OrganisationGroup) {
    this._group = value;
    if (value) {
      this.loadGroupMembers();
    }
  }

  get group(): OrganisationGroup {
    return this._group;
  }

  onPaginate(event: PageEvent) {
    this.loadGroupMembers(event.page, event.limit);
  }

  /**
   * Remove member from group
   */
  removeMember(groupMember: OrganisationMemberGroup) {
    Swal.fire({
      title: this.translate.instant('Confirm Removal'),
      text: this.translate.instant(`This action will remove member from group and cannot be reverted`),
      icon: 'warning',
      showCancelButton: true,
    }).then((action) => {
      if (action.value) {
        Swal.fire(
          this.translate.instant('Removing Member'),
          this.translate.instant('Please wait') + ' ...',
          'error'
        );
        Swal.showLoading();
        this.groupMemberService.remove(groupMember);
      }
    });
  }

  setupEvents() {
    this.events.on('OrganisationMemberGroup:deleted', () => Swal.close());
  }

  removeEvents() {
    this.events.off('OrganisationMemberGroup:deleted');
  }
}

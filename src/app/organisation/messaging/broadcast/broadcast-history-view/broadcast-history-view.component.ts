import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { PageEvent, PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { SmsBroadcast } from '../../../../shared/model/api/sms-broadcast';
import { SmsBroadcastService } from '../../../../shared/services/api/sms-broadcast.service';
import { EventsService } from '../../../../shared/services/events.service';
import { DatePipe } from '@angular/common';
import { LoadingRotateDashedComponent } from '../../../../shared/components/forms/loading-rotate-dashed/loading-rotate-dashed.component';
import { ViewProfileDirective } from '../../../../shared/directives/view-profile.directive';

@Component({
    selector: 'app-broadcast-history-view',
    templateUrl: './broadcast-history-view.component.html',
    styleUrls: ['./broadcast-history-view.component.scss'],
    standalone: true,
    imports: [LoadingRotateDashedComponent, ViewProfileDirective, PaginationComponent, DatePipe, TranslateModule]
})
export class BroadcastHistoryViewComponent implements OnInit, OnDestroy {

  public broadcasts: SmsBroadcast[];
  @Output() newBroadcast = new EventEmitter();
  @Output() editBroadcast = new EventEmitter();

  constructor(
    public smsBroadcastService: SmsBroadcastService,
    public translate: TranslateService,
    public events: EventsService
  ) { }

  ngOnInit(): void {
    this.fetchBroadcasts();

    this.events.on('SmsBroadcast:deleted', () => Swal.close());
  }

  ngOnDestroy() {
    this.events.off('SmsBroadcast:deleted');
  }

  fetchBroadcasts(page = 1, limit = 15) {
    const params = { page, limit, sort: 'id:desc' };

    this.smsBroadcastService.getAll(params).subscribe(broadcasts => {
      this.broadcasts = this.smsBroadcastService.getItems();
    });
  }

  showComposer() {
    this.newBroadcast.emit();
  }

  editSmsBroadcast(broadcast: SmsBroadcast) {
    this.editBroadcast.emit(broadcast);
  }

  onPaginate(event: PageEvent) {
    this.fetchBroadcasts(event.page, event.limit);
  }

  deleteBroadcast(broadcast: SmsBroadcast) {
    Swal.fire({
      title: 'Confirm Deletion',
      text: `This action will delete selected broadcast message from the database. This action currently cannot be reverted`,
      icon: 'warning',
      showCancelButton: true,
    }).then((action) => {
      if (action.value) {
        Swal.fire(
          this.translate.instant('Deleting Broadcast Message'),
          this.translate.instant('Please wait') + '...',
          'error'
        );
        Swal.showLoading();
        this.smsBroadcastService.remove(broadcast);
      }
    });
  }
}

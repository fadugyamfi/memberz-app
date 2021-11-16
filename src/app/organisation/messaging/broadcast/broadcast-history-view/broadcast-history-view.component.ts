import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PageEvent } from '../../../../shared/components/pagination/pagination.component';
import { SmsBroadcast } from '../../../../shared/model/api/sms-broadcast';
import { SmsBroadcastService } from '../../../../shared/services/api/sms-broadcast.service';

@Component({
  selector: 'app-broadcast-history-view',
  templateUrl: './broadcast-history-view.component.html',
  styleUrls: ['./broadcast-history-view.component.scss']
})
export class BroadcastHistoryViewComponent implements OnInit {

  public broadcasts;
  @Output() newBroadcast = new EventEmitter();

  constructor(
    public smsBroadcastService: SmsBroadcastService
  ) { }

  ngOnInit(): void {
    this.fetchBroadcasts();
  }

  fetchBroadcasts(page = 1, limit = 15) {
    const params = { page, limit, sort: 'id:desc' };

    this.smsBroadcastService.getAll(params).subscribe(broadcasts => {
      this.broadcasts = broadcasts;
    });
  }

  showComposer() {
    this.newBroadcast.emit();
  }

  onPaginate(event: PageEvent) {
    this.fetchBroadcasts(event.page, event.limit);
  }
}

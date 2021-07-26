import { Component, OnInit } from '@angular/core';
import { SmsBroadcast } from '../../../../shared/model/api/sms-broadcast';
import { SmsBroadcastService } from '../../../../shared/services/api/sms-broadcast.service';

@Component({
  selector: 'app-broadcast-history-view',
  templateUrl: './broadcast-history-view.component.html',
  styleUrls: ['./broadcast-history-view.component.scss']
})
export class BroadcastHistoryViewComponent implements OnInit {

  public broadcasts;

  constructor(
    public smsBroadcastService: SmsBroadcastService
  ) { }

  ngOnInit(): void {
    this.fetchBroadcasts();
  }

  fetchBroadcasts(page = 1, limit = 15) {
    const params = { page, limit };

    this.smsBroadcastService.getAll<SmsBroadcast>(params).subscribe(broadcasts => {
      this.broadcasts = broadcasts;
    });
  }
}

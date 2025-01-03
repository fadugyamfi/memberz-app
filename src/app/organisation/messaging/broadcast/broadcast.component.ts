import { Component, OnInit, viewChild } from '@angular/core';
import { SmsBroadcast } from '../../../shared/model/api/sms-broadcast';
import { MessageComposerComponent } from './message-composer/message-composer.component';
import { BroadcastHistoryViewComponent } from './broadcast-history-view/broadcast-history-view.component';

@Component({
    selector: 'app-broadcast',
    templateUrl: './broadcast.component.html',
    styleUrls: ['./broadcast.component.scss'],
    imports: [MessageComposerComponent, BroadcastHistoryViewComponent]
})
export class BroadcastComponent implements OnInit {

  readonly composer = viewChild<MessageComposerComponent>("composer");

  view = 'history';

  constructor() { }

  ngOnInit() {
  }

  showComposer(broadcast?: SmsBroadcast) {
    if( broadcast ) {
      this.composer()?.setBroadcast(broadcast);
    }

    this.composer()?.show();
  }

  showHistory() {
    this.view = 'history';
  }
}

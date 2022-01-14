import { Component, OnInit, ViewChild } from '@angular/core';
import { SmsBroadcast } from '../../../shared/model/api/sms-broadcast';
import { MessageComposerComponent } from './message-composer/message-composer.component';

@Component({
  selector: 'app-broadcast',
  templateUrl: './broadcast.component.html',
  styleUrls: ['./broadcast.component.scss']
})
export class BroadcastComponent implements OnInit {

  @ViewChild("composer", { static: true }) composer: MessageComposerComponent;

  view = 'history';

  constructor() { }

  ngOnInit() {
  }

  showComposer(broadcast?: SmsBroadcast) {
    if( broadcast ) {
      this.composer.setBroadcast(broadcast);
    }

    this.composer.show();
  }

  showHistory() {
    this.view = 'history';
  }
}

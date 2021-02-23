import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SmsBroadcastList } from '../../../../shared/model/cakeapi/sms-broadcast-list';
import { SmsBroadcastListService } from '../../../../shared/services/cakeapi/sms-broadcast-list.service';

@Component({
  selector: 'app-message-composer',
  templateUrl: './message-composer.component.html',
  styleUrls: ['./message-composer.component.scss']
})
export class MessageComposerComponent implements OnInit {

  @Output() public cancel = new EventEmitter();

  public broadcastLists: SmsBroadcastList[];

  constructor(
    public broadcastListService: SmsBroadcastListService
  ) { }

  ngOnInit(): void {
    this.loadBroadcastLists();
  }

  loadBroadcastLists(page = 1, limit = 10) {
    this.broadcastListService.getAll<SmsBroadcastList[]>({ page, limit, sort: 'name:asc' }).subscribe(
      (broadcastLists) => this.broadcastLists = broadcastLists
    );
  }

  cancelCompose() {
    this.cancel.emit();
  }
}

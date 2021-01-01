import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-message-composer',
  templateUrl: './message-composer.component.html',
  styleUrls: ['./message-composer.component.scss']
})
export class MessageComposerComponent implements OnInit {

  @Output() public cancel = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  cancelCompose() {
    this.cancel.emit();
  }
}

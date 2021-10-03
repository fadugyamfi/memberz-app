import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-broadcast',
  templateUrl: './broadcast.component.html',
  styleUrls: ['./broadcast.component.scss']
})
export class BroadcastComponent implements OnInit {

  view = 'history';

  constructor() { }

  ngOnInit() {
  }

  showComposer() {
    this.view = 'composer';
  }

  showHistory() {
    this.view = 'history';
  }
}

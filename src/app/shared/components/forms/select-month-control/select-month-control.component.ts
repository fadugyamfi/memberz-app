import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-select-month-control',
  templateUrl: './select-month-control.component.html',
  styleUrls: ['./select-month-control.component.scss']
})
export class SelectMonthControlComponent implements OnInit {

  @Output() selectedMonthEvent = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  setValue($event) {
    this.selectedMonthEvent.emit($event.target.value);
  }

}

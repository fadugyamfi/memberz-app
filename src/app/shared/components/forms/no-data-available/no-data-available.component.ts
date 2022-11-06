import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-data-available',
  templateUrl: './no-data-available.component.html',
  styleUrls: ['./no-data-available.component.scss']
})
export class NoDataAvailableComponent implements OnInit {

  @Input() message = 'No Data Available';

  constructor() { }

  ngOnInit(): void {
  }

}

import { Component, OnInit, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-no-data-available',
    templateUrl: './no-data-available.component.html',
    styleUrls: ['./no-data-available.component.scss'],
    imports: [TranslateModule]
})
export class NoDataAvailableComponent implements OnInit {

  readonly message = input('No Data Available');

  constructor() { }

  ngOnInit(): void {
  }

}

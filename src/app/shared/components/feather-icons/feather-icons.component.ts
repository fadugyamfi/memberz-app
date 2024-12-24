import { Component, OnInit, input } from '@angular/core';
import * as feather from 'feather-icons';

@Component({
    selector: 'app-feather-icons',
    templateUrl: './feather-icons.component.html',
    styleUrls: ['./feather-icons.component.scss'],
    standalone: true
})
export class FeatherIconsComponent implements OnInit {

  public readonly icon = input(undefined);

  constructor() { }

  ngOnInit() {
    setTimeout(() => {
      feather.replace();
    });
  }

}

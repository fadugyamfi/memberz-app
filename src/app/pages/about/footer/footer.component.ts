import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'about-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  public year: number;
  constructor() { }

  ngOnInit(): void {
    this.year = moment().year();
  }

}

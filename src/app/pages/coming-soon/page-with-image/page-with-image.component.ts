import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-page-with-image',
    templateUrl: './page-with-image.component.html',
    styleUrls: ['./page-with-image.component.scss'],
    standalone: true
})
export class PageWithImageComponent implements OnInit {
  seconds: number;

  constructor() {
    this.setTime();
  }

  setTime() {
    setInterval(function () {
      var countDown = new Date('Sep 30, 2019 00:00:00').getTime();
      var now = new Date().getTime();
      var distance = countDown - now;
      this.document.getElementById('days').innerHTML = Math.floor(distance / (1000 * 60 * 60 * 24));
      this.document.getElementById('hours').innerHTML = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.document.getElementById('minutes').innerHTML = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      this.document.getElementById('seconds').innerHTML = Math.floor((distance % (1000 * 60)) / 1000);
    }, this.seconds);
  }

  ngOnInit() { }


}

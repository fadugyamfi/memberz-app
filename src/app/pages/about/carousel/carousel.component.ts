import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'about-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {

  public images = [];

  constructor() { }

  ngOnInit(): void {
    this.images = [
      {
        src: '/assets/images/page_images/carousel/dashboard.png',
        title: 'Powerful Dashboards',
        description: 'All Your Data At Glance'
      },
      // {
      //   src: '/assets/images/page_images/carousel/noticeboard.png',
      //   title: 'Stay Informed',
      //   description: 'Keep your members informed'
      // },
      // {
      //   src: '/assets/images/page_images/carousel/sms_receipts.png',
      //   title: 'SMS Receipts',
      //   description: 'Keep your members informed'
      // },
      // {
      //   src: '/assets/images/page_images/carousel/payments.png',
      //   title: 'Track Payments Made',
      //   description: 'Keep your members informed'
      // }
    ];
  }

}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'about-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {

  public images: string[];

  constructor() { }

  ngOnInit(): void {
    this.images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);
    console.log(this.images);
  }

}

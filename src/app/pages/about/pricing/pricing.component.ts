import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'about-pricing',
    templateUrl: './pricing.component.html',
    styleUrls: ['./pricing.component.scss'],
    standalone: true,
    imports: [RouterLink]
})
export class PricingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

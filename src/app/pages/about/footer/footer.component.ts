import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'about-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    standalone: true,
    imports: [RouterLink]
})
export class FooterComponent implements OnInit {

  public year: number;
  constructor() { }

  ngOnInit(): void {
    this.year = new Date().getFullYear();
  }

}

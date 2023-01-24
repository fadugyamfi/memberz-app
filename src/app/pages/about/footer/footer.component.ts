import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'about-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  public year: number;
  constructor() { }

  ngOnInit(): void {
    this.year = new Date().getFullYear();
  }

}

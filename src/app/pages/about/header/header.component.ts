import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'about-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  openNav() {
    document.getElementsByClassName("nav-section")[0].classList.add('open')
  }

  closeNav() {
    document.getElementsByClassName("nav-section")[0].classList.remove('open')
  }
}

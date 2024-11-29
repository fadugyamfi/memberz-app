import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/api/auth.service';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'about-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: true,
    imports: [NgIf, RouterLink]
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn;
  }

  openNav() {
    document.getElementsByClassName("nav-section")[0].classList.add('open')
  }

  closeNav() {
    document.getElementsByClassName("nav-section")[0].classList.remove('open')
  }
}

import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../about/header/header.component';
import { FooterComponent } from '../../about/footer/footer.component';

@Component({
    selector: 'app-terms-and-conditions',
    templateUrl: './terms-and-conditions.component.html',
    styleUrls: ['./terms-and-conditions.component.scss'],
    imports: [HeaderComponent, FooterComponent]
})
export class TermsAndConditionsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

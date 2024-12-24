import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../about/header/header.component';
import { FooterComponent } from '../../about/footer/footer.component';

@Component({
    selector: 'app-data-use-policy',
    templateUrl: './data-use-policy.component.html',
    styleUrls: ['./data-use-policy.component.scss'],
    imports: [HeaderComponent, FooterComponent]
})
export class DataUsePolicyComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

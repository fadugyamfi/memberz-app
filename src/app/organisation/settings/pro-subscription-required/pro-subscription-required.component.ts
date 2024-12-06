import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-pro-subscription-required',
    templateUrl: './pro-subscription-required.component.html',
    styleUrls: ['./pro-subscription-required.component.scss'],
    imports: [RouterLink, TranslateModule]
})
export class ProSubscriptionRequiredComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

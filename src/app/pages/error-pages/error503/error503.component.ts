import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-error503',
    templateUrl: './error503.component.html',
    styleUrls: ['./error503.component.scss'],
    standalone: true,
    imports: [RouterLink]
})
export class Error503Component implements OnInit {

  constructor() { }

  ngOnInit() { }

}

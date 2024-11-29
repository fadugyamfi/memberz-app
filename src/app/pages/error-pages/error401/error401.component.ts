import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-error401',
    templateUrl: './error401.component.html',
    styleUrls: ['./error401.component.scss'],
    standalone: true,
    imports: [RouterLink]
})
export class Error401Component implements OnInit {

  constructor() { }

  ngOnInit() { }

}

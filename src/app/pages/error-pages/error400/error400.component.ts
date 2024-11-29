import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-error400',
    templateUrl: './error400.component.html',
    styleUrls: ['./error400.component.scss'],
    standalone: true,
    imports: [RouterLink]
})
export class Error400Component implements OnInit {

  constructor() { }

  ngOnInit() { }

}

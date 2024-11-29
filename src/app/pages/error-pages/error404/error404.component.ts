import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-error404',
    templateUrl: './error404.component.html',
    styleUrls: ['./error404.component.scss'],
    standalone: true,
    imports: [RouterLink]
})
export class Error404Component implements OnInit {

  constructor() { }

  ngOnInit() { }

}

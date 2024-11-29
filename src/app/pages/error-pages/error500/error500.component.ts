import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-error500',
    templateUrl: './error500.component.html',
    styleUrls: ['./error500.component.scss'],
    standalone: true,
    imports: [RouterLink]
})
export class Error500Component implements OnInit {

  constructor() { }

  ngOnInit() { }

}

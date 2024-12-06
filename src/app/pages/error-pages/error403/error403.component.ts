import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-error403',
    templateUrl: './error403.component.html',
    styleUrls: ['./error403.component.scss'],
    imports: [RouterLink]
})
export class Error403Component implements OnInit {

  constructor() { }

  ngOnInit() { }

}

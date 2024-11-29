import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-maintenance',
    templateUrl: './maintenance.component.html',
    styleUrls: ['./maintenance.component.scss'],
    standalone: true,
    imports: [RouterLink]
})
export class MaintenanceComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

}

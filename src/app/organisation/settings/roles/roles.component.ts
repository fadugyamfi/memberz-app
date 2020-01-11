import { Component, OnInit } from '@angular/core';
import { EventsService } from '../../../shared/services/events.service';
import { OrganisationRoleService } from '../../../shared/services/cakeapi/organisation-role.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {

  constructor(
    public events: EventsService,
    public roleService: OrganisationRoleService
  ) { }

  ngOnInit() {
  }

}

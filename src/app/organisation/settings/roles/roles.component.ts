import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { EventsService } from '../../../shared/services/events.service';
import { OrganisationRoleService } from '../../../shared/services/cakeapi/organisation-role.service';
import { OrganisationRole } from '../../../shared/model/cakeapi/organisation-role';
import { Subscription } from 'rxjs';
import { PermissionsComponent } from '../permissions/permissions.component';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit, OnDestroy {

  @ViewChild('permissions', { static: true }) permissions: PermissionsComponent;

  public roles: OrganisationRole[];
  public selectedRole: OrganisationRole;
  public subscriptions: Subscription[] = [];

  constructor(
    public events: EventsService,
    public roleService: OrganisationRoleService
  ) { }

  ngOnInit() {
    this.loadRoles();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadRoles() {
    const sub = this.roleService.getAll<OrganisationRole[]>({
      limit: 100, sort: 'name:asc', count: ['permissions', 'organisation_account'].join()
    }).subscribe(
      (roles) => this.roles = roles
    );

    this.subscriptions.push(sub);
  }

  /**
   * Show the permissions for the selected role
   *
   * @param role Selected Role
   */
  viewPermissions(role: OrganisationRole) {
    this.selectedRole = role;
    this.permissions.show();
  }
}

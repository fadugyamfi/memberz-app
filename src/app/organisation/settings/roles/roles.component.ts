import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { EventsService } from '../../../shared/services/events.service';
import { OrganisationRoleService } from '../../../shared/services/api/organisation-role.service';
import { OrganisationRole } from '../../../shared/model/api/organisation-role';
import { Subscription } from 'rxjs';
import { PermissionsComponent } from '../permissions/permissions.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit, OnDestroy {

  @ViewChild('permissions', { static: true }) permissions: PermissionsComponent;
  @ViewChild('editorModal', { static: true }) editorModal: ElementRef;

  public roles: OrganisationRole[] = [];
  public selectedRole: OrganisationRole;
  public subscriptions: Subscription[] = [];

  public modalTitle = 'Add Organisation Role';
  public editorModalRef: NgbModalRef;
  public editorForm: FormGroup;
  public saving = false;

  constructor(
    public events: EventsService,
    public roleService: OrganisationRoleService,
    public modalService: NgbModal
  ) { }

  ngOnInit() {
    this.loadRoles();
    this.setupForm();
    this.setupEvents();
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

  /**
   * Sets up the form for creating a role
   */
  setupForm() {
    this.editorForm = new FormGroup({
      id: new FormControl(''),
      name: new FormControl('', Validators.required),
      description: new FormControl(''),
      guard_name: new FormControl('api')
    });
  }


  setupEvents() {
    this.events.on('OrganisationRole:created', (role) => {
      this.hideModal();
      this.roles.push(role);
      this.saving = false;
    });

    this.events.on('OrganisationRole:updated', (role) => {
      this.saving = false;
      this.hideModal();
      this.roles.forEach((sem, index) => {
        if (sem.id === role.id) {
          this.roles[index] = role;
        }
      });
    });

    this.events.on('OrganisationRole:deleted', (role) => {
      this.roles.forEach((g, index) => {
        if (g.id === role.id) {
          this.roles.splice(index, 1);
          return false;
        }
      });
    });

    this.events.on('OrganisationRole:permissionSynced', (data) => {
      const role_id = data.id;
      this.roles.forEach((item, index) => {
          if (item.id === role_id) {
            this.roles[index].permissions_count = data.permissions.length;
            this.roles[index].organisation_account_count = data.organisation_account_count;
          }
      });

    });
  }

  recordsPresent() {
    return this.roles && this.roles.length > 0;
  }

  onSubmit(e) {
    e.preventDefault();

    if (this.editorForm.invalid) {
      return;
    }

    this.saving = true;
    let role = new OrganisationRole(this.editorForm.value);
    const params = { count: ['permissions', 'organisation_account'].join() };

    if (role.id) {
      return this.roleService.update(role, params);
    }

    return this.roleService.create(role, params);
  }

  showModal() {
    this.editorModalRef = this.modalService.open(this.editorModal);
  }

  hideModal() {
    this.editorModalRef.close();
  }

  /**
   * Displays the modal with the role creation/update form
   *
   * @param e Event
   * @param role Role
   */
  showEditor(e: Event, role: OrganisationRole = null) {
    e.preventDefault();
    if (role) {
      this.modalTitle = 'Edit Organisation Role';
      this.editorForm.patchValue(role);
    } else {
      this.modalTitle = 'Add Organisation Role';
      this.setupForm();
    }

    this.showModal();
  }

  /**
   * Deletes a Role record from the database
   * @param role Role
   */
  deleteRole(role: OrganisationRole) {
    Swal.fire({
      title: 'Are you sure you want delete this role record?',
      text: 'This will delete the record in the database and cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete Role'
    }).then((dismiss) => {
      if (dismiss.value) {
        this.roleService.remove(role);
      }
    });
  }
}

import { Component, OnInit, OnDestroy, Input, viewChild } from '@angular/core';
import { PermissionGroup } from './permission-group.model';
import { UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EventsService } from '../../../shared/services/events.service';
import { StorageService } from '../../../shared/services/storage.service';
import { Permission } from '../../../shared/model/api/permission.model';
import { PermissionService } from '../../../shared/services/api/permission.service';
import { OrganisationRoleService } from '../../../shared/services/api/organisation-role.service';
import { OrganisationRole } from '../../../shared/model/api/organisation-role';
import { NgbModal, NgbModalRef, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { OrganisationAccountService } from '../../../shared/services/api/organisation-account.service';
import Swal from 'sweetalert2';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { UiSwitchModule } from 'ngx-ui-switch';
import { NgClass, TitleCasePipe } from '@angular/common';

@Component({
    selector: 'app-permissions',
    templateUrl: './permissions.component.html',
    styleUrls: ['./permissions.component.scss'],
    imports: [FormsModule, ReactiveFormsModule, UiSwitchModule, NgClass, NgbCollapseModule, TitleCasePipe, TranslateModule]
})
export class PermissionsComponent implements OnInit, OnDestroy {

  readonly modal = viewChild('editorModal');

  public editorForm: UntypedFormGroup;
  public modalRef: NgbModalRef;

  public _permissions: Permission[] = [];
  public permissionGroups: PermissionGroup[] = [];
  public rolePermissions: Permission[];

  public _role: OrganisationRole;
  public subs: Subscription[] = [];
  public cacheKey = 'user_permissions';

  constructor(
    public events: EventsService,
    public permissionService: PermissionService,
    public fb: UntypedFormBuilder,
    public roleService: OrganisationRoleService,
    public storage: StorageService,
    public modalService: NgbModal,
    public orgAccountService: OrganisationAccountService,
    public translate: TranslateService
  ) { }

  ngOnInit() {
    this.setupForm();
    this.loadPermissions();
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  /**
   * Loads the list of available permissions either from cache or from
   * the server
   */
  loadPermissions() {
    if ( this.storage.isValid(this.cacheKey) ) {
      this.permissions = this.storage.get(this.cacheKey).map(perm => new Permission(perm));
      return;
    }

    // else fetch permissions and store to cache
    this.refreshPermissionCache();
  }

  /**
   * Clears cached permissions and reloads from the backend
   */
  refreshPermissionCache() {
    this.storage.local().remove(this.cacheKey);
    this.fetchAndStorePermissions();
  }

  /**
   * Fetches all available permissions and caches the result for 24 hours
   */
  fetchAndStorePermissions() {
    const sub = this.permissionService.getAll({limit: 200}).subscribe((permissions) => {
      this.permissions = permissions;
      this.storage.local().set(this.cacheKey, permissions);
    });

    this.subs.push(sub);
  }

  getRolePermissions(role_id: any) {
    const sub = this.roleService.permissions(role_id).subscribe(permissions => {
      this.rolePermissions = permissions;
      this.markSelectedPermissions();
    });

    this.subs.push(sub);
  }

  set permissions(values) {
    this._permissions = values;

    if ( values ) {
      this.permissionGroups = [];

      values.forEach(permission => {
        const parts = permission.name.split(':');
        const groupName = parts[0].replace(/_/g, ' ');
        const subGroupName = parts[1].replace(/_/g, ' ');

        let permGroup = this.permissionGroups.find((pg) => pg.name === groupName);

        if ( !permGroup ) {
          permGroup = new PermissionGroup({name: groupName});
          this.permissionGroups.push(permGroup);
        }

        let subGroup = permGroup.groups.find(gp => gp.name === subGroupName);

        if ( !subGroup ) {
          subGroup = new PermissionGroup({name: subGroupName});
          permGroup.addGroup(subGroup);
        }

        subGroup.addPermission(permission);
      });

      this.permissionGroups.sort((a, b) => a.name > b.name ? 1 : (a.name < b.name ? -1 : 0) );
      this.permissionGroups.forEach(group => {
        group.groups.sort((a, b) => a.name > b.name ? 1 : (a.name < b.name ? -1 : 0) );
      });

      this.markSelectedPermissions();
    }
  }

  get permissions() {
    return this._permissions;
  }

  /**
   * Set role
   */
  @Input()
  set role(value) {
    this._role = value;

    if ( value ) {
      this.selectAll(false);
      this.getRolePermissions( value.id );
    }
  }

  get role() {
    return this._role;
  }

  /**
   * Show modal for permissions
   */
  show() {
    this.modalRef = this.modalService.open(this.modal(), { size: 'lg'});
  }

  hide() {
    this.modalRef.close();
  }

  selectAllInGroup(selected, permGroup: PermissionGroup) {
    permGroup.selected = selected;
  }

  selectAll(selected) {
    this.permissionGroups.forEach(permGroup => permGroup.selected = selected);
  }

  markSelected(selected, permission) {
    permission.selected = selected;
  }

  markSelectedPermissions() {
    if ( !this.rolePermissions ) {
      return;
    }

    this.permissionGroups.forEach(permGroup => {
      permGroup.selected = false; // will clear selections if any

      this.rolePermissions.forEach(permission => {
        permGroup.markSelected( permission );
      });
    });
  }

  setupForm() {
    this.editorForm = this.fb.group({
      role_id: this.role ? this.role.id : null,
      permissions: this.buildPermissions()
    });
  }

  buildPermissions() {
    const arr = this.permissions.map((permission: any) => {
      return permission.selected ? this.fb.control(permission.id) : false;
    });

    return this.fb.array(arr.filter((item) => item !== false));
  }

  /**
   * Called to submit the data for a permission set to the server for saving
   *
   * @param e
   */
  onSubmit(e) {
    this.setupForm();
    const params = this.editorForm.value;

    // if setting permissions for a role
    if ( this.role ) {
      Swal.fire(this.translate.instant('Saving Permissions Changes'), '', 'info');
      Swal.showLoading();

      this.roleService.syncPermissions(params).subscribe(() => {
        this.orgAccountService.refreshActiveAccount()?.subscribe({
          next: () => this.hide(),
          error: () => {
            Swal.hideLoading();
            Swal.fire(
              this.translate.instant('Refresh Error'),
              this.translate.instant('Could not load new permissions for account') + '.' + this.translate.instant('Please refresh page and try again'),
              'error'
            )
          },
          complete: () => Swal.close()
         });
      });
    }

  }

  /**
   * Returns the total number of selected permissions
   */
  totalSelectedPermissions() {
    let count = 0;
    this.permissions.forEach(perm => {
      if ( perm.selected ) { count++; }
    });

    return count;
  }

  /**
   * Toggles the collapsed state of the specified group
   *
   * @param group
   */
  toggleGroupCollapsed(group: PermissionGroup) {
    group.collapsed = !group.collapsed;
  }
}

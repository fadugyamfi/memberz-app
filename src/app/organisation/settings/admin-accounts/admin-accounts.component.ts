import { Component, OnInit, OnDestroy, viewChild } from '@angular/core';
import { OrganisationAccountService } from '../../../shared/services/api/organisation-account.service';
import { Observable, Subscription, of } from 'rxjs';
import { OrganisationAccount } from '../../../shared/model/api/organisation-account';
import { map, debounceTime, distinctUntilChanged, tap, switchMap, catchError } from 'rxjs/operators';
import { OrganisationRoleService } from '../../../shared/services/api/organisation-role.service';
import { OrganisationRole } from '../../../shared/model/api/organisation-role';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormGroup, UntypedFormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrganisationService } from '../../../shared/services/api/organisation.service';
import { EventsService } from '../../../shared/services/events.service';
import { OrganisationMemberService } from '../../../shared/services/api/organisation-member.service';
import { OrganisationMember } from '../../../shared/model/api/organisation-member';
import Swal from 'sweetalert2';
import { PageEvent, PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

import { AvatarModule } from 'ngx-avatars';
import { ViewProfileDirective } from '../../../shared/directives/view-profile.directive';
import { ImagePreloadDirective } from '../../../shared/directives/image-preload.directive';
import { MemberControlComponent } from '../../../shared/components/forms/member-control/member-control.component';

@Component({
    selector: 'app-admin-accounts',
    templateUrl: './admin-accounts.component.html',
    styleUrls: ['./admin-accounts.component.scss'],
    imports: [AvatarModule, ViewProfileDirective, PaginationComponent, FormsModule, ReactiveFormsModule, ImagePreloadDirective, MemberControlComponent, TranslateModule]
})
export class AdminAccountsComponent implements OnInit, OnDestroy {

  readonly editorModal = viewChild<any>('editorModal');

  public accountData: OrganisationAccount[] = [];
  public roles: OrganisationRole[];

  public editorModalRef: NgbModalRef;
  public modalTitle = 'Add New Account';
  public editorForm: UntypedFormGroup;
  public editingAccount: OrganisationAccount | null;

  public subscriptions: Subscription[] = [];

  constructor(
    public accountService: OrganisationAccountService,
    public roleService: OrganisationRoleService,
    public modalService: NgbModal,
    public organisationService: OrganisationService,
    public events: EventsService,
    public orgMemberService: OrganisationMemberService,
    public translate: TranslateService
  ) { }

  ngOnInit() {
    this.setupEditorForm();
    this.setupEvents();
    this.loadRoles();
    this.loadAccounts();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.removeEvents();
  }

  loadRoles() {
    this.roleService.getAll({ limit: 30, sort: 'name:asc' }).subscribe(roles => this.roles = roles);
  }

  loadAccounts(page = 1, limit = 15) {
    const sub = this.accountService.getAll({
      contain: ['member_account.member.profile_photo', 'organisation_role'].join(),
      limit,
      page
    }).pipe(map(result => {
      return result.sort((a, b) => {
        const nameA = a.member_account?.member?.last_name;
        const nameB = b.member_account?.member?.last_name;
        return nameA > nameB ? 1 : (nameB > nameA ? -1 : 0);
      });
    })).subscribe((result) => this.accountData = result);

    this.subscriptions.push(sub);
  }

  recordsPresent() {
    return this.accountData && this.accountData.length > 0;
  }

  setupEvents() {
    this.events.on('OrganisationAccount:created', () => {
      this.editorModalRef.close();
      this.loadAccounts();
    });
    this.events.on('OrganisationAccount:updated', () => {
      this.editorModalRef.close();
      this.loadAccounts();
    });
    this.events.on('OrganisationAccount:deleted', () => Swal.close());
  }

  removeEvents() {
    this.events.off('OrganisationAccount:created');
    this.events.off('OrganisationAccount:updated');
    this.events.off('OrganisationAccount:deleted');
  }

  setupEditorForm() {
    const organisation = this.organisationService.getActiveOrganisation();
    this.editorForm = new UntypedFormGroup({
      id: new UntypedFormControl(),
      member_id: new UntypedFormControl('', Validators.required),
      member_account_id: new UntypedFormControl('', Validators.required),
      organisation_id: new UntypedFormControl(organisation.id),
      organisation_role_id: new UntypedFormControl('', Validators.required),
      active: new UntypedFormControl(1)
    });
  }

  showEditor(account: OrganisationAccount | null = null) {
    this.modalTitle = 'Add New Account';
    this.editingAccount = null;
    this.setupEditorForm();

    if (account) {
      this.modalTitle = 'Edit Account Info';
      this.editingAccount = account;
      this.editorForm.patchValue(account);
    }

    this.editorModalRef = this.modalService.open(this.editorModal());
  }

  onSubmit(e: Event) {
    e.preventDefault();

    const account = new OrganisationAccount(this.accountService.removeEmpty(this.editorForm.value));
    const params = { contain: ['member_account.member.profile_photo', 'organisation_role'].join() };

    if (account.id) {
      return this.accountService.update(account, params);
    }

    return this.accountService.create(account, params);
  }

  deleteAccount(user: OrganisationAccount) {
    Swal.fire({
      title: this.translate.instant('Confirm Deletion'),
      text: this.translate.instant(`This action will delete :name from the database. This action currently cannot be reverted`, { name: user.member_account?.member?.firstThenLastName() }),
      icon: 'warning',
      showCancelButton: true,
    }).then((action) => {
      if (action.value) {
        Swal.fire(this.translate.instant('Deleting Admin Account'), this.translate.instant('Please wait') + ' ...', 'error');
        Swal.showLoading();
        this.accountService.remove(user);
      }
    });
  }

  /**
   * Handles the pagination events
   *
   * @param event PageEvent
   */
   onPaginate(event: PageEvent) {
    this.loadAccounts(event.page, event.limit);
  }
}

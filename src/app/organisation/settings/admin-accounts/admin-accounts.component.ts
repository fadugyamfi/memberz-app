import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { OrganisationAccountService } from '../../../shared/services/api/organisation-account.service';
import { Observable, Subscription, of } from 'rxjs';
import { OrganisationAccount } from '../../../shared/model/api/organisation-account';
import { map, debounceTime, distinctUntilChanged, tap, switchMap, catchError } from 'rxjs/operators';
import { OrganisationRoleService } from '../../../shared/services/api/organisation-role.service';
import { OrganisationRole } from '../../../shared/model/api/organisation-role';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OrganisationService } from '../../../shared/services/api/organisation.service';
import { EventsService } from '../../../shared/services/events.service';
import { OrganisationMemberService } from '../../../shared/services/api/organisation-member.service';
import { OrganisationMember } from '../../../shared/model/api/organisation-member';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-accounts',
  templateUrl: './admin-accounts.component.html',
  styleUrls: ['./admin-accounts.component.scss']
})
export class AdminAccountsComponent implements OnInit, OnDestroy {

  @ViewChild('editorModal', { static: true }) editorModal: any;

  public accountData = [];
  public roles: OrganisationRole[];

  public editorModalRef: NgbModalRef;
  public modalTitle = 'Add New Account';
  public editorForm: FormGroup;
  public editingAccount: OrganisationAccount;

  public subscriptions: Subscription[] = [];

  constructor(
    public accountService: OrganisationAccountService,
    public roleService: OrganisationRoleService,
    public modalService: NgbModal,
    public organisationService: OrganisationService,
    public events: EventsService,
    public orgMemberService: OrganisationMemberService
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

  loadAccounts() {
    const sub = this.accountService.getAll({
      contain: ['member_account.member.profile_photo', 'organisation_role'].join(),
      deleted: 0,
      limit: 100
    }).pipe(map(result => {
      return result.sort((a, b) => {
        const nameA = a.member_account.member.last_name;
        const nameB = b.member_account.member.last_name;
        return nameA > nameB ? 1 : (nameB > nameA ? -1 : 0);
      });
    })).subscribe((result) => this.accountData = result);

    this.subscriptions.push(sub);
  }

  recordsPresent() {
    return this.accountData && this.accountData.length > 0;
  }

  setupEvents() {
    this.events.on('OrganisationAccount:created', (account: OrganisationAccount) => {
      this.editorModalRef.close();

      if (account.id) {
        this.accountData.push(account);
      }
    });

    this.events.on('OrganisationAccount:updated', (account: OrganisationAccount) => {
      this.editorModalRef.close();
      this.accountData.forEach((acc, index) => {
        if (acc.id === account.id) {
          this.accountData[index] = account;
        }
      });
    });

    this.events.on('OrganisationAccount:deleted', (account) => {
      this.accountData.forEach((acc, index) => {
        if (acc.id === account.id) {
          this.accountData.splice(index, 1);
        }
      });

      Swal.close();
    });
  }

  removeEvents() {
    this.events.off('OrganisationAccount:created');
    this.events.off('OrganisationAccount:updated');
    this.events.off('OrganisationAccount:deleted');
  }

  setupEditorForm() {
    const organisation = this.organisationService.getActiveOrganisation();
    this.editorForm = new FormGroup({
      id: new FormControl(),
      member_id: new FormControl('', Validators.required),
      member_account_id: new FormControl('', Validators.required),
      organisation_id: new FormControl(organisation.id),
      organisation_role_id: new FormControl('', Validators.required),
      active: new FormControl(0)
    });
  }

  showEditor(account: OrganisationAccount = null) {
    this.modalTitle = 'Add New Account';
    this.editingAccount = null;
    this.editorForm.reset();

    if (account) {
      this.modalTitle = 'Edit Account Info';
      this.editingAccount = account;
      this.editorForm.patchValue(account);
    }

    this.editorModalRef = this.modalService.open(this.editorModal);
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
      title: 'Confirm Deletion',
      text: `
        This action will delete "${user.member_account.member.firstThenLastName()}"
        from the database. This action currently cannot be reverted`,
      icon: 'warning',
      showCancelButton: true,
    }).then((action) => {
      if (action.value) {
        Swal.fire('Deleting Admin Account', 'Please wait ...', 'error');
        Swal.showLoading();
        this.accountService.remove(user);
      }
    });
  }
}

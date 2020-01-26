import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { OrganisationAccountService } from '../../../shared/services/cakeapi/organisation-account.service';
import { Observable, Subscription, of } from 'rxjs';
import { OrganisationAccount } from '../../../shared/model/cakeapi/organisation-account';
import { map, debounceTime, distinctUntilChanged, tap, switchMap, catchError } from 'rxjs/operators';
import { OrganisationRoleService } from '../../../shared/services/cakeapi/organisation-role.service';
import { OrganisationRole } from '../../../shared/model/cakeapi/organisation-role';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OrganisationService } from '../../../shared/services/cakeapi/organisation.service';
import { EventsService } from '../../../shared/services/events.service';
import { OrganisationMemberService } from '../../../shared/services/cakeapi/organisation-member.service';
import { OrganisationMember } from '../../../shared/model/cakeapi/organisation-member';

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
  public modalTitle: string = "Add New Account";
  public editorForm: FormGroup;
  public editingAccount: OrganisationAccount;

  public subscriptions: Subscription[] = [];

  public searching = false;
  public searchFailed = false;
  public formatter = (profile: OrganisationMember) => profile.member && profile.member.firstThenLastName();
  public selectedMember: OrganisationMember;
  public searchMember = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap(term => {
        const params = {
          first_name_like: term
        };
        return this.orgMemberService.search<OrganisationMember[]>(params).pipe(
          tap(() => this.searchFailed = false),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          })
        )}
      ),
      tap(() => this.searching = false)
    )

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
    this.roleService.getAll<OrganisationRole[]>({ limit: 30, sort: 'name:asc' }).subscribe(roles => this.roles = roles);
    this.loadAccounts();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.removeEvents();
  }

  loadAccounts() {
    const sub = this.accountService.getAll<OrganisationAccount[]>({ 
      contain: ['member_account.member.profile_photo', 'organisation_role'].join(),
      deleted: 0,
      limit: 100
    }).pipe(map(result => {
      return result.sort((a,b) => {
        const nameA = a.member_account.member.last_name;
        const nameB = b.member_account.member.last_name;
        return nameA > nameB ? 1 : (nameB > nameA ? -1 : 0); 
      })
    })).subscribe((result) => this.accountData = result);

    this.subscriptions.push(sub);
  }

  recordsPresent() {
    return this.accountData && this.accountData.length > 0;
  }

  setupEvents() {
    this.events.on('OrganisationAccount:created', (account: OrganisationAccount) => {
      this.editorModalRef.close();

      if( account.id ) {
        this.accountData.push(account);
      }
    });

    this.events.on('OrganisationAccount:updated', (account: OrganisationAccount) => {
      this.editorModalRef.close();
      this.accountData.forEach((acc, index) => {
        if( acc.id == account.id ) {
          this.accountData[index] = account;
        }
      })
    });

    this.events.on('OrganisationAccount:deleted', (account) => {
      this.accountData.forEach((acc, index) => {
        if( acc.id == account.id ) {
          this.accountData.splice(index, 1);
        }
      })
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
      member_id: new FormControl(),
      member_account_id: new FormControl(),
      organisation_id: new FormControl(organisation.id),
      organisation_role_id: new FormControl('', Validators.required),
      active: new FormControl(0)
    })
  }

  showEditor(account: OrganisationAccount = null) {
    this.modalTitle = "Add New Account";
    this.editingAccount = null;
    this.selectedMember = null;
    this.editorForm.reset();

    if( account ) {
      this.modalTitle = "Edit Account Info";
      this.editingAccount = account;
      this.editorForm.patchValue(account);
    }

    this.editorModalRef = this.modalService.open(this.editorModal);
  }

  onSubmit(e: Event) {
    e.preventDefault();

    let account = new OrganisationAccount( this.accountService.removeEmpty(this.editorForm.value) );
    const params = { contain: ['member_account.member.profile_photo', 'organisation_role'].join() };

    if( account.id ) {
      return this.accountService.update(account, params);
    }

    return this.accountService.create(account, params);
  }

  setSelectedMember(data) {
    this.selectedMember = data.item;
    this.editorForm.patchValue({
      member_id: this.selectedMember.member_id
    });
  }
}

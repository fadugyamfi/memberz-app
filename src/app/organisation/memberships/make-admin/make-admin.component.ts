import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { OrganisationMember } from '../../../shared/model/cakeapi/organisation-member';
import { MemberAccount } from '../../../shared/model/cakeapi/member-account';
import { MemberAccountService } from '../../../shared/services/cakeapi/member-account.service';
import { OrganisationService } from '../../../shared/services/cakeapi/organisation.service';
import { Subscription, Observable } from 'rxjs';
import { OrganisationRoleService } from '../../../shared/services/cakeapi/organisation-role.service';
import { OrganisationRole } from '../../../shared/model/cakeapi/organisation-role';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OrganisationAccount } from '../../../shared/model/cakeapi/organisation-account';
import { OrganisationAccountService } from '../../../shared/services/cakeapi/organisation-account.service';
import { EventsService } from '../../../shared/services/events.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-make-admin',
  templateUrl: './make-admin.component.html',
  styleUrls: ['./make-admin.component.scss']
})
export class MakeAdminComponent implements OnInit, OnDestroy {

  @ViewChild('makeAdminModal', { static: true }) makeAdminModal: any;

  public _membership: OrganisationMember;
  public account: MemberAccount;
  public subscriptions: Subscription[] = [];
  public roles$: Observable<OrganisationRole[]>;
  public makeAdminForm: FormGroup;

  constructor(
    public accountService: MemberAccountService,
    public organisationService: OrganisationService,
    public organisationAccountService: OrganisationAccountService,
    public roleService: OrganisationRoleService,
    public modalService: NgbModal,
    public events: EventsService
  ) { }

  ngOnInit() {
    this.setupForm();
    this.setupEvents();
    this.roles$ = this.roleService.getAll<OrganisationRole[]>();
  }

  ngOnDestroy() {
    this.removeEvents();
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  @Input()
  set membership(value) {
    this._membership = value;

    if ( value ) {
      this.loadAccount();
    }
  }

  get membership(): OrganisationMember {
    return this._membership;
  }

  hasAdminAccount() {
    const organisation = this.organisationService.getActiveOrganisation();
    return this.account && this.account.isOrganisationAdmin(organisation.id);
  }

  getOrganisationAccount() {
    const organisation = this.organisationService.getActiveOrganisation();
    return this.account ? this.account.getOrganisationAccount(organisation.id) : null;
  }

  setupForm() {
    const organisation = this.organisationService.getActiveOrganisation();

    this.makeAdminForm = new FormGroup({
      member_id: new FormControl(this.membership ? this.membership.member_id : null, Validators.required),
      email: new FormControl(this.membership ? this.membership.member.email : null, Validators.required),
      organisation_id: new FormControl(organisation.id, Validators.required),
      member_account_id: new FormControl(this.account ? this.account.id : null),
      organisation_role_id: new FormControl('', Validators.required)
    });
  }

  loadAccount() {
    const sub = this.accountService.getAccountByMemberId(this.membership.member_id).subscribe(account => {
      this.account = account;

      if ( this.account ) {
        this.makeAdminForm.patchValue({ member_account_id: this.account.id });
      }
    });

    this.subscriptions.push(sub);
  }

  showAssignmentModal() {
    this.setupForm();
    this.modalService.open(this.makeAdminModal);
  }

  setupEvents() {
    this.events.on('OrganisationAccount:created', () => {
      Swal.close();
      this.modalService.dismissAll();
      this.loadAccount(); // reload account to update UI
    });
  }

  removeEvents() {
    this.events.off('OrganisationAccount:created');
  }

  onSubmit(e: Event) {
    e.preventDefault();

    if ( !this.makeAdminForm.valid ) {
      return;
    }

    Swal.fire('Creating Admin Account', 'Please wait as account is created...', 'info');
    Swal.showLoading();

    const orgAccount = new OrganisationAccount(this.makeAdminForm.value);

    return this.organisationAccountService.create(orgAccount);
  }
}

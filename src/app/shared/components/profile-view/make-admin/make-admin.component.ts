import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { OrganisationMember } from '../../../model/api/organisation-member';
import { MemberAccount } from '../../../model/api/member-account';
import { MemberAccountService } from '../../../services/api/member-account.service';
import { OrganisationService } from '../../../services/api/organisation.service';
import { Subscription, Observable } from 'rxjs';
import { OrganisationRoleService } from '../../../services/api/organisation-role.service';
import { OrganisationRole } from '../../../model/api/organisation-role';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormGroup, UntypedFormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrganisationAccount } from '../../../model/api/organisation-account';
import { OrganisationAccountService } from '../../../services/api/organisation-account.service';
import { EventsService } from '../../../services/events.service';
import Swal from 'sweetalert2';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-make-admin',
    templateUrl: './make-admin.component.html',
    styleUrls: ['./make-admin.component.scss'],
    imports: [FormsModule, ReactiveFormsModule, AsyncPipe, TranslateModule]
})
export class MakeAdminComponent implements OnInit, OnDestroy {

  @ViewChild('makeAdminModal', { static: true }) makeAdminModal: any;

  public mbshp: OrganisationMember;
  public userAccount: MemberAccount;
  public subscriptions: Subscription[] = [];
  public roles$: Observable<OrganisationRole[]>;
  public makeAdminForm: UntypedFormGroup;

  constructor(
    public accountService: MemberAccountService,
    public organisationService: OrganisationService,
    public organisationAccountService: OrganisationAccountService,
    public roleService: OrganisationRoleService,
    public modalService: NgbModal,
    public events: EventsService,
    public translate: TranslateService
  ) { }

  ngOnInit() {
    this.setupForm();
    this.setupEvents();
    this.roles$ = this.roleService.getAll();
  }

  ngOnDestroy() {
    this.removeEvents();
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  @Input()
  set membership(value) {
    this.mbshp = value;

    if ( value ) {
      this.loadAccount();
    }
  }

  get membership(): OrganisationMember {
    return this.mbshp;
  }

  hasAdminAccount() {
    const organisation = this.organisationService.getActiveOrganisation();
    return this.userAccount && this.userAccount.isOrganisationAdmin(organisation.id);
  }

  getOrganisationAccount() {
    const organisation = this.organisationService.getActiveOrganisation();
    return this.userAccount ? this.userAccount.getOrganisationAccount(organisation.id) : null;
  }

  setupForm() {
    const organisation = this.organisationService.getActiveOrganisation();

    this.makeAdminForm = new UntypedFormGroup({
      member_id: new UntypedFormControl(this.membership ? this.membership.member_id : null, Validators.required),
      email: new UntypedFormControl(this.membership ? this.membership.member.email : null, Validators.required),
      organisation_id: new UntypedFormControl(organisation.id, Validators.required),
      member_account_id: new UntypedFormControl(this.userAccount ? this.userAccount.id : null),
      organisation_role_id: new UntypedFormControl('', Validators.required),
    });
  }

  loadAccount() {
    const sub = this.accountService.getAccountByMemberId(this.membership.member_id).subscribe(account => {
      this.userAccount = account;

      if ( this.userAccount ) {
        this.makeAdminForm.patchValue({ member_account_id: this.userAccount.id });
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

    Swal.fire(
      this.translate.instant('Creating Admin Account'),
      this.translate.instant('Please wait as account is created') + '...',
      'info'
    );
    Swal.showLoading();

    let orgAccount = new OrganisationAccount(this.makeAdminForm.value);
    orgAccount.active = 1;

    return this.organisationAccountService.create(orgAccount);
  }
}

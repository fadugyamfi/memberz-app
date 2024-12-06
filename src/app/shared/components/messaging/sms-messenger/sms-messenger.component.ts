import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SmsAccount } from '../../../model/api/sms-account';
import { EventsService } from '../../../services/events.service';
import { SmsAccountService } from '../../../services/api/sms-account.service';
import { SmsAccountMessageService } from '../../../services/api/sms-account-message.service';
import { OrganisationService } from '../../../services/api/organisation.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { OrganisationMember } from '../../../model/api/organisation-member';
import moment from 'moment';
import { SmsAccountMessage } from '../../../model/api/sms-account-message';
import { Member } from '../../../model/api/member';
import { MemberControlComponent } from '../../forms/member-control/member-control.component';

import { AvatarModule } from 'ngx-avatars';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-sms-messenger',
    templateUrl: './sms-messenger.component.html',
    styleUrls: ['./sms-messenger.component.scss'],
    imports: [FormsModule, ReactiveFormsModule, MemberControlComponent, AvatarModule, TranslateModule]
})
export class SmsMessengerComponent implements OnInit {

  @ViewChild('messageModal', { static: true }) messageModal: any;

  public messageForm: UntypedFormGroup;
  public orgSmsAccount: SmsAccount;
  private _member: Member;
  private _membership: OrganisationMember;

  public modal: NgbModalRef;
  public chars = 0;
  public messages = 0;

  public selectedContacts: OrganisationMember[] = [];

  constructor(
    public events: EventsService,
    public smsAccountService: SmsAccountService,
    public messageService: SmsAccountMessageService,
    public organisationService: OrganisationService,
    public modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.fetchSmsAccount();
    this.setupMessageForm();
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.events.on('SmsAccountMessage:created', (message) => {
      this.smsAccountService.refreshAccount();
      this.fetchSmsAccount(); // refresh sms account
      this.modalService.dismissAll();
      Swal.close();
    });
  }

  fetchSmsAccount() {
    this.orgSmsAccount = this.smsAccountService.getOrganisationAccount();
  }

  @Input()
  set member(value: Member) {
    this._member = value;
  }

  get member(): Member {
    return this._member;
  }

  @Input()
  set membership(value: OrganisationMember) {
    this._membership = value;
    this.member = this.membership.member;
    this.selectedContacts.push(this.membership);
  }

  get membership(): OrganisationMember {
    return this._membership;
  }

  /**
   * Sets up the message form group and validations
   */
  setupMessageForm() {
    this.messageForm = new UntypedFormGroup({
      to: new UntypedFormControl('', Validators.required),
      module_sms_account_id: new UntypedFormControl(this.orgSmsAccount ? this.orgSmsAccount.id : null, Validators.required),
      member_id: new UntypedFormControl(this.member ? this.member.id : '', Validators.required),
      message: new UntypedFormControl('', Validators.required),
      sent_at: new UntypedFormControl(moment())
    });
  }

  /**
   * Shows the search modal
   */
  show() {
    this.setupMessageForm();
    this.modal = this.modalService.open(this.messageModal, { size: 'lg', backdrop: 'static' });
  }

  hide() {
    if (this.modal) {
      this.modal.close();
    }
  }

  /**
   * Shows the mobile number of the selected member
   *
   * @param orgMember Selected Member
   */
  addContact(orgMember: OrganisationMember) {
    const ids = this.selectedContacts.map(c => c.id);
    if (!ids.includes(orgMember.id)) {
      this.selectedContacts.push(orgMember);
    }

    this.messageForm.patchValue({
      to: orgMember.member.mobile_number
    });
  }

  removeContact(orgMember: OrganisationMember) {
    const ids = this.selectedContacts.map(c => c.id);
    const index = ids.indexOf(orgMember.id);
    this.selectedContacts.splice(index, 1);
  }

  onMessage(e: Event) {
    e.preventDefault();

    const messages = this.selectedContacts.map(contact => {
      return new SmsAccountMessage(
        Object.assign({}, this.messageForm.value, {
          member_id: contact.member_id,
          to: contact.member.mobile_number
        })
      );
    });

    Swal.fire({
      title: 'Sending Messages',
      text: 'Sending messages to specified contacts',
      icon: 'info'
    });
    Swal.showLoading();

    this.messageService.batchCreate(messages);
  }

  trackChars(e: Event) {
    const target = e.target || e.currentTarget;
    this.chars = (target as HTMLInputElement).value.length;
    this.messages = Math.ceil(this.chars / 160);
  }
}

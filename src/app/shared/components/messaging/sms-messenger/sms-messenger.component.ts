import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SmsAccount } from '../../../model/cakeapi/sms-account';
import { EventsService } from '../../../services/events.service';
import { SmsAccountService } from '../../../services/cakeapi/sms-account.service';
import { SmsAccountMessageService } from '../../../services/cakeapi/sms-account-message.service';
import { OrganisationService } from '../../../services/cakeapi/organisation.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { OrganisationMember } from '../../../model/cakeapi/organisation-member';
import * as moment from 'moment';
import { SmsAccountMessage } from '../../../model/cakeapi/sms-account-message';

@Component({
  selector: 'app-sms-messenger',
  templateUrl: './sms-messenger.component.html',
  styleUrls: ['./sms-messenger.component.scss']
})
export class SmsMessengerComponent implements OnInit {

  @ViewChild('messageModal', { static: true }) messageModal: any;

  public messageForm: FormGroup;
  public orgSmsAccount: SmsAccount;

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
    this.setupMessageForm();
    this.fetchSmsAccount();
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.events.on('SmsAccountMessage:created', (message) => {
      this.smsAccountService.refreshAccount();
      this.fetchSmsAccount(); // refresh sms account
    });
  }

  fetchSmsAccount() {
    this.orgSmsAccount = this.smsAccountService.getOrganisationAccount();
  }

  /**
   * Sets up the message form group and validations
   */
  setupMessageForm() {
    this.messageForm = new FormGroup({
      to: new FormControl('', Validators.required),
      module_sms_account_id: new FormControl(this.orgSmsAccount ? this.orgSmsAccount.id : null, Validators.required),
      member_id: new FormControl('', Validators.required),
      message: new FormControl('', Validators.required),
      sent_at: new FormControl(moment())
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

    this.modalService.dismissAll();

    const messages = this.selectedContacts.map(contact => {
      return new SmsAccountMessage( Object.assign({}, this.messageForm.value, {
        member_id: contact.member_id,
        to: contact.member.mobile_number
      }));
    });

    this.messageService.batchCreate(messages);
  }

  trackChars(e: Event) {
    const target = e.target || e.currentTarget;
    this.chars = (target as HTMLInputElement).value.length;
    this.messages = Math.ceil(this.chars / 160);
  }
}

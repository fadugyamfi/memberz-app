import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { EventsService } from '../../../shared/services/events.service';
import { SmsAccountMessageService } from '../../../shared/services/cakeapi/sms-account-message.service';
import { SmsAccountMessage } from '../../../shared/model/cakeapi/sms-account-message';
import { PageEvent } from '../../../shared/components/pagination/pagination.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrganisationMember } from '../../../shared/model/cakeapi/organisation-member';
import * as moment from 'moment';
import { SmsAccountService } from '../../../shared/services/cakeapi/sms-account.service';
import { OrganisationService } from '../../../shared/services/cakeapi/organisation.service';
import { SmsAccount } from '../../../shared/model/cakeapi/sms-account';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HistoryComponent implements OnInit {

  @ViewChild('searchModal', { static: true }) searchModal: any;
  @ViewChild('messageModal', { static: true }) messageModal: any;

  public messages: SmsAccountMessage[] = [];
  public filtered = 'all';
  public searchForm: FormGroup;
  public messageForm: FormGroup;
  public orgSmsAccount: SmsAccount;

  constructor(
    public events: EventsService,
    public smsAccountService: SmsAccountService,
    public messageService: SmsAccountMessageService,
    public organisationService: OrganisationService,
    public modalService: NgbModal,
    public router: Router
  ) { }

  ngOnInit() {
    this.fetchSmsAccount();
    this.setupSearchForm();
    this.setupMessageForm();
    this.loadMessageHistory();
  }

  fetchSmsAccount() {
    const organisation = this.organisationService.getActiveOrganisation();
    this.smsAccountService.fetchAccount(organisation.id).subscribe((accounts) => {
      this.orgSmsAccount = accounts[0];

      if (!this.orgSmsAccount) {
        Swal.fire(
          'SMS Account Setup Required',
          'Your SMS Messaging account must be setup before messaging can be done.',
          'warning'
        ).then(action => {
          if (action.value) {
            this.router.navigate(['/organisation/messaging/settings']);
          }
        });
      } else {
        this.setupMessageForm();
      }
    });
  }

  /**
   * Sets up the search form group and validations
   */
  setupSearchForm() {
    this.searchForm = new FormGroup({
      to: new FormControl(''),
      member_id: new FormControl(''),
      message_like: new FormControl(),
      sent_at_gt: new FormControl(),
      sent_at_lt: new FormControl()
    });
  }

  /**
   * Sets up the message form group and validations
   */
  setupMessageForm() {
    this.messageForm = new FormGroup({
      to: new FormControl('', Validators.required),
      module_sms_account_id: new FormControl( this.orgSmsAccount ? this.orgSmsAccount.id : null, Validators.required ),
      member_id: new FormControl('', Validators.required),
      message: new FormControl('', Validators.required),
      sent_at: new FormControl(moment())
    });
  }

  loadMessageHistory(page = 1, limit = 30) {
    this.messages = null;

    const params = Object.assign({}, this.searchForm.value, { page, limit, sort: 'id:desc' });

    if (this.filtered !== 'all') {
      switch (this.filtered) {
        case 'pending':
          params['sent'] = 0;
          params['sent_status_isNull'] = true;
          break;

        case 'success':
          params['sent'] = 1;
          break;

        case 'failed':
          params['sent'] = 0;
          params['sent_status_isNotNull'] = true;
          break;
      }
    }

    this.messageService.getAll<SmsAccountMessage[]>(params).subscribe((messages) => {
      this.messages = messages;
      this.highlightWordsInText();
    });
  }

  emptyDataset() {
    return this.messages && this.messages.length === 0;
  }

  dataAvailable() {
    return this.messages && this.messages.length > 0;
  }

  onPaginate(param: PageEvent) {
    this.loadMessageHistory(param.page, param.limit);
  }

  sentStatusClasses(message: SmsAccountMessage) {
    return {
      'text-warning': message.isPending(),
      'text-danger': !message.sent,
      'text-success': message.sent
    };
  }

  setSentStatusFilter(filter: string) {
    this.filtered = filter;
    this.loadMessageHistory();
  }

  isActiveIf(status: string) {
    return { active: this.filtered === status };
  }

  /**
   * Shows the search modal
   */
  showSearchModal() {
    this.modalService.open(this.searchModal, { size: 'lg' });
  }

  /**
   * Shows the search modal
   */
  showMessageModal() {
    this.modalService.open(this.messageModal, { size: 'lg', backdrop: 'static' });
  }


  onSearch(e) {
    this.modalService.dismissAll();
    this.loadMessageHistory();
  }

  onMessage(e: Event) {
    e.preventDefault();

    this.modalService.dismissAll();
    const message = new SmsAccountMessage(this.messageForm.value);

    this.messageService.create(message);
  }

  highlightWordsInText() {
    const params = this.searchForm.value;
    if (params.message_like) {
      const match = new RegExp(params.message_like, 'ig');
      this.messages.forEach(item => {
        item.message = item.message.replace(match, `<span class='highlight'>${params.message_like}</span>`);
      });
    }
  }

  /**
   * Shows the mobile number of the selected member
   *
   * @param orgMember Selected Member
   */
  showMobileNumber(orgMember: OrganisationMember) {
    this.messageForm.patchValue({
      to: orgMember.member.mobile_number
    });
  }
}

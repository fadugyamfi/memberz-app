import { Component, Input, OnInit } from '@angular/core';
import { OrganisationMember } from '../../../../shared/model/api/organisation-member';
import { SmsAccountMessageService } from '../../../../shared/services/api/sms-account-message.service';
import { SmsAccountService } from '../../../../shared/services/api/sms-account.service';
import { PageEvent } from '../../../../shared/components/pagination/pagination.component';
import { SmsAccount } from '../../../../shared/model/api/sms-account';
import { EventsService } from '../../../../shared/services/events.service';

@Component({
  selector: 'app-profile-sms-messages',
  templateUrl: './profile-sms-messages.component.html',
  styleUrls: ['./profile-sms-messages.component.scss']
})
export class ProfileSmsMessagesComponent implements OnInit {

  public mbsp: OrganisationMember;
  public sent_status = null;

  constructor(
    public messageService: SmsAccountMessageService,
    public smsAccountService: SmsAccountService,
    public events: EventsService
  ) { }

  ngOnInit(): void {
    this.loadMessages();

    this.events.on('SmsAccount:refresh', () => this.loadMessages());
  }

  get smsAccount(): SmsAccount {
    return this.smsAccountService.getOrganisationAccount();
  }

  @Input()
  set membership(value) {
    this.mbsp = value;
  }

  get membership(): OrganisationMember {
    return this.mbsp;
  }

  loadMessages(page = 1, limit = 15) {

    this.messageService.clearItems();

    if ( !this.smsAccount ) {
      return;
    }

    const params = {
      page,
      limit,
      sort: 'latest',
      member_id: this.membership.member_id,
      module_sms_account_id: this.smsAccount.id
    };

    if ( this.sent_status != null ) {
      params['sent_flag'] = this.sent_status;
    }

    this.messageService.getAll(params).subscribe();
  }

  onPaginate(event: PageEvent) {
    this.loadMessages(event.page, event.limit);
  }

  setSentStatus(status = null) {
    this.sent_status = status;
    this.loadMessages();
  }
}

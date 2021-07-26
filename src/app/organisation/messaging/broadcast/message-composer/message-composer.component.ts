import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { SmsBroadcast } from '../../../../shared/model/api/sms-broadcast';
import { SmsBroadcastList } from '../../../../shared/model/api/sms-broadcast-list';
import { OrganisationService } from '../../../../shared/services/api/organisation.service';
import { SmsAccountService } from '../../../../shared/services/api/sms-account.service';
import { SmsBroadcastListService } from '../../../../shared/services/api/sms-broadcast-list.service';
import { SmsBroadcastService } from '../../../../shared/services/api/sms-broadcast.service';
import { EventsService } from '../../../../shared/services/events.service';

@Component({
  selector: 'app-message-composer',
  templateUrl: './message-composer.component.html',
  styleUrls: ['./message-composer.component.scss']
})
export class MessageComposerComponent implements OnInit {

  @Output() public cancel = new EventEmitter();

  public broadcastForm: FormGroup;

  public broadcastLists: SmsBroadcastList[];

  constructor(
    public organisationService: OrganisationService,
    public broadcastListService: SmsBroadcastListService,
    public smsBroadcastService: SmsBroadcastService,
    public smsAccountService: SmsAccountService,
    public events: EventsService
  ) { }

  ngOnInit(): void {
    this.setupEvents();
    this.setupBroadcastForm();
    this.loadBroadcastLists();
  }

  setupBroadcastForm() {
    const organisation = this.organisationService.getActiveOrganisation();
    const smsAccount = this.smsAccountService.getOrganisationAccount();

    this.broadcastForm = new FormGroup({
      id: new FormControl(),
      module_sms_account_id: new FormControl(smsAccount.id, Validators.required),
      module_sms_broadcast_list_id: new FormControl('', Validators.required),
      message: new FormControl('', Validators.required),
      send_at_date: new FormControl('', [Validators.required]),
      send_at_time: new FormControl('', [Validators.required]),
      send_at: new FormControl(),
    });

  }

  setupEvents() {
    this.events.on('SmsBroadcast:created', () => {
      Swal.fire('SMS Broadcast Created Successfully', '', 'info');
      this.cancel.emit();
    });
  }

  loadBroadcastLists(page = 1, limit = 10) {
    this.broadcastListService.getAll<SmsBroadcastList[]>({
      page, limit, sort: 'name:asc'
    }).subscribe({
      next: (broadcastLists) => this.broadcastLists = broadcastLists,
      error: () => {},
      complete: () => {}
    });
  }

  cancelCompose() {
    this.cancel.emit();
  }

  onSubmit(e: Event) {
    e.preventDefault();

    Swal.fire('Creating SMS Broadcast', 'Please wait ...', 'info');
    Swal.showLoading();

    const broadcast = new SmsBroadcast(this.smsBroadcastService.removeEmpty(this.broadcastForm.value));
    broadcast.send_at = broadcast.send_at_date + ' ' + broadcast.send_at_time;

    const params = { contain: ['sms_broadcast_list'].join() };

    if (broadcast.id) {
      return this.smsBroadcastService.update(broadcast, params);
    }

    return this.smsBroadcastService.create(broadcast, params);
  }
}

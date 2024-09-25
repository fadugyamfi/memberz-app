import { AfterContentChecked, AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { SmsBroadcast } from '../../../../shared/model/api/sms-broadcast';
import { SmsBroadcastList } from '../../../../shared/model/api/sms-broadcast-list';
import { OrganisationService } from '../../../../shared/services/api/organisation.service';
import { SmsAccountService } from '../../../../shared/services/api/sms-account.service';
import { SmsBroadcastListService } from '../../../../shared/services/api/sms-broadcast-list.service';
import { SmsBroadcastService } from '../../../../shared/services/api/sms-broadcast.service';
import { EventsService } from '../../../../shared/services/events.service';
import { SmsTemplateTagService } from '../../../../shared/services/utilities/sms-template-tag.service';
import moment from 'moment';
import { OrganisationMemberCategoryService } from '../../../../shared/services/api/organisation-member-category.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-message-composer',
  templateUrl: './message-composer.component.html',
  styleUrls: ['./message-composer.component.scss']
})
export class MessageComposerComponent implements OnInit, OnDestroy {

  @Output() public cancel = new EventEmitter();
  @ViewChild('messageField', { static: true }) messageField;
  @ViewChild('composerModal', { static: true }) composerModal: any;

  public broadcastForm: UntypedFormGroup;
  public broadcastLists: SmsBroadcastList[];
  public broadcast: SmsBroadcast;
  public subscriptions: Subscription[] = [];

  private messageCharLimit = 160;
  public previews: any[] = [];
  public maxSmsChars = 480;
  public charsEntered = 0;
  public selectedList: SmsBroadcastList;
  public modalRef: NgbModalRef;
  public saveBtnText = "Send Broadcast";

  constructor(
    public organisationService: OrganisationService,
    public broadcastListService: SmsBroadcastListService,
    public smsBroadcastService: SmsBroadcastService,
    public smsAccountService: SmsAccountService,
    public events: EventsService,
    public translate: TranslateService,
    public smsTagService: SmsTemplateTagService,
    public modalService: NgbModal,
    public categoryService: OrganisationMemberCategoryService
  ) { }

  ngOnInit(): void {
    this.setupEvents();
    this.setupBroadcastForm();
    this.loadBroadcastLists();
    this.loadMembershipCategories();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  setupBroadcastForm() {
    const organisation = this.organisationService.getActiveOrganisation();
    const smsAccount = this.smsAccountService.getOrganisationAccount();

    this.broadcastForm = new UntypedFormGroup({
      id: new UntypedFormControl(),
      module_sms_account_id: new UntypedFormControl(smsAccount.id, Validators.required),
      module_sms_broadcast_list_id: new UntypedFormControl(''),
      organisation_member_category_id: new UntypedFormControl(''),
      message: new UntypedFormControl('', Validators.required),
      send_at_date: new UntypedFormControl('', [Validators.required]),
      send_at_time: new UntypedFormControl('', [Validators.required]),
      send_at: new UntypedFormControl(),
    });

    this.broadcastForm.valueChanges.subscribe(values => {
      const message = this.smsTagService.processMessageTags(values.message);
      this.previews = this.chunkMessageStrings(message, this.messageCharLimit);
      this.charsEntered  = values.message.length;

      if( values.module_sms_broadcast_list_id ) {
        this.selectedList = this.broadcastListService.getItem(values.module_sms_broadcast_list_id);
      }
    });
  }

  private chunkMessageStrings(str, size) {
    const numChunks = Math.ceil(str.length / size)
    const chunks = new Array(numChunks)

    for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
      chunks[i] = str.substr(o, size);
    }

    return chunks
  }

  setupEvents() {
    this.events.on('SmsBroadcast:created', () => {
      Swal.fire(
        this.translate.instant('SMS Broadcast Created Successfully'),
        '',
        'info'
      );
      this.cancelCompose();
    });

    this.events.on('SmsBroadcast:updated', () => {
      Swal.close();
      this.cancelCompose();
    });
  }

  loadBroadcastLists(page = 1, limit = 10) {
    const smsAccount = this.smsAccountService.getOrganisationAccount();
    const sub = this.broadcastListService.getAll({
      module_sms_account_id: smsAccount.id,
      page, limit, sort: 'name:asc'
    }).subscribe({
      next: (broadcastLists) => this.broadcastLists = broadcastLists,
      error: () => {},
      complete: () => {}
    });

    this.subscriptions.push(sub);
  }

  loadMembershipCategories() {
    const sub = this.categoryService.getAll({ limit: 1000 }).subscribe();
    this.subscriptions.push(sub);
  }

  cancelCompose() {
    this.cancel.emit();
    this.modalRef.close();
  }

  show() {
    this.setupBroadcastForm();
    this.saveBtnText = "Send Broadcast";
    this.modalRef = this.modalService.open(this.composerModal, { size: 'xl'});
  }

  onSubmit(e: Event) {
    e.preventDefault();

    if( !this.broadcastForm.valid ) {
      return;
    }

    const broadcast = new SmsBroadcast(this.smsBroadcastService.removeEmpty(this.broadcastForm.value));

    if( !broadcast.module_sms_broadcast_list_id && !broadcast.organisation_member_category_id ) {
      Swal.fire('List Required', 'Please select a broadcast or membership category', 'error');
      return;
    }

    broadcast.send_at = broadcast.send_at_date + ' ' + broadcast.send_at_time;
    broadcast.sent_offset = 0;
    broadcast.sent_pages = 0;
    broadcast.sent_count = 0;

    const params = { contain: ['sms_broadcast_list'].join() };

    if (broadcast.id) {
      Swal.fire(
        this.translate.instant('Updating SMS Broadcast'),
        this.translate.instant('Please wait') + '...',
        'info'
      );
      Swal.showLoading();

      return this.smsBroadcastService.update(broadcast, params);
    }

    Swal.fire(
      this.translate.instant('Creating SMS Broadcast'),
      this.translate.instant('Please wait') + '...',
      'info'
    );
    Swal.showLoading();

    this.smsBroadcastService.setPrepredItems(true);
    return this.smsBroadcastService.create(broadcast, params);
  }

  setBroadcast(broadcast: SmsBroadcast) {
    this.broadcast = broadcast;

    if( broadcast ) {
      this.saveBtnText = "Save Changes";
      this.setupBroadcastForm();

      const values = Object.assign({}, broadcast, {
        send_at_date: moment(broadcast.send_at).format('YYYY-MM-DD'),
        send_at_time: moment(broadcast.send_at).format('HH:mm')
      });

      this.broadcastForm.patchValue(values);
    }
  }

  getMinDateToSchedule() {
    return moment().format('YYYY-MM-DD');
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { PageEvent } from '../../../shared/components/pagination/pagination.component';
import { SmsAccount } from '../../../shared/model/api/sms-account';
import { SmsBroadcastList } from '../../../shared/model/api/sms-broadcast-list';
import { SmsAccountService } from '../../../shared/services/api/sms-account.service';
import { SmsBroadcastListService } from '../../../shared/services/api/sms-broadcast-list.service';
import { EventsService } from '../../../shared/services/events.service';

@Component({
  selector: 'app-broadcast-lists',
  templateUrl: './broadcast-lists.component.html',
  styleUrls: ['./broadcast-lists.component.scss']
})
export class BroadcastListsComponent implements OnInit {

  @ViewChild('searchModal', { static: true }) searchModal: any;
  @ViewChild('editorModal', { static: true }) editorModal: any;

  public subscriptions: Subscription[] = [];
  public broadcastLists: SmsBroadcastList[] = [];
  public searchForm: FormGroup;
  public editorForm: FormGroup;
  public listFilters;
  public selectedFilterFields = [];

  constructor(
    public smsAccountService: SmsAccountService,
    public broadcastListService: SmsBroadcastListService,
    public events: EventsService,
    public modalService: NgbModal,
    public translate: TranslateService
  ) { }

  ngOnInit() {
    this.setupEditorForm();
    this.setupSearchForm();
    this.setupEvents();
    // this.showSearchModal();
    this.findbroadcastLists();
    this.fetchFilters();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.removeEvents();
  }

  findbroadcastLists(options = {}, page = 1, limit = 15) {
    this.broadcastLists = null;
    const params = { ...options, page, limit, sort: 'name:asc' };

    const sub = this.broadcastListService.getAll(params).subscribe(broadcastLists => {
      this.broadcastLists = broadcastLists;
    });

    this.subscriptions.push(sub);
  }

  fetchFilters() {
    this.broadcastListService.getFilters().subscribe(filters => {
      this.listFilters = filters;
    });
  }

  /**
   * Sets up the search form group and validations
   */
  setupSearchForm() {
    this.searchForm = new FormGroup({
      name_like: new FormControl(''),
      sender_id_like: new FormControl('')
    });
  }

  /**
   * Shows the search modal
   */
  showSearchModal() {
    this.modalService.open(this.searchModal, {});
  }

  /**
   * Handles the searching functionality
   *
   * @param e Event
   */
  onSearch(e: Event) {
    e.preventDefault();

    const data = this.searchForm.value;

    this.findbroadcastLists(data);
    this.modalService.dismissAll();
  }

  /**
   * Handles the pagination events
   *
   * @param event PageEvent
   */
  onPaginate(event: PageEvent) {
    this.findbroadcastLists(this.searchForm.value, event.page, event.limit);
  }

  /**
   *
   */
  setupEditorForm() {
    const smsAccount: SmsAccount = this.smsAccountService.getOrganisationAccount();

    this.editorForm = new FormGroup({
      id: new FormControl(),
      name: new FormControl('', [Validators.required]),
      sender_id: new FormControl(smsAccount.sender_id, [Validators.required]),
      module_sms_account_id: new FormControl(smsAccount.id),
      size: new FormControl(0),
      filters: new FormArray([ this.createFilterGroup() ])
    });
  }

  get filterControls() {
    return (this.editorForm.controls.filters as FormArray);
  }

  createFilterGroup() {
    return new FormGroup({
      field: new FormControl(''),
      condition: new FormControl(''),
      value: new FormControl('')
    });
  }

  addFilterGroup() {
    this.filterControls.push( this.createFilterGroup() );
  }

  removeFilterGroup(index) {
    this.filterControls.removeAt(index);
    this.selectedFilterFields.splice(index, 1);

    if( this.filterControls.length == 0 ) {
      this.addFilterGroup();
    }
  }

  resetFilterGroups() {
    this.editorForm.controls.filters = new FormArray([ this.createFilterGroup() ]);
  }

  setSelectedFilterField(fieldId, index) {
    this.selectedFilterFields[index] = this.listFilters.fields.find(filter => filter.id == fieldId);
  }

  get autoGeneratingIDs() {
    return this.editorForm.controls.auto_gen_ids.value === true ? 'open' : 'closed';
  }

  get exampleID() {
    const data = this.editorForm.value;
    return `${data.id_prefix}${data.id_next_increment}${data.id_suffix}`;
  }

  /**
   *
   */
  showEditorModal(broadcastList: SmsBroadcastList = null) {
    this.setupEditorForm();

    if (broadcastList) {
      if( broadcastList.filters?.length > 1 ) {
        for(let i = 1; i < broadcastList.filters.length; i++ ) {
          this.addFilterGroup();
        }
      }

      this.editorForm.patchValue(broadcastList);
    }

    this.modalService.open(this.editorModal, { size: 'xl' });
  }

  /**
   *
   */
  onSubmit(e: Event) {
    e.preventDefault();

    if (!this.editorForm.valid) {
      return;
    }

    const broadcastList = new SmsBroadcastList(this.editorForm.value);

    if (broadcastList.id) {
      return this.broadcastListService.update(broadcastList);
    }

    return this.broadcastListService.create(broadcastList);
  }


  /**
   * Sets up event listeners
   */
  /**
   * Setup listeners for model changes
   */
  setupEvents() {
    this.events.on('SmsBroadcastList:created', () => this.modalService.dismissAll());
    this.events.on('SmsBroadcastList:updated', () => this.modalService.dismissAll());
    this.events.on('SmsBroadcastList:deleted', () => Swal.close());
  }

  /**
   * Removes event listeners
   */
  removeEvents() {
    this.events.off('SmsBroadcastList:created');
    this.events.off('SmsBroadcastList:updated');
    this.events.off('SmsBroadcastList:deleted');
  }

  previewBroadcastList(broadcastList: SmsBroadcastList) {
    console.log('preview - not implemented')
  }

  /**
   * Batch delete a select list of member records
   */
  deleteBroadcastList(broadcastList: SmsBroadcastList) {
    Swal.fire({
      title: 'Confirm Deletion',
      text: `This action will delete "${broadcastList.name}" from the database. This action currently cannot be reverted`,
      icon: 'warning',
      showCancelButton: true,
    }).then((action) => {
      if (action.value) {
        Swal.fire('Deleting broadcastList', 'Please wait ...', 'error');
        Swal.showLoading();
        this.broadcastListService.remove(broadcastList);
      }
    });
  }

}

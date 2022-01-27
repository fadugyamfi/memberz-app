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
import { ListFilterService } from '../../../shared/services/utilities/list-filter.service';

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
  public selectedBroadcastList: SmsBroadcastList;
  public searchForm: FormGroup;
  public editorForm: FormGroup;
  public selectedFilterFields = [];
  public queryExample = '';

  constructor(
    public smsAccountService: SmsAccountService,
    public broadcastListService: SmsBroadcastListService,
    public events: EventsService,
    public modalService: NgbModal,
    public translate: TranslateService,
    public listFilterService: ListFilterService
  ) { }

  ngOnInit() {
    this.setupEditorForm();
    this.setupSearchForm();
    this.setupEvents();
    // this.showSearchModal();
    this.findbroadcastLists();
    this.listFilterService.fetchFilters();
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
      sender_id: new FormControl(smsAccount?.sender_id, [Validators.required]),
      module_sms_account_id: new FormControl(smsAccount?.id),
      size: new FormControl(0),
      filters: new FormArray([ this.createFilterGroup() ])
    });

    this.editorForm.valueChanges.subscribe(values => {
      this.queryExample = this.listFilterService.getQueryExample(values.filters);
    });
  }

  get filterControls() {
    return (this.editorForm.controls.filters as FormArray);
  }

  createFilterGroup(options = { optional: false }) {
    const group = new FormGroup({
      field: new FormControl('', Validators.required),
      condition: new FormControl('', Validators.required),
      value: new FormControl('', Validators.required),
      optional: new FormControl(options.optional ? 1 : 0)
    });

    group.valueChanges.subscribe(values => {
      this.queryExample = this.listFilterService.getQueryExample(this.editorForm.value.filters);
    });

    return group;
  }

  addFilterGroup() {
    this.filterControls.push( this.createFilterGroup() );
  }

  addOptionalFilterGroup() {
    this.filterControls.push( this.createFilterGroup({ optional: true }) );
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

  clearFilterGroups() {
    this.editorForm.controls.filters = new FormArray([]);
  }

  /**
   *
   */
  showEditorModal(broadcastList: SmsBroadcastList = null) {
    this.setupEditorForm();
    this.selectedBroadcastList = broadcastList;

    if (broadcastList) {
      if( broadcastList.filters?.length > 0 ) {
        this.clearFilterGroups();

        for(let i = 0; i < broadcastList.filters.length; i++ ) {
          this.addFilterGroup();
        }
      }

      this.editorForm.patchValue(broadcastList);
      this.queryExample = this.listFilterService.getQueryExample(this.editorForm.value.filters);
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

  /**
   * Batch delete a select list of member records
   */
  deleteBroadcastList(broadcastList: SmsBroadcastList) {
    Swal.fire({
      title: this.translate.instant('Confirm Deletion'),
      text: this.translate.instant(`This action will delete :name from the database. This action currently cannot be reverted`, { name: broadcastList.name }),
      icon: 'warning',
      showCancelButton: true,
    }).then((action) => {
      if (action.value) {
        Swal.fire(
          this.translate.instant('Deleting broadcastList'),
          this.translate.instant('Please wait') + ' ...',
          'error'
        );
        Swal.showLoading();
        this.broadcastListService.remove(broadcastList);
      }
    });
  }

}
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { OrganisationAnniversaryService } from '../../../shared/services/api/organisation-anniversary.service';
import { EventsService } from '../../../shared/services/events.service';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PageEvent } from '../../../shared/components/pagination/pagination.component';
import Swal from 'sweetalert2';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { TranslateService } from '@ngx-translate/core';
import { OrganisationAnniversary } from 'src/app/shared/model/api/organisation-anniversary';
import { OrganisationService } from 'src/app/shared/services/api/organisation.service';

@Component({
  selector: 'app-anniversaries',
  templateUrl: './anniversaries.component.html',
  styleUrls: ['./anniversaries.component.scss'],
  animations: [
    trigger('showFormGroup', [
      state('open', style({
        display: 'flex',
        opacity: 1,
      })),
      state('closed', style({
        opacity: 0,
        display: 'none'
      })),
      transition('* => closed', [
        animate('0.5s')
      ]),
      transition('* => open', [
        animate('0.5s')
      ]),
    ]),
  ]
})
export class AnniversariesComponent implements OnInit, OnDestroy {

  @ViewChild('searchModal', { static: true }) searchModal: any;
  @ViewChild('editorModal', { static: true }) editorModal: any;
  @ViewChild('messageModal', { static: true }) messageModal: any;

  public subscriptions: Subscription[] = [];
  public anniversaries: OrganisationAnniversary[] = [];
  public searchForm: FormGroup;
  public anniversaryMessage: string = "";
  public editorForm: FormGroup;

  constructor(
    public anniversaryService: OrganisationAnniversaryService,
    public events: EventsService,
    public modalService: NgbModal,
    public translate: TranslateService,
    private orgService: OrganisationService
  ) { }

  ngOnInit() {
    this.setupEditorForm();
    this.setupSearchForm();
    this.setupEvents();
    // this.showSearchModal();
    this.findAnniversaries();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.removeEvents();
  }

  findAnniversaries(options = {}, page = 1, limit = 15) {
    this.anniversaries = null;

    const sub = this.anniversaryService.findAnniversaries(options, page, limit).subscribe(anniversaries => {
      this.anniversaries = anniversaries;
    });

    this.subscriptions.push(sub);
  }

  /**
   * Sets up the search form group and validations
   */
  setupSearchForm() {
    this.searchForm = new FormGroup({
      name_like: new FormControl(''),
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

    this.findAnniversaries(data);
    this.modalService.dismissAll();
  }

  /**
   * Handles the pagination events
   *
   * @param event PageEvent
   */
  onPaginate(event: PageEvent) {
    this.findAnniversaries(this.searchForm.value, event.page, event.limit);
  }

  /**
   *
   */
  setupEditorForm() {
    this.editorForm = new FormGroup({
      id: new FormControl(),
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', []),
      show_on_reg_forms: new FormControl(false),
      send_anniversary_message: new FormControl(false),
      notify_on_anniversary: new FormControl(false),
      message: new FormControl('', [Validators.required]),
      organisation_id: new FormControl(this.orgService.activeOrganisation.id),
      active: new FormControl(false)
    });
  }


  showEditorModal(anniversary: OrganisationAnniversary = null) {
    this.setupEditorForm();

    if (anniversary) {
      this.editorForm.patchValue(anniversary);
    }

    this.modalService.open(this.editorModal, { size: 'lg' });
  }

  showMessageModal(message) {
    this.anniversaryMessage = message;
    this.modalService.open(this.messageModal, { size: 'lg' });
  }

  /**
   *
   */
  onSubmit(e: Event) {
    e.preventDefault();

    if (!this.editorForm.valid) {
      return;
    }

    const anniversary = new OrganisationAnniversary(this.editorForm.value);

    if (anniversary.id) {
      return this.anniversaryService.update(anniversary);
    }

    return this.anniversaryService.create(anniversary);
  }

  /**
   * Setup listeners for model changes
   */
  setupEvents() {
    this.events.on('OrganisationAnniversary:created', () => this.modalService.dismissAll());
    this.events.on('OrganisationAnniversary:updated', () => this.modalService.dismissAll());
    this.events.on('OrganisationAnniversary:deleted', () => Swal.close());
  }

  /**
   * Removes event listeners
   */
  removeEvents() {
    this.events.off('OrganisationAnniversary:created');
    this.events.off('OrganisationAnniversary:updated');
    this.events.off('OrganisationAnniversary:deleted');
  }

  /**
   * Batch delete a select list of member records
   */
  deleteAnniversary(anniversary: OrganisationAnniversary) {
    Swal.fire({
      title: this.translate.instant('Confirm Deletion'),
      text: this.translate.instant(`This action will delete record from the database. This action currently cannot be reverted`, { name: anniversary.name }),
      icon: 'warning',
      showCancelButton: true,
    }).then((action) => {
      if (action.value) {
        Swal.fire(
          this.translate.instant('Deleting anniversary'),
          this.translate.instant('Please wait') +  ' ...',
          'error'
        );
        Swal.showLoading();
        this.anniversaryService.remove(anniversary);
      }
    });
  }

}
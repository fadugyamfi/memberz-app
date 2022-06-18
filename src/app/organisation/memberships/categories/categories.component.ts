import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { OrganisationMemberCategoryService } from '../../../shared/services/api/organisation-member-category.service';
import { EventsService } from '../../../shared/services/events.service';
import { Subscription } from 'rxjs';
import { OrganisationMemberCategory } from '../../../shared/model/api/organisation-member-category';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PageEvent } from '../../../shared/components/pagination/pagination.component';
import Swal from 'sweetalert2';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
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
export class CategoriesComponent implements OnInit, OnDestroy {

  @ViewChild('searchModal', { static: true }) searchModal: any;
  @ViewChild('editorModal', { static: true }) editorModal: any;

  public subscriptions: Subscription[] = [];
  public categories: OrganisationMemberCategory[] = [];
  public searchForm: UntypedFormGroup;
  public editorForm: UntypedFormGroup;

  constructor(
    public categoryService: OrganisationMemberCategoryService,
    public events: EventsService,
    public modalService: NgbModal,
    public translate: TranslateService
  ) { }

  ngOnInit() {
    this.setupEditorForm();
    this.setupSearchForm();
    this.setupEvents();
    // this.showSearchModal();
    this.findCategories();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.removeEvents();
  }

  findCategories(options = {}, page = 1, limit = 15) {
    this.categories = null;

    const sub = this.categoryService.findCategories(options, page, limit).subscribe(categories => {
      this.categories = categories;
    });

    this.subscriptions.push(sub);
  }

  /**
   * Sets up the search form group and validations
   */
  setupSearchForm() {
    this.searchForm = new UntypedFormGroup({
      name_like: new UntypedFormControl(''),
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

    this.findCategories(data);
    this.modalService.dismissAll();
  }

  /**
   * Handles the pagination events
   *
   * @param event PageEvent
   */
  onPaginate(event: PageEvent) {
    this.findCategories(this.searchForm.value, event.page, event.limit);
  }

  /**
   *
   */
  setupEditorForm() {
    this.editorForm = new UntypedFormGroup({
      id: new UntypedFormControl(),
      name: new UntypedFormControl('', [Validators.required]),
      description: new UntypedFormControl('', []),
      default: new UntypedFormControl(''),
      auto_gen_ids: new UntypedFormControl(),
      id_prefix: new UntypedFormControl(),
      id_next_increment: new UntypedFormControl(1, [Validators.pattern('[0-9]*')]),
      id_suffix: new UntypedFormControl('')
    });
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
  showEditorModal(category: OrganisationMemberCategory = null) {
    this.setupEditorForm();

    if (category) {
      this.editorForm.patchValue(category);
    }

    this.modalService.open(this.editorModal, { size: 'lg' });
  }

  /**
   *
   */
  onSubmit(e: Event) {
    e.preventDefault();

    if (!this.editorForm.valid) {
      return;
    }

    const category = new OrganisationMemberCategory(this.editorForm.value);

    this.resetFlags(category);

    if (category.id) {
      return this.categoryService.update(category);
    }

    return this.categoryService.create(category);
  }

  resetFlags(category: OrganisationMemberCategory) {
    if (category.default === 1) {
      this.categories.forEach(cat => {
        if (cat.id !== category.id) {
          cat.default = 0;
        }
      });
    }
  }

  /**
   * Setup listeners for model changes
   */
  setupEvents() {
    this.events.on('OrganisationMemberCategory:created', () => this.modalService.dismissAll());
    this.events.on('OrganisationMemberCategory:updated', () => this.modalService.dismissAll());
    this.events.on('OrganisationMemberCategory:deleted', () => Swal.close());
  }

  /**
   * Removes event listeners
   */
  removeEvents() {
    this.events.off('OrganisationMemberCategory:created');
    this.events.off('OrganisationMemberCategory:updated');
    this.events.off('OrganisationMemberCategory:deleted');
  }

  /**
   * Batch delete a select list of member records
   */
  deleteCategory(category: OrganisationMemberCategory) {
    Swal.fire({
      title: this.translate.instant('Confirm Deletion'),
      text: this.translate.instant(`This action will delete record from the database. This action currently cannot be reverted`, { name: category.name }),
      icon: 'warning',
      showCancelButton: true,
    }).then((action) => {
      if (action.value) {
        Swal.fire(
          this.translate.instant('Deleting Category'),
          this.translate.instant('Please wait') +  ' ...',
          'error'
        );
        Swal.showLoading();
        this.categoryService.remove(category);
      }
    });
  }
}

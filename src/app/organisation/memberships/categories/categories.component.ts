import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { OrganisationMemberCategoryService } from '../../../shared/services/cakeapi/organisation-member-category.service';
import { EventsService } from '../../../shared/services/events.service';
import { Subscription } from 'rxjs';
import { OrganisationMemberCategory } from '../../../shared/model/cakeapi/organisation-member-category';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PageEvent } from '../../../shared/components/pagination/pagination.component';
import Swal from 'sweetalert2';
import { trigger, state, style, transition, animate } from '@angular/animations';

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
  public searchForm: FormGroup;
  public editorForm: FormGroup;

  constructor(
    public categoryService: OrganisationMemberCategoryService,
    public events: EventsService,
    public modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.setupEditorForm();
    this.setupSearchForm();
    this.setupEvents();
    //this.showSearchModal();
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

    let data = this.searchForm.value;

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
    this.editorForm = new FormGroup({
      id: new FormControl(),
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', []),
      default: new FormControl(''),
      auto_gen_ids: new FormControl(),
      id_prefix: new FormControl(),
      id_next_increment: new FormControl(1, [Validators.pattern('[0-9]*')]),
      id_suffix: new FormControl('')
    });
  }

  get autoGeneratingIDs() {
    return this.editorForm.controls.auto_gen_ids.value == true ? 'open' : 'closed';
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

    if( category ) {
      this.editorForm.patchValue(category);
    }

    this.modalService.open(this.editorModal, { size: 'lg' });
  }

  /**
   *
   */
  onSubmit(e: Event) {
    e.preventDefault();

    if( !this.editorForm.valid ) {
      return;
    }

    let category = new OrganisationMemberCategory(this.editorForm.value);

    this.resetFlags(category);

    if( category.id ) {
      return this.categoryService.update(category);
    }

    return this.categoryService.create(category);
  }

  resetFlags(category: OrganisationMemberCategory) {
    if( category.default == 1 ) {
      this.categories.forEach(cat => {
        if( cat.id != category.id ) {
          cat.default = 0;
        }
      })
    }
  }

  /**
   * Sets up event listeners
   */
  /**
   * Setup listeners for model changes
   */
  setupEvents() {
    this.events.on('OrganisationMemberCategory:created', (category) => {
      this.categories.push(category);
      this.modalService.dismissAll();
    });

    this.events.on('OrganisationMemberCategory:updated', (category) => {
      this.modalService.dismissAll();
      this.categories.forEach((g, index) => {
        if (g.id === category.id) {
          this.categories[index] = category;
          return false;
        }
      });
    });

    this.events.on('OrganisationMemberCategory:deleted', (category) => {
      Swal.close();
      this.categories.forEach((g, index) => {
        if (g.id === category.id) {
          this.categories.splice(index, 1);
          return false;
        }
      });
    });
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
      title: 'Confirm Deletion',
      text: `This action will delete "${category.name}" from the database. This action currently cannot be reverted`,
      icon: 'warning',
      showCancelButton: true,
    }).then((action) => {
      if (action.value) {
        Swal.fire('Deleting Category', 'Please wait ...', 'error');
        Swal.showLoading();
        this.categoryService.remove(category);
      }
    });
  }
}

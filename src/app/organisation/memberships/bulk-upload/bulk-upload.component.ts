import Swal from 'sweetalert2';
import { ExcelService } from './../../../shared/services/excel.service';
import { BulkUploadService } from './../../../shared/services/api/bulkupload.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { UntypedFormGroup, UntypedFormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { OrganisationMemberCategoryService } from '../../../shared/services/api/organisation-member-category.service';
import { OrganisationFileImportService } from '../../../shared/services/api/organisation-file-import.service';
import { OrganisationMemberCategory } from '../../../shared/model/api/organisation-member-category';
import { OrganisationFileImport } from '../../../shared/model/api/organisation-file-import';
import { EventsService } from '../../../shared/services/events.service';
import { OrganisationService } from '../../../shared/services/api/organisation.service';
import { PageEvent, PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { NgIf, NgFor } from '@angular/common';
import { UploadReviewComponent } from './upload-review/upload-review.component';

@Component({
    selector: 'app-bulk-upload',
    templateUrl: './bulk-upload.component.html',
    styleUrls: ['./bulk-upload.component.scss'],
    standalone: true,
    imports: [NgIf, NgFor, PaginationComponent, UploadReviewComponent, FormsModule, ReactiveFormsModule, TranslateModule]
})
export class BulkUploadComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('uploadModal', { static: true }) uploadModal: any;
  @ViewChild('editorModal', { static: true }) editorModal: any;

  public isActive = false;
  public infoMessage = '';
  public bulkUploads = [];
  public uploadForm: UntypedFormGroup;
  public uploadTypes = ['category', 'member'];
  private subscriptions: Subscription[] = [];
  public categories: OrganisationMemberCategory[] = [];

  public selectedFileImport: OrganisationFileImport;

  constructor(
    public bulkuploadService: BulkUploadService,
    private modalService: NgbModal,
    private categoryService: OrganisationMemberCategoryService,
    public fileImportService: OrganisationFileImportService,
    private events: EventsService,
    private organisationService: OrganisationService,
    public translate: TranslateService
  ) { }

  ngOnInit() {
    this.setupEvents();
    this.setupUploadForm();
    this.fetchCategories();
    this.fetchImports();
  }

  ngAfterViewInit() {
    this.events.trigger('OrganisationFileImport:paging', this.fileImportService.pagingMeta);
  }

  setupEvents() {
    this.events.on('OrganisationFileImport:created', (fileImport: OrganisationFileImport) => {
      this.modalService.dismissAll();
      Swal.fire('Data Imported!', 'Your file has been imported.', 'success');
      Swal.hideLoading();
    });

    this.events.on(`OrganisationFileImport:create:error`, () => Swal.close());
    this.events.on('OrganisationFileImport:deleted', () => Swal.close());
  }

  removeEvents() {
    this.events.off([
      'OrganisationFileImport:created',
      'OrganisationFileImport:create:error',
      'OrganisationFileImport:deleted'
    ]);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.removeEvents();
  }

  fetchCategories() {
    const sub = this.categoryService.findCategories({}, 1, 100).subscribe((categories) => {
      this.categories = categories;
    });

    this.subscriptions.push(sub);
  }

  fetchImports(page = 1, limit = 30) {
    const sub = this.fileImportService.setPrepredItems(true).getAll({
      limit,
      page,
      sort: 'latest'
    }).subscribe();

    this.subscriptions.push(sub);
  }

  /**
   * Handles the pagination events
   *
   * @param event PageEvent
   */
  onPaginate(event: PageEvent) {
    this.fetchImports(event.page, event.limit);
  }

  isArray(item) {
    return Array.isArray(item);
  }

  showUploadModal() {
    this.isActive = false;
    this.bulkuploadService.excelData = null;
    this.modalService.open(this.uploadModal, { size: 'lg' });
  }

  resetModal() {
    this.uploadForm.reset();
    this.isActive = false;
    this.infoMessage = '';
    this.bulkuploadService.isValid = false;
    this.bulkuploadService.excelData = null;
  }

  importFile(event) {
    this.infoMessage = 'Generating Preview...';
    this.bulkuploadService.importMembershipTemplate(event);
    this.infoMessage = '';
  }

  // importFileMulSheet(event) {
  //   this.infoMessage = 'Generating Preview...';
  //   this.excelService.importMultiSheet(
  //     event
  //   );
  //   this.infoMessage = '';
  // }

  onSubmit(e: Event) {
    e.preventDefault();

    Swal.fire({
      title: this.translate.instant('Are you sure you want to import this data?'),
      text: this.translate.instant(`You won't be able to revert this!`),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: this.translate.instant('Yes, import it!'),
      cancelButtonColor: '#dd3333',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          this.translate.instant('Uploading File'),
          this.translate.instant('Please wait as the file is uploaded'),
          'info'
        );
        Swal.showLoading();
        const importFile = new OrganisationFileImport(this.uploadForm.value);
        this.fileImportService.createWithUpload(importFile);
      }
    });
  }

  private setupUploadForm() {
    this.uploadForm = new UntypedFormGroup({
      organisation_id: new UntypedFormControl(this.organisationService.getActiveOrganisation().id),
      import_to_id: new UntypedFormControl('', Validators.required),
      file: new UntypedFormControl('', Validators.required),
      import_file: new UntypedFormControl('', Validators.required),
      import_type: new UntypedFormControl('members'),
    });
  }

  onFileChange(event) {

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadForm.patchValue({
        import_file: file
      });
    }
  }

  /**
   * Batch delete a select list of member records
   */
  deleteFileImport(fileImport: OrganisationFileImport) {
    Swal.fire({
      title: this.translate.instant('Confirm Deletion'),
      text: this.translate.instant(`This action will delete this file import from the database. This action currently cannot be reverted`),
      icon: 'warning',
      showCancelButton: true,
    }).then((action) => {
      if (action.value) {
        Swal.fire(
          this.translate.instant('Deleting File Import'),
          this.translate.instant('Please wait') + ' ...',
          'error'
        );
        Swal.showLoading();
        this.fileImportService.remove(fileImport);
      }
    });
  }

  reviewingImport(): boolean {
    return this.selectedFileImport != null;
  }

  reviewImport(fileImport: OrganisationFileImport) {
    this.selectedFileImport = fileImport;
  }

  clearImportReview() {
    this.selectedFileImport = null;
    setTimeout(() => {
      this.events.trigger('OrganisationFileImport:paging', this.fileImportService.pagingMeta);
    }, 100);
  }
}

import Swal from 'sweetalert2';
import { ExcelService } from './../../../shared/services/excel.service';
import { BulkUploadService } from './../../../shared/services/api/bulkupload.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { OrganisationMemberCategoryService } from '../../../shared/services/api/organisation-member-category.service';
import { OrganisationFileImportService } from '../../../shared/services/api/organisation-file-import.service';
import { OrganisationMemberCategory } from '../../../shared/model/api/organisation-member-category';
import { OrganisationFileImport } from '../../../shared/model/api/organisation-file-import';
import { EventsService } from '../../../shared/services/events.service';

@Component({
  selector: 'app-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BulkUploadComponent implements OnInit, OnDestroy {
  @ViewChild('uploadModal', { static: true }) uploadModal: any;
  @ViewChild('editorModal', { static: true }) editorModal: any;

  public isActive = false;
  public infoMessage = '';
  public bulkUploads = [];
  public uploadForm: FormGroup;
  public uploadTypes = ['category', 'member'];
  private subscriptions: Subscription[] = [];
  public categories: OrganisationMemberCategory[] = [];

  constructor(
    public bulkuploadService: BulkUploadService,
    private modalService: NgbModal,
    private categoryService: OrganisationMemberCategoryService,
    public fileImportService: OrganisationFileImportService,
    private events: EventsService
  ) {}

  ngOnInit() {
    this.setupEvents();
    this.setupUploadForm();
    this.fetchCategories();
    this.fetchImports();
  }

  setupEvents() {
    this.events.on('OrganisationFileImport:created', (fileImport: OrganisationFileImport) => {
      this.modalService.dismissAll();
      Swal.fire("Data Imported!", "Your file has been imported.", "success");
      Swal.hideLoading();
    });

    this.events.on('OrganisationFileImport:deleted', (fileImport: OrganisationFileImport) => {
      Swal.close();
    });
  }

  removeEvents() {
    this.events.off('OrganisationFileImport:created');
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

  fetchImports() {
    const sub = this.fileImportService.getAll<OrganisationFileImport[]>({
      limit: 20,
      sort: 'latest'
    }).subscribe((imports: OrganisationFileImport[]) => {
      // this.imports = imports;
    });

    this.subscriptions.push(sub);
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
      title: "Are you sure you want to import this data?",
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Yes, import it!',
      cancelButtonColor: '#dd3333',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Uploading File", "Please wait as the file is uploaded", "info");
        Swal.showLoading();
        const importFile = new OrganisationFileImport(this.uploadForm.value);
        this.fileImportService.createWithUpload(importFile);
      }
    });
  }

  private setupUploadForm() {
    this.uploadForm = new FormGroup({
      import_to_id: new FormControl('', Validators.required),
      file: new FormControl('', Validators.required),
      import_file: new FormControl('', Validators.required),
      import_type: new FormControl('members'),
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

  badgeClasses(fileImport: OrganisationFileImport) {
    return {
      'bg-success': fileImport.import_status == 'completed',
      'bg-warning': fileImport.import_status == 'pending',
      'bg-danger': fileImport.import_status == 'failed'
    };
  }

  /**
   * Batch delete a select list of member records
   */
   deleteFileImport(fileImport: OrganisationFileImport) {
    Swal.fire({
      title: 'Confirm Deletion',
      text: `This action will delete this file import from the database. This action currently cannot be reverted`,
      icon: 'warning',
      showCancelButton: true,
    }).then((action) => {
      if (action.value) {
        Swal.fire('Deleting File Import', 'Please wait ...', 'error');
        Swal.showLoading();
        this.fileImportService.remove(fileImport);
      }
    });
  }
}

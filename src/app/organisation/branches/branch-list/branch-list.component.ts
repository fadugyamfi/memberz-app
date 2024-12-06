import { Component, ViewChild } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { OrganisationBranchService } from '../../../shared/services/api/organisation-branch.service';
import { Observable } from 'rxjs';
import { OrganisationBranch } from '../../../shared/model/api/organisation-branch';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { EventsService } from '../../../shared/services/events.service';
import { FormControl, FormArray, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrganisationService } from '../../../shared/services/api/organisation.service';
import { Organisation } from '../../../shared/model/api/organisation';
import { ProfileImageComponent } from '../../../shared/components/profile-view/profile-image/profile-image.component';
import { LoadingRotateDashedComponent } from '../../../shared/components/forms/loading-rotate-dashed/loading-rotate-dashed.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { OrganisationControlComponent } from '../../../shared/components/forms/organisation-control/organisation-control.component';
import { MemberControlComponent } from '../../../shared/components/forms/member-control/member-control.component';

@Component({
    selector: 'app-branch-list',
    templateUrl: './branch-list.component.html',
    styleUrl: './branch-list.component.scss',
    imports: [
        ProfileImageComponent,
        LoadingRotateDashedComponent,
        PaginationComponent,
        FormsModule,
        ReactiveFormsModule,
        OrganisationControlComponent,
        MemberControlComponent,
        AsyncPipe,
        TranslateModule
    ]
})
export class BranchListComponent {

  @ViewChild('searchModal', { static: true }) searchModal: any;
  @ViewChild('editorModal', { static: true }) editorModal: any;
  
  public branches$: Observable<OrganisationBranch[]>;
  public editorForm: FormGroup = new FormGroup({});

  public mode: 'pending' | 'connecting' | 'creating' = 'pending';
  public branchOrganisation?: Organisation;

  public constructor(
    public organisationService: OrganisationService,
    public branchService: OrganisationBranchService,
    public events: EventsService,
    public modalService: NgbModal,
    public translate: TranslateService,
  ) {

  }

  public ngOnInit() {
    this.setupEditorForm();
    this.fetchBranches();
  }

  public fetchBranches() {
    this.branches$ = this.branchService.getAll();
  }

  public showEditorModal() {
    this.modalService.open(this.editorModal, { size: 'lg' });
  }
  
  /**
   *
   */
  setupEditorForm() {
    const activeOrganisation = this.organisationService.getActiveOrganisation();

    this.editorForm = new FormGroup({
      id: new FormControl(),
      organisation_id: new FormControl( activeOrganisation.id ),
      branch_organisation_id: new FormControl(),
      primary_member_id: new FormControl(),
      secondary_member_id: new FormControl(),
      tags: new FormArray([])
    });
  }

  setModeToConnecting() {
    this.mode = 'connecting';
  }

  setModeToCreating() {
    this.mode = 'creating';
  }

  isConnecting() {
    return this.mode == 'connecting';
  }

  isCreating() {
    return this.mode == 'creating';
  }

  /**
   * Shows the search modal
   */
  showSearchModal() {
    this.modalService.open(this.searchModal, {});
  }

  onPaginate(_event) {

  }

  onSubmit(_event) {
    
  }

  setSelectedBranch(organisation: Organisation) {
    this.branchOrganisation = organisation;
  }
}

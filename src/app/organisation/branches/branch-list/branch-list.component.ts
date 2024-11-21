import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganisationBranchService } from '../../../shared/services/api/organisation-branch.service';
import { Observable } from 'rxjs';
import { OrganisationBranch } from '../../../shared/model/api/organisation-branch';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { EventsService } from '../../../shared/services/events.service';
import { FormControl, FormArray, FormGroup, Validators } from '@angular/forms';
import { OrganisationService } from '../../../shared/services/api/organisation.service';
import { Organisation } from '../../../shared/model/api/organisation';

@Component({
  selector: 'app-branch-list',
  standalone: false,
  templateUrl: './branch-list.component.html',
  styleUrl: './branch-list.component.scss'
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

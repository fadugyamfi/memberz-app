import { Component, OnInit, viewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { PageEvent, PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { OrganisationRegistrationForm } from '../../../shared/model/api/organisation-registration-form';
import { OrganisationRegistrationFormService } from '../../../shared/services/api/organisation-registration-form.service';
import { EventsService } from '../../../shared/services/events.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Router, RouterLink } from '@angular/router';
import { OrganisationService } from '../../../shared/services/api/organisation.service';
import { Organisation } from '../../../shared/model/api/organisation';
import { DecimalPipe, DatePipe } from '@angular/common';
import { LoadingRotateDashedComponent } from '../../../shared/components/forms/loading-rotate-dashed/loading-rotate-dashed.component';


@Component({
    selector: 'app-registration-forms',
    templateUrl: './registration-forms.component.html',
    styleUrls: ['./registration-forms.component.scss'],
    imports: [LoadingRotateDashedComponent, RouterLink, PaginationComponent, DecimalPipe, DatePipe, TranslateModule]
})
export class RegistrationFormsComponent implements OnInit {

  readonly editorModal = viewChild<any>('editorModal');

  public forms: OrganisationRegistrationForm[] = [];
  public organisation: Organisation;

  constructor(
    public registrationFormService: OrganisationRegistrationFormService,
    public events: EventsService,
    public translate: TranslateService,
    public router: Router,
    public organisationService: OrganisationService
  ) { }

  ngOnInit(): void {
    this.loadRegistrationForms();
    this.setupEvents();

    this.organisation = this.organisationService.getActiveOrganisation();
  }

  loadRegistrationForms(page = 1, limit = 10) {
    this.registrationFormService.getAll({
      page, limit,
      count: ['registrants', 'approved-registrants', 'unapproved-registrants'].join(',')
    }).subscribe(forms => {
      this.forms = forms;
    });
  }

  onPaginate(event: PageEvent) {
    this.loadRegistrationForms(event.page, event.limit);
  }

  editForm(form: OrganisationRegistrationForm) {
    this.registrationFormService.setSelectedModel(form);
    this.router.navigate(['/organisation/memberships/registration-forms/edit', form.id]);
  }

  setupEvents() {
    this.events.on('OrganisationRegistrationForm:deleted', (form: OrganisationRegistrationForm) => {
      Swal.close();
    });
  }

  /**
   * Batch delete a select list of member records
   */
  deleteForm(form: OrganisationRegistrationForm) {
    Swal.fire({
      title: this.translate.instant('Confirm Deletion'),
      text: this.translate.instant(`This action will delete this record from the database. This action currently cannot be reverted`),
      icon: 'warning',
      showCancelButton: true,
    }).then((action) => {
      if (action.value) {
        Swal.fire(
          this.translate.instant('Deleting Registration Form'),
          this.translate.instant('Please wait') + ' ...',
          'error'
        );
        Swal.showLoading();
        this.registrationFormService.remove(form);
      }
    });
  }
}

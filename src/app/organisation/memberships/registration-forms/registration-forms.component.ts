import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PageEvent } from '../../../shared/components/pagination/pagination.component';
import { OrganisationRegistrationForm } from '../../../shared/model/api/organisation-registration-form';
import { OrganisationRegistrationFormService } from '../../../shared/services/api/organisation-registration-form.service';
import { EventsService } from '../../../shared/services/events.service';

@Component({
  selector: 'app-registration-forms',
  templateUrl: './registration-forms.component.html',
  styleUrls: ['./registration-forms.component.scss']
})
export class RegistrationFormsComponent implements OnInit {

  @ViewChild('editorModal', { static: true }) editorModal: any;

  public forms: OrganisationRegistrationForm[] = [];

  constructor(
    public registrationFormService: OrganisationRegistrationFormService,
    private modalService: NgbModal,
    public events: EventsService
  ) { }

  ngOnInit(): void {
    this.loadRegistrationForms();
  }

  loadRegistrationForms(page = 1, limit = 10) {
    this.registrationFormService.getAll({ page, limit, count: 'organisation-members' }).subscribe(forms => {
      this.forms = forms;
    });
  }

  onPaginate(event: PageEvent) {
    this.loadRegistrationForms(event.page, event.limit);
  }
}

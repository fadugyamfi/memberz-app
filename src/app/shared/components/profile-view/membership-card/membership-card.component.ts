import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Organisation } from '../../../model/api/organisation';
import { OrganisationMember } from '../../../model/api/organisation-member';
import { OrganisationService } from '../../../services/api/organisation.service';

@Component({
  selector: 'app-membership-card',
  templateUrl: './membership-card.component.html',
  styleUrls: ['./membership-card.component.scss']
})
export class MembershipCardComponent implements OnInit {

  @Input() membership: OrganisationMember;

  public modalRef: NgbModalRef;
  public organisation: Organisation;

  constructor(
    public modalService: NgbModal,
    public organisationService: OrganisationService
  ) { }

  ngOnInit(): void {
    this.organisation = this.organisationService.getActiveOrganisation();
  }
}

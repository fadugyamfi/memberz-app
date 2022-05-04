import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Organisation } from '../../../model/api/organisation';
import { OrganisationMember } from '../../../model/api/organisation-member';
import { OrganisationService } from '../../../services/api/organisation.service';

@Component({
  selector: 'app-membership-card-modal',
  templateUrl: './membership-card-modal.component.html',
  styleUrls: ['./membership-card-modal.component.scss']
})
export class MembershipCardModalComponent implements OnInit {

  @ViewChild('cardModal', { static: true }) modal: any;
  @Input() membership: OrganisationMember;

  public modalRef: NgbModalRef;

  constructor(
    public modalService: NgbModal
  ) { }

  ngOnInit(): void {
  }

  show() {
    this.modalRef = this.modalService.open(this.modal, { size: 'lg' })
  }

  hide() {
    this.modalRef.close();
  }

}

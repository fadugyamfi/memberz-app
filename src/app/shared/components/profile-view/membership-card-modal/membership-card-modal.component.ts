import { Component, OnInit, ViewChild, input } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Organisation } from '../../../model/api/organisation';
import { OrganisationMember } from '../../../model/api/organisation-member';
import { OrganisationService } from '../../../services/api/organisation.service';
import { MembershipCardComponent } from '../membership-card/membership-card.component';
import { NgxPrintDirective } from 'ngx-print';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-membership-card-modal',
    templateUrl: './membership-card-modal.component.html',
    styleUrls: ['./membership-card-modal.component.scss'],
    imports: [MembershipCardComponent, NgxPrintDirective, TranslateModule]
})
export class MembershipCardModalComponent implements OnInit {

  @ViewChild('cardModal', { static: true }) modal: any;
  readonly membership = input<OrganisationMember>(undefined);

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

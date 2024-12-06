import { Component, OnInit, ViewChild, input } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Organisation } from '../../../model/api/organisation';
import { OrganisationMember } from '../../../model/api/organisation-member';
import { OrganisationService } from '../../../services/api/organisation.service';
import { AvatarModule } from 'ngx-avatars';
import { QrCodeModule } from 'ng-qrcode';
import { UpperCasePipe, DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-membership-card',
    templateUrl: './membership-card.component.html',
    styleUrls: ['./membership-card.component.scss'],
    imports: [AvatarModule, QrCodeModule, UpperCasePipe, DatePipe, TranslateModule]
})
export class MembershipCardComponent implements OnInit {

  readonly membership = input<OrganisationMember>(undefined);

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

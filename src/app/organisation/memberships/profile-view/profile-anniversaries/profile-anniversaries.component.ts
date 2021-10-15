import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { EventsService } from '../../../../shared/services/events.service';
import { OrganisationMemberAnniversaryService } from '../../../../shared/services/api/organisation-member-anniversary.service';
import { OrganisationMember } from '../../../../shared/model/api/organisation-member';
import { OrganisationMemberAnniversary } from 'src/app/shared/model/api/organisation-member-anniversary';

@Component({
  selector: 'app-profile-anniversaries',
  templateUrl: './profile-anniversaries.component.html',
  styleUrls: ['./profile-anniversaries.component.scss']
})
export class ProfileAnniversariesComponent implements OnInit {

  public subscriptions: Subscription[] = [];
  public mbsp: OrganisationMember;
  public selectedAnniversary: OrganisationMemberAnniversary;
  // @ViewChild('familyMemberEditor', { static: true }) familyMemberEditor: FamilyMemberEditorComponent;

  constructor(
    public modalService: NgbModal,
    public events: EventsService,
    public $t: TranslateService,
    public anniversaryService : OrganisationMemberAnniversaryService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.loadAnniversaries();
    this.setupEvents();
  }

  setupEvents() {}

  loadAnniversaries() {
    const sub = this.anniversaryService.getAll({
      organisation_member_id: this.membership.member_id
    }).subscribe();

    this.subscriptions.push(sub);
  }

  @Input()
  set membership(value) {
    this.mbsp = value;
  }

  get membership(): OrganisationMember {
    return this.mbsp;
  }

  addAnniversary() {
    this.selectedAnniversary = null;
    // this.familyMemberEditor.open({ reset: true });
  }

}

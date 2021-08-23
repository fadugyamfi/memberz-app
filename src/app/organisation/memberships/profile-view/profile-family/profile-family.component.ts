import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { OrganisationMember } from '../../../../shared/model/api/organisation-member';
import { MemberRelationService } from '../../../../shared/services/api/member-relation.service';
import { EventsService } from '../../../../shared/services/events.service';

@Component({
  selector: 'app-profile-family',
  templateUrl: './profile-family.component.html',
  styleUrls: ['./profile-family.component.scss']
})
export class ProfileFamilyComponent implements OnInit, OnDestroy {

  @ViewChild('familyMemberEditor', { static: true }) familyMemberEditor: any;

  public mbsp: OrganisationMember;
  public subscriptions: Subscription[] = [];

  constructor(
    public memberRelationService: MemberRelationService,
    public modalService: NgbModal,
    public events: EventsService
  ) { }

  ngOnInit(): void {
    this.loadRelations();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  @Input()
  set membership(value) {
    this.mbsp = value;
  }

  get membership(): OrganisationMember {
    return this.mbsp;
  }

  loadRelations() {
    const sub = this.memberRelationService.getAll({
      member_id: this.membership.member_id
    }).subscribe();

    this.subscriptions.push(sub);
  }

  addFamilyMember() {
    this.familyMemberEditor.open();
  }

  editFamilyMember() {
    this.familyMemberEditor.open();
  }
}

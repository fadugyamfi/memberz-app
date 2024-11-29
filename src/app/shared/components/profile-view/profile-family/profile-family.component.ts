import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { MemberRelation } from '../../../../shared/model/api/member-relation';
import { OrganisationMember } from '../../../../shared/model/api/organisation-member';
import { MemberRelationService } from '../../../../shared/services/api/member-relation.service';
import { EventsService } from '../../../../shared/services/events.service';
import { FamilyMemberEditorComponent } from './family-member-editor/family-member-editor.component';
import { NgIf, NgFor, AsyncPipe, DatePipe } from '@angular/common';
import { AvatarModule } from 'ngx-avatars';
import { ViewProfileDirective } from '../../../directives/view-profile.directive';

@Component({
    selector: 'app-profile-family',
    templateUrl: './profile-family.component.html',
    styleUrls: ['./profile-family.component.scss'],
    standalone: true,
    imports: [NgIf, NgFor, AvatarModule, ViewProfileDirective, FamilyMemberEditorComponent, AsyncPipe, DatePipe, TranslateModule]
})
export class ProfileFamilyComponent implements OnInit, OnDestroy {

  @ViewChild('familyMemberEditor', { static: true }) familyMemberEditor: FamilyMemberEditorComponent;

  public mbsp: OrganisationMember;
  public selectedRelation: MemberRelation;
  public subscriptions: Subscription[] = [];
  public $relations;

  constructor(
    public relationService: MemberRelationService,
    public modalService: NgbModal,
    public events: EventsService,
    public $t: TranslateService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.loadRelations();
    this.setupEvents();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.removeEvents();
  }

  @Input()
  set membership(value) {
    this.mbsp = value;
  }

  get membership(): OrganisationMember {
    return this.mbsp;
  }

  setupEvents() {
    this.events.on('MemberRelation:deleted', () => Swal.close());
  }

  removeEvents() {
    this.events.off('MemberRelation:deleted');
  }

  loadRelations() {
    this.$relations = this.relationService.getAll({ member_id: this.membership.member_id });
  }

  addFamilyMember() {
    this.selectedRelation = null;
    this.familyMemberEditor.open({ reset: true });
  }

  editFamilyMember(relation) {
    this.selectedRelation = relation;
    this.familyMemberEditor.open({ relation });
  }

  deleteRelation(relation: MemberRelation) {
    Swal.fire({
      title: this.$t.instant('Confirm Deletion'),
      text: this.$t.instant(`This action will delete the selected family member and cannot be reverted`),
      icon: 'warning',
      showCancelButton: true,
    }).then((action) => {
      if (action.value) {
        Swal.fire(
          this.$t.instant('Deleting Relation'),
          this.$t.instant('Please wait') + '...',
          'error'
        );
        Swal.showLoading();
        this.relationService.remove(relation);
      }
    });
  }

  loadRelativeProfile(relation: MemberRelation) {
    Swal.fire(
      this.$t.instant('Loading Profile'),
      this.$t.instant('Please wait') + '...',
      'info'
    );
    Swal.showLoading();

    this.router.navigate(['/organisation/memberships/view', relation.relative_organisation_member_id]);
  }
}

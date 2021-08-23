import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { OrganisationMember } from '../../../../../shared/model/api/organisation-member';

@Component({
  selector: 'app-family-member-editor',
  templateUrl: './family-member-editor.component.html',
  styleUrls: ['./family-member-editor.component.scss']
})
export class FamilyMemberEditorComponent implements OnInit {

  @ViewChild('editor', { static: true }) editor: any;

  public profileForm: FormGroup;
  public membershipForm: FormGroup;

  public mbshp: OrganisationMember;
  public subscriptions: Subscription[] = [];
  public editorTitle = 'Edit Member Profile';
  public editorIcon = 'fa-user-plus';

  constructor(
    public modalService: NgbModal,
  ) { }

  ngOnInit(): void {
  }

  onSubmit(e) {

  }

  cancel() {

  }

  open() {
    this.modalService.open(this.editor);
  }
}

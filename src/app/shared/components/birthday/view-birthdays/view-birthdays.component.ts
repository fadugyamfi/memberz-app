import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { OrganisationMemberService } from 'src/app/shared/services/api/organisation-member.service';

@Component({
  selector: 'app-view-birthdays',
  templateUrl: './view-birthdays.component.html',
  styleUrls: ['./view-birthdays.component.scss']
})
export class ViewBirthdaysComponent implements OnInit {

  constructor(
    public organisationMemberService: OrganisationMemberService
  ) { }

  ngOnInit(): void {
  }

  findBirthdays(){
    return [];
  }

}

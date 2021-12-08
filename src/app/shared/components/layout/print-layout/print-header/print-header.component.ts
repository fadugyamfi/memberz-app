import { Component, OnInit } from '@angular/core';
import { Organisation } from 'src/app/shared/model/api/organisation';
import { OrganisationService } from 'src/app/shared/services/api/organisation.service';

@Component({
  selector: 'app-print-header',
  templateUrl: './print-header.component.html',
  styleUrls: ['./print-header.component.scss']
})
export class PrintHeaderComponent implements OnInit {
  public org: Organisation;

  constructor(
    public orgService: OrganisationService
  ) { }

  ngOnInit(): void {
    this.org = this.orgService.getActiveOrganisation();
  }

}

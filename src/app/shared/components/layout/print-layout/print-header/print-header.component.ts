import { Component, OnInit } from '@angular/core';
import { Organisation } from '../../../../model/api/organisation';
import { OrganisationService } from '../../../../services/api/organisation.service';
import { TitleCasePipe } from '@angular/common';

@Component({
    selector: 'app-print-header',
    templateUrl: './print-header.component.html',
    styleUrls: ['./print-header.component.scss'],
    standalone: true,
    imports: [TitleCasePipe]
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

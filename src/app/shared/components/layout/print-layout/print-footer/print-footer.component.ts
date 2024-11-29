import { Component, OnInit } from '@angular/core';
import { Organisation } from '../../../../model/api/organisation';
import { OrganisationService } from '../../../../services/api/organisation.service';
import { PrintService } from '../../../../services/print.service';
import { NgIf, TitleCasePipe } from '@angular/common';

@Component({
    selector: 'app-print-footer',
    templateUrl: './print-footer.component.html',
    styleUrls: ['./print-footer.component.scss'],
    standalone: true,
    imports: [NgIf, TitleCasePipe]
})
export class PrintFooterComponent implements OnInit {
  public org: Organisation;

  constructor(
    public orgService: OrganisationService,
    public printService: PrintService
  ) { }

  ngOnInit(): void {
    this.org = this.orgService.getActiveOrganisation();
  }

}

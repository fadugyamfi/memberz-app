import { Component, OnInit } from '@angular/core';
import { Organisation } from 'src/app/shared/model/api/organisation';
import { OrganisationService } from 'src/app/shared/services/api/organisation.service';
import { PrintService } from 'src/app/shared/services/print.service';

@Component({
  selector: 'app-print-footer',
  templateUrl: './print-footer.component.html',
  styleUrls: ['./print-footer.component.scss']
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

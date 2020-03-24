import { Component, OnInit, ElementRef } from '@angular/core';
import { InvoiceService } from '../../../shared/services/e-commerce/invoice.service';
import { Invoice } from '../../../shared/model/e-commerce/invoice.model';
import { OrganisationInvoiceService } from '../../../shared/services/cakeapi/organisation-invoice.service';
import { ActivatedRoute } from '@angular/router';
import { OrganisationInvoice } from '../../../shared/model/cakeapi/organisation-invoice';
import { Organisation } from '../../../shared/model/cakeapi/organisation';
import { OrganisationService } from '../../../shared/services/cakeapi/organisation.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})

export class InvoiceComponent implements OnInit {

  public date: Date = new Date();
  public invoice: OrganisationInvoice;
  public organisation: Organisation;

  constructor(
    public invoiceService: OrganisationInvoiceService,
    public organisationService: OrganisationService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.organisation = this.organisationService.getActiveOrganisation();

    const invoice_id = this.route.snapshot.paramMap.get('id');
    this.invoiceService.getById(invoice_id).subscribe((invoice: OrganisationInvoice) => this.invoice = invoice);
  }
}

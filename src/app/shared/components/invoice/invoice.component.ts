import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { OrganisationInvoiceService } from '../../services/api/organisation-invoice.service';
import { OrganisationInvoice } from '../../model/api/organisation-invoice';
import { Organisation } from '../../model/api/organisation';
import { OrganisationService } from '../../services/api/organisation.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { NgxPrintDirective } from 'ngx-print';

// TODO: Implement HTML to PDF - https://codingdiksha.com/convert-html-table-to-pdf-using-html2pdf-angular/

@Component({
    selector: 'app-invoice',
    templateUrl: './invoice.component.html',
    styleUrls: ['./invoice.component.scss'],
    imports: [NgxPrintDirective, CurrencyPipe, DatePipe]
})

export class InvoiceComponent implements OnInit {

  @ViewChild('invoiceModal') invoiceModal: ElementRef;

  public date: Date = new Date();
  public invoice: OrganisationInvoice;
  public organisation: Organisation;

  constructor(
    public invoiceService: OrganisationInvoiceService,
    public organisationService: OrganisationService,
    public modalService: NgbModal
  ) { }

  ngOnInit() {

  }

  showInvoice(invoice_id: number) {
    this.invoice = null;
    this.modalService.open(this.invoiceModal, { size: 'lg' });

    this.organisation = this.organisationService.getActiveOrganisation();
    this.invoiceService.getById(invoice_id).subscribe((invoice: OrganisationInvoice) => this.invoice = invoice);
  }
}

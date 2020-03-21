import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { OrganisationInvoice } from '../../model/cakeapi/organisation-invoice';
import { StorageService } from '../storage.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrganisationInvoiceService extends APIService {

  constructor(http: HttpClient, protected events: EventsService, protected storage: StorageService) {
    super(http, events, storage);

    this.url = '/organisation_invoices';
    this.model = OrganisationInvoice;
    this.model_name = 'OrganisationInvoice';
  }

  getByInvoiceNo(invoice_no: string) {
    const params = {
      invoice_no: invoice_no,
      limit: 1
    };

    return this.getAll(params).pipe(map( (invoices: OrganisationInvoice[]) => {
      return invoices[0];
    } ));
  }
}

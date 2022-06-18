import { Injectable, Inject } from '@angular/core';
import {
  SlydepayConfig,
  SlydepayResponse,
  ListPayOptionsResult,
  CreateInvoiceResult,
  SendInvoice,
  CheckPaymentStatus,
  Transaction,
  Invoice
} from './slydepay.models';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SlydepayMockService } from './slydepay-mock.service';


@Injectable({
  providedIn: 'root'
})
export class SlydepayService {

  private baseUrl = 'https://app.slydepay.com.gh/api/merchant';
  private redirectUrl = 'https://app.slydepay.com/paylive/detailsnew.aspx';
  private mode = 'live';

  constructor(
    @Inject('config') private config: SlydepayConfig,
    private http: HttpClient,
    private mock: SlydepayMockService
  ) { }

  setMockMode() {
    this.mode = 'mock';
  }

  setLiveMode() {
    this.mode = 'live';
  }

  isInMockMode() {
    return this.mode == 'mock';
  }

  getMode() {
    return this.mode;
  }

  getlistOptions(): Observable<SlydepayResponse<ListPayOptionsResult>> {
    return this.http.post<SlydepayResponse<ListPayOptionsResult>>(
      `${this.baseUrl}/invoice/payoptions`,
      this.config
    );
  }

  createInvoice(
    invoice: Invoice
  ): Observable<SlydepayResponse<CreateInvoiceResult>> {
    if( this.isInMockMode() ) {
      return this.mock.createInvoice(invoice);
    }

    return this.http.post<SlydepayResponse<CreateInvoiceResult>>(
      `${this.baseUrl}/invoice/create`,
      invoice
    );
  }

  createInvoiceAndSend(
    invoice: SendInvoice
  ): Observable<SlydepayResponse<CreateInvoiceResult>> {
    if( this.isInMockMode() ) {
      return this.mock.createInvoiceAndSend(invoice);
    }

    return this.http.post<SlydepayResponse<CreateInvoiceResult>>(
      `${this.baseUrl}/invoice/create`,
      invoice
    );
  }

  sendInvoice(options: SendInvoice): Observable<any> {
    if( this.isInMockMode() ) {
      return this.mock.sendInvoice(options);
    }

    return this.http.post(`${this.baseUrl}/invoice/send`, options);
  }

  checkPaymentStatus(
    options: CheckPaymentStatus
  ): Observable<SlydepayResponse<string>> {
    if( this.isInMockMode() ) {
      return this.mock.checkPaymentStatus(options);
    }

    return this.http.post<SlydepayResponse<string>>(
      `${this.baseUrl}/invoice/checkstatus`,
      options
    );
  }

  confirmTransaction(
    options: Transaction
  ): Observable<SlydepayResponse<string>> {
    if( this.isInMockMode() ) {
      return this.mock.confirmTransaction(options);
    }

    return this.http.post<SlydepayResponse<string>>(
      `${this.baseUrl}/transaction/confirm`,
      options
    );
  }

  cancelTransaction(
    options: Transaction
  ): Observable<SlydepayResponse<string>> {
    if( this.isInMockMode() ) {
      return this.mock.cancelTransaction(options);
    }

    return this.http.post<SlydepayResponse<string>>(
      `${this.baseUrl}/transaction/confirm`,
      options
    );
  }

  redirectToPayLive(paytoken: string, returnUrl: string = null) {
    // window.location.href = `${this.redirectUrl}?pay_token=${paytoken}&call_back=${returnUrl}`;
    window.open(`${this.redirectUrl}?pay_token=${paytoken}&call_back=${returnUrl}`, '_blank');
  }
}

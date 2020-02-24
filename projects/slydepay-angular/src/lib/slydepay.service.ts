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


@Injectable({
  providedIn: 'root'
})
export class SlydepayService {

  private baseUrl = 'https://app.slydepay.com.gh/api/merchant';
  private redirectUrl = 'https://app.slydepay.com/paylive/detailsnew.aspx';

  constructor(
    @Inject('config') private config: SlydepayConfig,
    private http: HttpClient
  ) { }

  getlistOptions(): Observable<SlydepayResponse<ListPayOptionsResult>> {
    return this.http.post<SlydepayResponse<ListPayOptionsResult>>(
      `${this.baseUrl}/invoice/payoptions`,
      this.config
    );
  }

  createInvoice(
    invoice: Invoice
  ): Observable<SlydepayResponse<CreateInvoiceResult>> {
    return this.http.post<SlydepayResponse<CreateInvoiceResult>>(
      `${this.baseUrl}/invoice/create`,
      invoice
    );
  }

  createInvoiceAndSend(
    invoice: SendInvoice
  ): Observable<SlydepayResponse<CreateInvoiceResult>> {
    return this.http.post<SlydepayResponse<CreateInvoiceResult>>(
      `${this.baseUrl}/invoice/create`,
      invoice
    );
  }

  sendInvoice(options: SendInvoice): Observable<any> {
    return this.http.post(`${this.baseUrl}/invoice/send`, options);
  }

  checkPaymentStatus(
    options: CheckPaymentStatus
  ): Observable<SlydepayResponse<string>> {
    return this.http.post<SlydepayResponse<string>>(
      `${this.baseUrl}/invoice/checkstatus`,
      options
    );
  }

  confirmTransaction(
    options: Transaction
  ): Observable<SlydepayResponse<string>> {
    return this.http.post<SlydepayResponse<string>>(
      `${this.baseUrl}/transaction/confirm`,
      options
    );
  }

  cancelTransaction(
    options: Transaction
  ): Observable<SlydepayResponse<string>> {
    return this.http.post<SlydepayResponse<string>>(
      `${this.baseUrl}/transaction/confirm`,
      options
    );
  }

  redirectToPayLive(paytoken: string, returnUrl: string = null) {
    window.location.href = `${this.redirectUrl}?pay_token=${paytoken}&call_back=${returnUrl}`;
  }
}

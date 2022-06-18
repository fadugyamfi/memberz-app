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
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SlydepayMockService {

  private baseUrl = 'https://app.slydepay.com.gh/api/merchant';
  private redirectUrl = 'https://app.slydepay.com/paylive/detailsnew.aspx';
  private mode = 'live';

  constructor(
    @Inject('config') private config: SlydepayConfig,
    private http: HttpClient
  ) { }

  setMockMode() {
    this.mode = 'mock';
  }

  setLiveMode() {
    this.mode = 'live';
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
    return of({
      success: true,
      errorMessage: null,
      errorCode: null,
      result: {
        orderCode: invoice.orderCode,
        payToken: '123-123-123=' + (Math.random() * 100000),
        description: 'Mock Invoice',
        qrCodeUrl: 'http://localhost',
        fullDiscountAmount: '0',
        discounts: []
      }
    });
  }

  createInvoiceAndSend(
    invoice: SendInvoice
  ): Observable<SlydepayResponse<CreateInvoiceResult>> {
    return of({
      success: true,
      errorMessage: null,
      errorCode: null,
      result: {
        orderCode: '123',
        payToken: '123-123-123',
        description: 'Mock Invoice',
        qrCodeUrl: 'http://localhost',
        fullDiscountAmount: '0',
        discounts: []
      }
    });
  }

  sendInvoice(options: SendInvoice): Observable<any> {
    return this.http.post(`${this.baseUrl}/invoice/send`, options);
  }

  checkPaymentStatus(
    options: CheckPaymentStatus
  ): Observable<SlydepayResponse<string>> {
    return of({
      success: true,
      errorMessage: null,
      errorCode: null,
      result: 'CONFIRMED'
    });
  }

  confirmTransaction(
    options: Transaction
  ): Observable<SlydepayResponse<string>> {
    return of({
      success: true,
      errorMessage: null,
      errorCode: null,
      result: 'CONFIRMED'
    });
  }

  cancelTransaction(
    options: Transaction
  ): Observable<SlydepayResponse<string>> {
    return of({
      success: true,
      errorMessage: null,
      errorCode: null,
      result: 'CANCELLED'
    });
  }

  redirectToPayLive(paytoken: string, returnUrl: string = null) {
    // window.location.href = `${this.redirectUrl}?pay_token=${paytoken}&call_back=${returnUrl}`;
    window.open(`${this.redirectUrl}?pay_token=${paytoken}&call_back=${returnUrl}`, '_blank');
  }
}

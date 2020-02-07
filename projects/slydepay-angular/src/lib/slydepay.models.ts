export interface SlydepayConfig {
  emailOrMobileNumber: string;
  merchantKey: string;
}

export interface SlydepayResponse<T> {
  success: boolean;
  errorMessage: string;
  errorCode: string;
  result: T;
}

export interface CreateInvoiceResult {
  orderCode: string;
  payToken: string;
  description: string;
  qrCodeUrl: string;
  fullDiscountAmount: string;
  discounts: string[];
}

export interface ListPayOptionsResult {
  name: string;
  shortName: string;
  maximumAmount: string;
  active: boolean;
  reason: string;
  logourl: string;
}

export interface Invoice {
  amount: number;
  orderCode: string;
  descritpion?: string;
  orderItems?: OrderItem[];
}

export interface SendInvoice extends Invoice {
  sendInvoice: boolean;
  payOption: string;
  customerName: string;
  customerEmail?: string;
  customerMobileNumber?: string;
}

export interface OrderItem {
  itemCode: string;
  itemName: string;
  unitPrice: number;
  quantity: number;
  subTotal: number;
}

export interface CheckPaymentStatus {
  orderCode?: string;
  payToken?: string;
  confirmTransaction: boolean;
}

export interface Transaction {
  orderCode?: string;
  payToken?: string;
  transaction?: boolean;
}

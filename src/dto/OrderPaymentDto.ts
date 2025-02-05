import {OrderLine} from "./ERPOrderLineDto";

export interface OrderPaymentDto {
  trxId: string;
  invoiceUrl: string;
  paymentType: PaymentMethod;
  paymentAmount: number;
  paidItems: OrderLine[];
  trxHash?: string;
}

export enum PaymentMethod {
  VISA = 'VIS',
  MASTERCARD = 'ECA',
  POSTCARD = 'PAP',
  TWINT = 'TWI',
  CRYPTO = 'CRYPTO',
  POSTFINANCE = 'PFC',
}
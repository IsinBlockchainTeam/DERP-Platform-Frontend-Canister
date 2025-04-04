import { InvoiceItemDto } from "./Invoices";

export enum PaymentMethod {
  VISA = 'VIS',
  MASTERCARD = 'ECA',
  POSTCARD = 'PAP',
  TWINT = 'TWI',
  CRYPTO = 'CRYPTO',
  POSTFINANCE = 'PFC',
}

export interface PaymentDto {
    id: number;
    payerAddress?: string;
    payeeAddress?: string;
    amount: number;
    currency: string;
    paymentTargets: InvoiceItemDto[];
    externalId: string;
    paymentType: PaymentMethod;
    date: Date;
    transactionId: string;
}
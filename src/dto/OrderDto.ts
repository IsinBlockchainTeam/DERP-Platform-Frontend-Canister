import { ErpOrderStatus, WondType } from "../model/WondType";

export interface OrderTotalDto {
  total: number;
  vat: number;
  currency: string;
}

export interface OrderDto {
  erpType: WondType;
  id: string;
  storeName: string;
  status: ErpOrderStatus;
  tableId?: string;
  tableLabel?: string;
  date: Date;
  trxHash?: string;
}

export enum TransactionStatus {
  SETTLED = 'settled',
  PENDING = 'pending',
  FAILED = 'failed',
  CANCELED = 'canceled',
  TRANSMITTED = 'transmitted',
}
export interface TransactionStatusDto {
  id: number;
  status: TransactionStatus;
  invoiceUrl?: string;
}


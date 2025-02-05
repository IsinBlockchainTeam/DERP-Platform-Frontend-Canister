import {WondType} from "../../model/WondType";

export interface CustomerLoginDto {
  storeUrl: string;
  erpType?: WondType;
  erpUrl?: string;
  tableId: string;
}
export interface CustomerLoginWithTrxIdDto {
  transactionId: string;
}
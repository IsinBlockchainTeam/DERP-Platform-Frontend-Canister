import { AccountingTransactionType } from "@derp/company-canister";

export type ListAccountingTransactionQuery = {
    dateFrom?: Date;

    dateTo?: Date;

    storeId?: number;
};

export type GetAccountingTransactionQuery = {
    type: AccountingTransactionType;
};
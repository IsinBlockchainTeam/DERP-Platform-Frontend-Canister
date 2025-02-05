import { AccountingTransaction } from '../model/AccountingTransaction';

export type RegisterAccountingTransactionRequest<
    T extends AccountingTransaction = AccountingTransaction,
> = Omit<T, 'Header'> & {
    Header: Omit<T['Header'], 'DLTERPId'>;
};

export type ListAccountingTransactionQuery = {
    dateFrom?: Date;

    dateTo?: Date;

    storeUrl?: string;
};

export type GetAccountingTransactionQuery = {
    storeUrl: string;
};
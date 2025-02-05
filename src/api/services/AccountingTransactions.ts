import { GetAccountingTransactionQuery, ListAccountingTransactionQuery } from '../../dto/AccountingTransactionDto';
import { AccountingTransaction } from '../../model/AccountingTransaction';
import api from '../api';
import { auth } from '../auth';

export const accountingTransactionService = {
    async listAccountingTransactions(
        query: ListAccountingTransactionQuery,
    ): Promise<AccountingTransaction[]> {
        const resp = await api.get<AccountingTransaction[]>(
            '/accounting-transactions',
            {
                headers: await auth.authenticatedHeaders(),
                params: query,
            },
        );

        const trxs = resp.data.map((trx) => {
            (trx.Header as any).IssueDate = new Date(trx.Header.IssueDate?.toISOString() || "");
            if (trx.Header.ValueDate)
                (trx.Header as any).ValueDate = new Date(trx.Header.ValueDate);

            return trx;
        });

        return trxs;
    },
    async getAccountingTransaction(
        query: GetAccountingTransactionQuery,
        id: string
    ): Promise<AccountingTransaction> {
        const resp = await api.get<AccountingTransaction>(
            `/accounting-transactions/${id}`,
            {
                headers: await auth.authenticatedHeaders(),
                params: query,
            },
        );

        const trx = resp.data;

        (trx.Header as any).IssueDate = new Date(trx.Header.IssueDate?.toISOString() || "");
        if (trx.Header.ValueDate)
            (trx.Header as any).ValueDate = new Date(trx.Header.ValueDate);

        return trx;
    }
};

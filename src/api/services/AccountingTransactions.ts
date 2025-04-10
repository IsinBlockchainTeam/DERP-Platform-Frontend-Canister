import { AccountingTransaction, AccountingTransactionType } from '@derp/company-canister';
import { GetAccountingTransactionQuery, ListAccountingTransactionQuery } from '../../dto/AccountingTransactionDto';
import api from '../api';
import { auth } from '../auth';
import { accountingTransactionClient } from '../icp';

export const accountingTransactionService = {
    async listAccountingTransactions(
        query: ListAccountingTransactionQuery,
    ): Promise<AccountingTransaction[]> {
        const tickets = await accountingTransactionClient.listTicketTransactions(query.dateFrom, query.dateTo);
        const invoices = await accountingTransactionClient.listInvoiceTransactions(query.dateFrom, query.dateTo);
        const bankings = await accountingTransactionClient.listBankTransactions(query.dateFrom, query.dateTo);

        return [
            ...tickets,
            ...invoices,
            ...bankings,
        ]
    },

    async getAccountingTransaction(
        query: GetAccountingTransactionQuery,
        id: string
    ): Promise<AccountingTransaction> {
        switch (query.type) {
            case AccountingTransactionType.TICKET:
                return await accountingTransactionClient.getTicketTransactionById(id);
            case AccountingTransactionType.INVOICE:
                return await accountingTransactionClient.getInvoiceTransactionById(id);
            case AccountingTransactionType.BANK_TRX:
                return await accountingTransactionClient.getBankTransactionById(id);
            default:
                throw new Error('Unknown transaction type');
        }
    },

    async downloadOriginalXML(
        id: string
    ): Promise<void> {
        const res = await api.get(`/accounting-transactions/${id}/xml`, {
            headers: await auth.authenticatedHeaders(),
            responseType: 'blob',
        })

        const blob = new Blob([res.data], { type: 'application/xml' });
        const contentDisposition = res.headers['content-disposition'];
        const filename = contentDisposition
            ? contentDisposition.split('filename=')[1].replace(/"/g, '')
            : `transaction-${id}.xml`;

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;

        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    }
};

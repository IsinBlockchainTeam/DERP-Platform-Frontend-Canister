import { AccountingTransaction, AccountingTransactionType, InvoiceAccountingTransaction } from '@derp/company-canister';
import { GetAccountingTransactionQuery, ListAccountingTransactionQuery } from '../../dto/AccountingTransactionDto';
import api from '../api';
import { auth } from '../auth';
import { accountingTransactionClient } from '../icp';
import Store from '../../store/store';
import { StoreDto } from '../../dto/stores/StoreDto';

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
    
    async listTransactionIDs(
        query: ListAccountingTransactionQuery,
    ): Promise<{
        type: "ticket" | "invoice" | "bank",
        id: string,
    }[]> {
        const tickets = await accountingTransactionClient.getTransactionIds("ticket", query.dateFrom, query.dateTo);
        const invoices = await accountingTransactionClient.getTransactionIds("invoice", query.dateFrom, query.dateTo);
        const bankings = await accountingTransactionClient.getTransactionIds("bank", query.dateFrom, query.dateTo);
        
        const ticketRet = tickets.map((ticket) => ({
            id: ticket,
            type: "ticket" as const,
        }));

        const invoiceRet = invoices.map((invoice) => ({
            id: invoice,
            type: "invoice" as const,
        }));
        
        const bankingRet = bankings.map((banking) => ({
            id: banking,
            type: "bank" as const,
        }));

        return [
            ...ticketRet,
            ...invoiceRet,
            ...bankingRet,
        ]
    },

    async listSuppliersInvoicesByStore(store: StoreDto): Promise<InvoiceAccountingTransaction[]> {
        const transactions = await accountingTransactionClient.listInvoiceTransactions();
        return transactions.filter((transaction) => Number(transaction.Buyer.ID) === store.id);
    },

    async listInvoicesByStore(store:StoreDto): Promise<InvoiceAccountingTransaction[]> {
        const transactions = await accountingTransactionClient.listInvoiceTransactions();
        return transactions.filter((transaction) => Number(transaction.Seller.ID) === store.id);
    },
    
    async getTransactionsByIDs(
        ids: {
            type: "ticket" | "invoice" | "bank",
            id: string,
        }[],
        dateFrom?: Date,
        dateTo?: Date,
    ): Promise<AccountingTransaction[]> {
        console.log(ids);
        console.log(dateFrom);
        console.log(dateTo);

        const ticketIds = ids.filter((id) => id.type === "ticket").map((id) => id.id);
        const invoiceIds = ids.filter((id) => id.type === "invoice").map((id) => id.id);
        const bankIds = ids.filter((id) => id.type === "bank").map((id) => id.id);

        const tickets = await accountingTransactionClient.getTransactionsByIds("ticket", ticketIds);
        const invoices = await accountingTransactionClient.getTransactionsByIds("invoice", invoiceIds);
        const bankings = await accountingTransactionClient.getTransactionsByIds("bank", bankIds);

        let result = [...tickets, ...invoices, ...bankings];
        if (dateFrom) {
            result = result.filter((transaction) => transaction.Header.IssueDate && transaction.Header.IssueDate >= dateFrom);
        }
        if (dateTo) {
            result = result.filter((transaction) => transaction.Header.IssueDate && transaction.Header.IssueDate <= dateTo);
        }

        return result;
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

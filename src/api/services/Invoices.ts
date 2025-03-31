import api from "../api";
import {InvoiceDto, InvoiceList} from "../../dto/Invoices";
import {auth} from "../auth";


export const invoicesService = {
    listMyInvoices: async (storeId?: number): Promise<InvoiceDto[]> => {
        let params = {}
        if(storeId) {
            params = {storeId}
        }

        const resp = await api<InvoiceList<InvoiceDto>>('/api/invoices/incoming', {
            params,
            headers: await auth.authenticatedHeaders()
        });

        return resp.data.invoices.map(invoice => ({
            ...invoice,
            issueDate: new Date(invoice.issueDate),
            expiryDate: new Date(invoice.expiryDate)
        }));
    }
}

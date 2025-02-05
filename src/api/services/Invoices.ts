import api from "../api";
import {InvoiceDto, InvoiceList} from "../../dto/Invoices";
import {auth} from "../auth";


export const invoicesService = {
    listMyInvoices: async (storeUrl?: string): Promise<InvoiceDto[]> => {
        let params = {}
        if(storeUrl) {
            params = {storeUrl}
        }

        const resp = await api<InvoiceList<InvoiceDto>>('/api/invoices/incoming', {
            params,
            headers: await auth.authenticatedHeaders()
        });

        return resp.data.invoices;
    }
}

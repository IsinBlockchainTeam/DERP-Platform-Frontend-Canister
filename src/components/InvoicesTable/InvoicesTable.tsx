import { useTranslation } from "react-i18next";
import { InvoiceWithStore } from "../../dto/Invoices";
import { useNavigate, useSearchParams } from "react-router-dom";
import GenericTable, { GenericTableColumn, GenericTableAction } from "../Table/GenericTable";

export interface Props {
    invoices: InvoiceWithStore[];
}

export const InvoicesTable = ({ invoices }: Props) => {
    const { t } = useTranslation(undefined, { keyPrefix: 'supplierInvoices.invoicesTable' });
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const companyId = params.get('companyId');

    const onPreviewInvoice = (invoice: InvoiceWithStore) => {
        const urlParams = params;
        console.log(invoice)
        urlParams.set('pdfUrl', invoice.pdfUrls[0])
        navigate(`/merchant/${companyId}/stores/store/invoices/invoice?` + urlParams.toString())
    }

    const invoiceColumns: GenericTableColumn<InvoiceWithStore>[] = [
        {
            header: t('idLabel'),
            accessor: (invoice) => invoice.id.toString()
        },
        {
            header: t('supplierLabel'),
            accessor: (invoice) => invoice.supplier?.name
        },
        {
            header: t('issuedLabel'),
            accessor: (invoice) => new Date(invoice.issueTimestamp).toLocaleDateString()
        },
        {
            header: t('expirationLabel'),
            accessor: (invoice) => new Date(invoice.expirationTimestamp).toLocaleDateString()
        },
        {
            header: t('totalLabel'),
            accessor: (invoice) => invoice.totalGross.toString()
        }
    ]

    const invoiceActions: GenericTableAction<InvoiceWithStore>[] = [
        {
            label: <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                    stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
            </>,
            onClick: (invoice) => onPreviewInvoice(invoice)
        }
    ]

    return <div className="flex w-full flex-col">
        <GenericTable data={invoices} columns={invoiceColumns} actions={invoiceActions} />
    </div>
}

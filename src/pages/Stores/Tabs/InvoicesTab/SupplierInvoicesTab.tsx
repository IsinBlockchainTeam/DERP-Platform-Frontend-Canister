import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { InvoiceDto, InvoiceWithStore } from "../../../../dto/Invoices";
import { invoicesService } from "../../../../api/services/Invoices";
import LoadingSpinner from "../../../../components/Loading/LoadingSpinner";
import { InvoicesTable } from "../../../../components/InvoicesTable/InvoicesTable";
import { parseSearchParamSafe, useStoreId } from "../../../../utils";
import { useSearchParams } from "react-router-dom";
import { storeService } from "../../../../api/services/Store";
import { GenericTableColumn } from "../../../../components/Table/GenericTable";
import TabTitle from "../../../../components/Tabs/TabTitle";

export const SupplierInvoicesTab = () => {
    const storeId = useStoreId();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState<boolean>(false);
    const [invoices, setInvoices] = useState<InvoiceWithStore[]>([]);
    const { t } = useTranslation(undefined, { keyPrefix: 'supplierInvoices' });


    useEffect(() => {
        const fetchInvoices = async () => {
            const invoices = await invoicesService.listMyInvoices(storeId) as InvoiceDto[];
            const stores = await Promise.all(
                invoices.map(async invoice => {
                    return await storeService.getStore(invoice.storeId);
                })
            )

            const processedInvoices = invoices.map(invoice => {
                return {
                    ...invoice,
                    store: stores.find(s => s.id === invoice.storeId)
                } as InvoiceWithStore;
            });

            setInvoices(processedInvoices);
        }
        setLoading(true);
        fetchInvoices().finally(() => setLoading(false));
    }, [searchParams]);


    return <div className='flex flex-col w-full'>
            <TabTitle title={t('title')} />
            {
                loading ?
                    <LoadingSpinner /> :
                    invoices?.length ?
                        <InvoicesTable invoices={invoices} />
                        :
                        <p>{t('noInvoices')}</p>
            }
        </div>

}

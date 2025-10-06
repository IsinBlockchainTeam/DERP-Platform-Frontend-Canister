import React, { useEffect, useState } from 'react';
import { storeService } from '../../api/services/Store';
import { StoreDto } from '../../dto/stores/StoreDto';
import { useParams } from 'react-router-dom';
import { useStoreId } from '../../utils';
import StoreHeader from '../Stores/StoreHeader';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';
import { InvoiceAccountingTransaction } from '@derp/company-canister';
import { accountingTransactionService } from '../../api/services/AccountingTransactions';
import { Eye } from 'lucide-react';


export const InvoiceOverview = () => {
    const [store, setStore] = useState<StoreDto>();
    const { merchantId } = useParams<{ merchantId: string }>();
    const storeId = useStoreId();
    const [invoices, setInvoices] = useState<InvoiceAccountingTransaction[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);


    useEffect(() => {
        storeService.list(merchantId).then((stores) => {
            const store = stores.find(s => s.id === storeId);
            if (store)
                setStore(store);
        })
        const fetchInvoices = async () => {
            const invoices = await accountingTransactionService.listMyInvoices();
            setInvoices(invoices);
        }
        setIsLoading(true);
        fetchInvoices().finally(() => setIsLoading(false));
    }, [storeId])


    return <div className={"mx-5 pb-5"}>
        {store ? <div className={"flex flex-col gap-10"}>
                <StoreHeader store={store} />
            <div className={'flex w-full card p-5 bordered flex-col gap-2'}>
                <div className={'flex justify-between mb-7'}>
                    <div className="text-2xl font-light">List of Invoices</div>
                    <button className="btn btn-primary">New Invoice</button>
                </div>
                <div className={"flex flex-col align-middle justify-center"}>
                {!isLoading ? invoices.map(invoice => (
                    <div className="card bordered p-5 bg-base-100 w-1/2 shadow-xl">
                        <div className={'flex justify-between'}>
                            <div>
                                <h2 className="card-title">Fattura {invoice.Header.DLTERPId}</h2>
                                <p>{"Issue date: "+ (invoice.Header.IssueDate !== null ? invoice.Header.IssueDate.toDateString() : "Non disponibile")}</p>
                            </div>
                            <div>
                                <p>{"Seller: "+invoice.Seller.Name}</p>
                                <p>{"Buyer: "+ invoice.Buyer.Name}</p>
                            </div>
                            <div className={"flex gap-3"}>
                                <div className={'text-xl'}>
                                    {invoice.Header.Currency + ' ' + invoice.Header.TotalAmount}
                                </div>
                                    <button className="btn btn-primary"><Eye></Eye></button>
                            </div>
                        </div>
                    </div>
                    ))
                    : <LoadingSpinner />
                }
                </div>
            </div>
        </div> : <LoadingSpinner />
        }
    </div>
}

export default InvoiceOverview;
import React, { useEffect, useState } from 'react';
import { StoreDto } from '../../dto/stores/StoreDto';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';
import { InvoiceAccountingTransaction } from '@derp/company-canister';
import { Eye } from 'lucide-react';
import { useAccountingService, useStore } from '../Stores/StoreProvider';


export const SupplierInvoiceOverview = () => {
    const [invoices, setInvoices] = useState<InvoiceAccountingTransaction[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {store} = useStore();
    const accountingTransactionService = useAccountingService();

    useEffect(() => {
        init();
    }, [store]);

    const init = async () => {
        if(store){
            setIsLoading(true);
            await fetchInvoices(store);
            setIsLoading(false);
        }
    }

    const fetchInvoices = async (store:StoreDto) => {
        if(accountingTransactionService.client === null){
            console.error("AccountingTransactionClient is null");
            return;
        }
        const invoices = await accountingTransactionService.client.listSuppliersInvoicesByStore(store);
        setInvoices(invoices);
    };

    return <div className={'mx-5 pb-5'}>
        {store ? <div className={'flex flex-col gap-10'}>
            <div className={'flex w-full card p-5 bordered flex-col gap-4'}>
                <div className={'flex justify-between mb-7'}>
                    <div className={'flex flex-col gap-3'}>
                        <div className="text-2xl font-light">Fatture dei fornitori</div>
                        <div className="text-sm text-gray-500 max-w-2xl">Visualizza e gestisci le fatture ricevute dai tuoi fornitori. Carica un PDF e il sistema OCR estrarrà automaticamente i dati della fattura, velocizzando il processo di registrazione.</div>
                    </div>
                    <button className="btn btn-primary">Carica fattura</button>
                </div>
                <div className={'flex flex-col align-middle justify-center'}>
                {!isLoading ? invoices.length >0 ? invoices.map(invoice => (
                    <div className="card bordered p-5 bg-base-100 shadow-xl">
                        <div className={'flex justify-between'}>
                            <div className={'flex gap-10'}>
                                <div>
                                    <h2 className="card-title">Fattura {invoice.Header.DLTERPId}</h2>
                                    <p>{'Issue date: ' + (invoice.Header.IssueDate !== null ? invoice.Header.IssueDate.toDateString() : 'Non disponibile')}</p>
                                </div>
                                <div>
                                    <p>{'Seller: ' + invoice.Seller.Name}</p>
                                    <p>{'Buyer: ' + invoice.Buyer.Name}</p>
                                </div>
                            </div>
                            <div className={'flex gap-3'}>
                                <div className={'text-xl'}>
                                    {invoice.Header.Currency + ' ' + invoice.Header.TotalAmount}
                                </div>
                                    <button className="btn btn-primary"><Eye></Eye></button>
                            </div>
                        </div>
                    </div>
                    )) : <div className={'text-center text-gray-500'}>Nessuna fattura trovata</div>
                    : <LoadingSpinner />
                }
                </div>
            </div>
        </div> : <LoadingSpinner />
        }
    </div>;
};

export default SupplierInvoiceOverview;
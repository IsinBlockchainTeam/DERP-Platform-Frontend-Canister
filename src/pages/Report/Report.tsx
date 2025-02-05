import React, {useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import DocumentViewer from '../../components/DocumentViewer/DocumentViewer';
import CustomerHeader from '../../components/CustomerHeader/CustomerHeader';
import {DATATRANS_TRX_ID, TRANSACTION_ID} from '../../constants';
import {useTranslation} from "react-i18next";

function Report() {
    const [invoiceUrl, setInvoiceUrl] = useState<string>('');
    const [searchParams] = useSearchParams();
    const {t} = useTranslation(undefined, {keyPrefix: 'report'});

    const onLoadError = (error: any) => {
        console.log(error)
    }

    const onLoadSuccess = () => {return;}

    React.useEffect(() => {
        const transactionId = `${searchParams.get(DATATRANS_TRX_ID)}`;
        localStorage.setItem(TRANSACTION_ID, transactionId);
        setInvoiceUrl(`${window.location.origin}/api/orders/last/payed-invoice?trxId=${transactionId}`);
    }, [])

    return (
        <main className={"h-full flex flex-col"}>
                <CustomerHeader/>

                { invoiceUrl ?
                    <div className="flex flex-col grow min-h-0">
                        <div className="overflow-y-scroll">
                            <DocumentViewer temporary={false} invoiceUrl={invoiceUrl} onLoadError={onLoadError} onLoadSuccess={onLoadSuccess} />
                        </div>
                        <div className="h-18 p-3 flex items-center justify-center shrink border-t border-gray-300">
                            <a download href={invoiceUrl}>
                                <label className="btn btn-primary">{t('downloadBtn')}</label>
                            </a>
                        </div>
                    </div>
                    :
                    <p className="font-bold text-blue-500 mt-9 text-center">{t('loadingCaption')}</p>
                }
        </main>
    );
}


export default Report;

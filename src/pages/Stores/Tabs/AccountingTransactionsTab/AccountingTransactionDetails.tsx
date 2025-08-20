import { useTranslation } from 'react-i18next';
import TabTitle from '../../../../components/Tabs/TabTitle';
import { useStoreId } from '../../../../utils';
import { useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { accountingTransactionService } from '../../../../api/services/AccountingTransactions';
import LoadingSpinner from '../../../../components/Loading/LoadingSpinner';
import { DownloadIcon } from '../../../../components/Icons/Icons';
import { AccountingTransaction, AccountingTransactionType } from '@derp/company-canister';
import CodeView from '../../../../components/CodeView';

export interface AccountingTransactionDetailsProps {
    transactionId?: string;
    transactionType?: AccountingTransactionType;
}

const AccountingTransactionDetails = (props: AccountingTransactionDetailsProps) => {
    const { t } = useTranslation(undefined, { keyPrefix: 'supplierTransactions' });

    const { transactionId, transactionType } = useParams<{ transactionId: string, transactionType: AccountingTransactionType }>();
    const [loading, setLoading] = useState<boolean>(false);
    const [transaction, setTransaction] = useState<AccountingTransaction | undefined>(undefined);

    const fetchTransaction = async () => {
        let actualTransactionId = props.transactionId;
        let actualTransactionType = props.transactionType;

        if (!actualTransactionId && !actualTransactionType) {
            actualTransactionId = transactionId;
            actualTransactionType = transactionType;
        }

        if (!actualTransactionId || !actualTransactionType) throw new Error("Transaction id or type is missing");

        setLoading(true);
        const transaction = await accountingTransactionService.getAccountingTransaction({ type: actualTransactionType }, actualTransactionId);
        console.log("Fetched transaction");
        console.log(transaction);
        setTransaction(transaction);
        setLoading(false);
    }

    useEffect(() => {
        fetchTransaction();
    }, [transactionId]);

    const onDownloadOriginal = async () => {
        let actualTransactionId = props.transactionId;
        if (!actualTransactionId) {
            actualTransactionId = transactionId;
        }

        if (!actualTransactionId) throw new Error("Transaction id is missing");
        await accountingTransactionService.downloadOriginalXML(actualTransactionId);
    }

    const onDownloadJson = () => {
        if (!transaction || !actualTransactionId) return;
        
        const blob = new Blob([JSON.stringify(transaction, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${actualTransactionId}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

    const actualTransactionId = useMemo(() => {
        let actualTransactionId = props.transactionId;
        if (!actualTransactionId) {
            actualTransactionId = transactionId;
        }
        return actualTransactionId;
    }, [transactionId]);

    return <div className='flex flex-col h-full'>
        <TabTitle title={t('transactionDetails.title') + ' ' + actualTransactionId} />

        {loading ? <LoadingSpinner /> :
            <div className='flex flex-col flex-1 items-center overflow-hidden'>
                <div className='flex gap-4 mb-5 flex-initial'>
                    <button
                        className='btn btn-primary'
                        onClick={onDownloadJson}
                    >
                        <DownloadIcon size={6} />
                        {t('transactionDetails.downloadJson')}
                    </button>
                    {
                        transaction?.Header.TypeCode === AccountingTransactionType.BANK_TRX
                        &&
                        <a
                            download
                            className='btn btn-primary'
                            href={`${process.env.REACT_APP_BACKEND_URL}/accounting-transactions/${actualTransactionId}/xml`}
                        >
                            <DownloadIcon size={6} />
                            {t('transactionDetails.downloadOriginal')}
                        </a>
                    }
                </div>
                <CodeView code={transaction} />
            </div>
        }
    </div>
}

export default AccountingTransactionDetails;

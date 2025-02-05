import { useTranslation } from 'react-i18next';
import TabTitle from '../../../../components/Tabs/TabTitle';
import { useStoreUrl } from '../../../../utils';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AccountingTransaction, AccountingTransactionType } from '../../../../model/AccountingTransaction';
import { accountingTransactionService } from '../../../../api/services/AccountingTransactions';
import LoadingSpinner from '../../../../components/Loading/LoadingSpinner';
import { DownloadIcon } from '../../../../components/Icons/Icons';

const AccountingTransactionDetails = () => {
    const { t } = useTranslation(undefined, { keyPrefix: 'supplierTransactions' });

    const storeUrl = useStoreUrl();
    const { transactionId } = useParams<{ transactionId: string }>();
    const [loading, setLoading] = useState<boolean>(false);
    const [transaction, setTransaction] = useState<AccountingTransaction | undefined>(undefined);

    const fetchTransaction = async () => {
        if (!transactionId) return;

        setLoading(true);
        const transaction = await accountingTransactionService.getAccountingTransaction({ storeUrl }, transactionId);
        setTransaction(transaction);
        setLoading(false);
    }

    useEffect(() => {
        fetchTransaction();
    }, [transactionId]);

    const onDownloadOriginal = () => {
        console.log("download")
    }

    return <>
        <TabTitle title={t('transactionDetails.title') + transactionId} />

        {loading ? <LoadingSpinner /> :
            <div className='flex flex-col items-center'>
                {
                    transaction?.Header.TypeCode === AccountingTransactionType.BANK
                    &&
                    <a
                        download
                        className='btn btn-primary mb-5'
                        href={`/accounting-transactions/${transactionId}/xml`}
                    >
                        <DownloadIcon size={6} />
                        {t('transactionDetails.downloadOriginal')}
                    </a>
                }
                <div className="mockup-code max-w-7xl">
                    <pre><code>
                        {JSON.stringify(transaction, null, 2)}
                    </code></pre>
                </div>
            </div>
        }
    </>
}


export default AccountingTransactionDetails;

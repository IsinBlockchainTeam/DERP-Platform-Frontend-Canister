import { useTranslation } from 'react-i18next';
import TabTitle from '../../../../components/Tabs/TabTitle';
import { useStoreId } from '../../../../utils';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { accountingTransactionService } from '../../../../api/services/AccountingTransactions';
import LoadingSpinner from '../../../../components/Loading/LoadingSpinner';
import { DownloadIcon } from '../../../../components/Icons/Icons';
import { AccountingTransaction, AccountingTransactionType } from '@derp/company-canister';

const AccountingTransactionDetails = () => {
    const { t } = useTranslation(undefined, { keyPrefix: 'supplierTransactions' });

    const storeId = useStoreId();
    const { transactionId, transactionType } = useParams<{ transactionId: string, transactionType: AccountingTransactionType }>();
    const [loading, setLoading] = useState<boolean>(false);
    const [transaction, setTransaction] = useState<AccountingTransaction | undefined>(undefined);

    const fetchTransaction = async () => {
        if (!transactionId || !transactionType) throw new Error("Transaction id or type is missing");

        setLoading(true);
        const transaction = await accountingTransactionService.getAccountingTransaction({ type: transactionType }, transactionId);
        setTransaction(transaction);
        setLoading(false);
    }

    useEffect(() => {
        fetchTransaction();
    }, [transactionId]);

    const onDownloadOriginal = async () => {
        if(!transactionId) throw new Error("Transaction id is missing");
        await accountingTransactionService.downloadOriginalXML(transactionId);
    }

    return <>
        <TabTitle title={t('transactionDetails.title') + transactionId} />

        {loading ? <LoadingSpinner /> :
            <div className='flex flex-col items-center'>
                {
                    transaction?.Header.TypeCode === AccountingTransactionType.BANK_TRX
                    &&
                    <a
                        download
                        className='btn btn-primary mb-5'
                        href={`${process.env.REAC_APP_BACKEND_URL}/accounting-transactions/${transactionId}/xml`}
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

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {  useNavigate, useSearchParams } from "react-router-dom";
import { accountingTransactionService } from "../../../../api/services/AccountingTransactions";
import LoadingSpinner from "../../../../components/Loading/LoadingSpinner";
import GenericTable, { GenericTableColumn, GenericTableAction } from "../../../../components/Table/GenericTable";
import TabTitle from "../../../../components/Tabs/TabTitle";
import { AccountingTransaction } from "../../../../model/AccountingTransaction";
import { parseSearchParamSafe } from "../../../../utils";
import { EyeIcon } from "../../../../components/Icons/Icons";

const AccountingTransactionsList = () => {
    const navigate = useNavigate();
    const { t } = useTranslation(undefined, { keyPrefix: 'supplierTransactions' });
    const [searchParams] = useSearchParams();
    const [storeUrl, setStoreUrl] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [transactions, setTransactions] = useState<AccountingTransaction[]>([]);

    const accountingTransactionColumns: GenericTableColumn<AccountingTransaction>[] = [
        {
            header: t('transactionsTable.id'),
            accessor: (row) => row.Header.DLTERPId || "-",
        },
        {
            header: t('transactionsTable.source'),
            accessor: (row) => row.Header.Source || "-",
        },
        {
            header: t('transactionsTable.type'),
            accessor: (row) => row.Header.TypeCode,
        },
        {
            header: t('transactionsTable.externalReference'),
            accessor: (row) => row.Header.ExternalReferenceNumber || "-",
        },
        {
            header: t('transactionsTable.issueDate'),
            accessor: (row) => row.Header.IssueDate?.toLocaleDateString(),
        },
        {
            header: t('transactionsTable.valueDate'),
            accessor: (row) => row.Header.ValueDate?.toLocaleDateString(),
        },
        {
            header: t('transactionsTable.total'),
            accessor: (row) => row.Header.TotalAmount?.toFixed(2),
        },
        {
            header: t('transactionsTable.currency'),
            accessor: (row) => row.Header.Currency || "-",
        },
        {
            header: t('transactionsTable.status'),
            accessor: (row) => row.Header.Status || "-",
        },
        {
            header: t('transactionsTable.description'),
            accessor: (row) => row.Header.Description || undefined,
        },
    ]
    
    const accountingTransactionActions: GenericTableAction<AccountingTransaction>[] = [
        {
            label: <EyeIcon />,
            onClick: (row) => {
                navigate(row.Header.DLTERPId + '?' + searchParams.toString());
            }
        }
    ]


    const refreshData = async (url: string) => {
        setLoading(true);
        try {
            const resp = await accountingTransactionService.listAccountingTransactions({
                storeUrl: url
            });
            setTransactions(resp);
        } catch (e) {
            console.log(e);
            throw e;
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        const storeUrl = parseSearchParamSafe(searchParams, 'storeUrl');
        if (storeUrl) {
            setStoreUrl(storeUrl);
        }

        refreshData(storeUrl);
    }, []);

    return (
        <>
            <TabTitle title={t('title')} />

            {
                loading ?
                    <LoadingSpinner />
                    :
                    <div className="flex w-full flex-col">
                        <GenericTable
                            data={transactions}
                            actions={accountingTransactionActions}
                            columns={accountingTransactionColumns}
                        />
                    </div>
            }
        </>
    )
}

export default AccountingTransactionsList;

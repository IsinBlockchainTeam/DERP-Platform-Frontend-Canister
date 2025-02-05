import { AccountingTransaction, StatementItem} from "@derp/company-canister";
import { EyeIcon } from "../../../components/Icons/Icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { statementItemsClient } from "../../../api/icp";
import BalanceStatementViewSkeleton from "../../../components/BalanceStatement/BalanceStatementViewSkeleton";
import GenericTable, { GenericTableAction, GenericTableColumn } from "../../../components/Table/GenericTable";
import TransactionDetails from "./TransactionDetails";

const DailyDetailBalanceView = () => {
    const { itemId, categoryId, merchantId, year, monthId, day } = useParams();
    const [loading, setLoading] = useState(true);
    const [parentStatementItem, setParentStatementItem] = useState<StatementItem | null>(null);
    const [transactions, setTransactions] = useState<AccountingTransaction[]>([]);
    const [selectedTransaction, setSelectedTransaction] = useState<AccountingTransaction | null>(null);
    const { t } = useTranslation(undefined, { keyPrefix: 'merchantBalance' });

    const itemIdNumber = new Number(itemId);
    if (isNaN(itemIdNumber.valueOf())) {
        throw new Error("Invalid itemId");
    }

    const monthIdNumber = new Number(monthId);
    if (isNaN(monthIdNumber.valueOf())) {
        throw new Error("Invalid monthId");
    }

    const dayNumber = new Number(day);
    if (isNaN(dayNumber.valueOf())) {
        throw new Error("Invalid day");
    }

    useEffect(() => {
        fetchData();
    }, [itemId, categoryId, merchantId, year, monthId, day]);

    const yearNum = new Number(year).valueOf();

    const fetchData = async () => {
        setLoading(true);

        try {

            const currentDate = new Date(yearNum, monthIdNumber.valueOf(), dayNumber.valueOf());
            console.log("Current date: " + currentDate);

            const originalStatementItem = await statementItemsClient.getStatementItem(itemIdNumber.valueOf());
            setParentStatementItem(originalStatementItem);

            const customDate = {
                year: currentDate.getFullYear(),
                month: currentDate.getMonth(),
                day: currentDate.getDate(),
            }

            console.log("Custom date: " + JSON.stringify(customDate));

            const transactions = await statementItemsClient.getStatementItemTransactions(itemIdNumber.valueOf(), {
                year: currentDate.getFullYear(),
                month: currentDate.getMonth(),
                day: currentDate.getDate(),
            });

            setTransactions(transactions);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const tableColumns: GenericTableColumn<AccountingTransaction>[] = [
        {
            header: t('table.id'),
            accessor: (row) => row.Header.DLTERPId || "-",
        },
        {
            header: t('table.currency'),
            accessor: (row) => `${row.Header.Currency || 0}`,
        },
        {
            header: t('table.total'),
            accessor: (row) => `${row.Header.TotalAmount?.toFixed(2) || 0}`,
        }
    ]

    const tableActions: GenericTableAction<AccountingTransaction>[] = [
        {
            label: <EyeIcon />,
            onClick: (row) => {
                setSelectedTransaction(row);
            }
        }
    ]

    return <BalanceStatementViewSkeleton
        year={yearNum}
        merchantId={merchantId || "-"}
        categoryId={categoryId || "-"}
        item={{ id: parentStatementItem?.id || 0, label: `${parentStatementItem?.id} - ${parentStatementItem?.name}` }}
        month={monthIdNumber.valueOf()}
        day={dayNumber.valueOf()}
        loading={loading}
        leftSlot={<GenericTable
            columns={tableColumns}
            actions={tableActions}
            data={transactions}
            isActive={(row) => selectedTransaction?.Header.DLTERPId === row.Header.DLTERPId}
        />}
        rightSlot={<TransactionDetails transaction={selectedTransaction}/>}
    />
}

export default DailyDetailBalanceView;

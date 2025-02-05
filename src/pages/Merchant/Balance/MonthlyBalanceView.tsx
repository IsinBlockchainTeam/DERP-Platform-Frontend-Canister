import { StatementItem, StatementItemAggregate } from "@derp/company-canister";
import { BarChart, cheerfulFiestaPalette } from "@mui/x-charts";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { statementItemsClient } from "../../../api/icp";
import BalanceStatementViewSkeleton from "../../../components/BalanceStatement/BalanceStatementViewSkeleton";
import { EyeIcon } from "../../../components/Icons/Icons";
import GenericTable, { GenericTableAction, GenericTableColumn } from "../../../components/Table/GenericTable";

const MonthlyBalanceView = () => {
    const { itemId, categoryId, year, merchantId } = useParams();
    const [loading, setLoading] = useState(true);
    const [parentStatementItem, setParentStatementItem] = useState<StatementItem | null>(null);
    const [monthlyAggregates, setMonthlyAggregates] = useState<StatementItemAggregate[]>([]);
    const { i18n, t } = useTranslation(undefined, { keyPrefix: 'merchantBalance' });
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, [itemId, categoryId, merchantId, year]);

    const yearNum = new Number(year).valueOf();

    const fetchData = async () => {
        setLoading(true);

        try {
            console.log("Fetching data for item: " + itemId);
            const itemIdNumber = new Number(itemId);
            console.log("Parsed item ID: " + itemIdNumber.valueOf());
            if (isNaN(itemIdNumber.valueOf())) {
                throw new Error("Invalid itemId");
            }

            const originalStatementItem = await statementItemsClient.getStatementItem(itemIdNumber.valueOf());
            const aggregates = await statementItemsClient.getAggregateStatements(itemIdNumber.valueOf(), { year: yearNum });
            setMonthlyAggregates(aggregates);
            setParentStatementItem(originalStatementItem);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const monthName = (monthIndex?: number) => {
        if (monthIndex === undefined) {
            return "-";
        }

        const lang = i18n.language;
        const date = new Date(2020, monthIndex); // Year and day are arbitrary; monthIndex is 0-based
        return new Intl.DateTimeFormat(lang, { month: 'long' }).format(date);
    }

    const tableColumns: GenericTableColumn<StatementItemAggregate>[] = [
        {
            header: t('table.id'),
            accessor: (row) => <p className="underline">{`${monthName(row.month)}`}</p>
        },
        {
            header: t('table.currency'),
            accessor: () => parentStatementItem?.currency || "N/A"
        },
        {
            header: t('table.total'),
            accessor: (row) => row.total.toFixed(2)
        },
    ]

    const tableActions: GenericTableAction<StatementItemAggregate>[] = [
        {
            label: <EyeIcon />,
            onClick: (row) => {
                navigate(`/merchant/${merchantId}/balance/${year}/categories/${categoryId}/items/${itemId}/months/${row.month}`);
            }
        }
    ]


    return <BalanceStatementViewSkeleton
        year={yearNum}
        merchantId={merchantId || "-"}
        categoryId={categoryId || "-"}
        item={{ id: parentStatementItem?.id || 0, label: `${parentStatementItem?.id} - ${parentStatementItem?.name}` }}
        loading={loading}
        leftSlot={<GenericTable
            columns={tableColumns}
            data={monthlyAggregates}
            actions={tableActions}
        />}
        rightSlot={<BarChart
            xAxis={[{ scaleType: 'band', data: monthlyAggregates.map(it => monthName(it.month)) }]}
            series={[{
                data: monthlyAggregates.map(it => it.total),
            }]}
            width={850}
            height={500}
            colors={cheerfulFiestaPalette}
        />}
    />
}

export default MonthlyBalanceView;

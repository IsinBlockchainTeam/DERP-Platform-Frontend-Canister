import { StatementItem, StatementItemAggregate } from "@derp/company-canister";
import { cheerfulFiestaPalette, LineChart } from "@mui/x-charts";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { statementItemsClient } from "../../../api/icp";
import BalanceStatementViewSkeleton from "../../../components/BalanceStatement/BalanceStatementViewSkeleton";
import { EyeIcon } from "../../../components/Icons/Icons";
import GenericTable, { GenericTableAction, GenericTableColumn } from "../../../components/Table/GenericTable";

const DailyBalanceView = () => {
    const { itemId, categoryId, year, merchantId, monthId } = useParams();
    const [loading, setLoading] = useState(true);
    const [parentStatementItem, setParentStatementItem] = useState<StatementItem | null>(null);
    const [aggregates, setAggregates] = useState<StatementItemAggregate[]>([]);
    const { i18n, t } = useTranslation(undefined, { keyPrefix: 'merchantBalance' });
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, [itemId, categoryId, merchantId, year, monthId]);

    const yearNum = new Number(year).valueOf();

    const fetchData = async () => {
        setLoading(true);

        try {
            const itemIdNumber = new Number(itemId);
            if (isNaN(itemIdNumber.valueOf())) {
                throw new Error("Invalid itemId");
            }

            const monthIdNumber = new Number(monthId);
            if (isNaN(monthIdNumber.valueOf())) {
                throw new Error("Invalid monthId");
            }

            const originalStatementItem = await statementItemsClient.getStatementItem(itemIdNumber.valueOf());
            setParentStatementItem(originalStatementItem);

            const items = await statementItemsClient.getAggregateStatements(itemIdNumber.valueOf(), { year: yearNum, month: monthIdNumber.valueOf() });
            fillDailyStatementItems(items, monthIdNumber.valueOf(), originalStatementItem.id);
            setAggregates(items);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const dateFormat = (item: StatementItemAggregate, short = false) => {
        if(item.month === undefined || item.day === undefined) return item.year;

        const lang = i18n.language;
        const date = new Date(item.year, item.month, item.day);

        if (short)
            return new Intl.DateTimeFormat(lang, { day: 'numeric' }).format(date);
        return new Intl.DateTimeFormat(lang, { month: 'short', day: 'numeric' }).format(date);
    }

    const fillDailyStatementItems = (items: StatementItemAggregate[], monthId: number, parentId: number) => {
        console.log("Initial items: " + JSON.stringify(items));
        // count days in the month by getting the number of the last day of the month
        const daysInMonth = new Date(yearNum, monthId + 1, 0).getDate();

        // start from the first day of the month
        const date = new Date(yearNum, monthId, 1);
        // iterate through the days of the month
        for (let i = 0; i < daysInMonth; i++) {
            // for each day, check if there is an item in the list
            const item = items.find(it => it.year === date.getFullYear() && it.month === date.getMonth() && it.day === date.getDate());
            if (!item) {
                items.push(new StatementItemAggregate(
                    parentId,
                    0,
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate(),
                ));
            }

            date.setDate(date.getDate() + 1);
        }


        // Sort items by date
        items.sort((a, b) => {
            if(a.month === undefined || a.day === undefined) return -1;
            if(b.month === undefined || b.day === undefined) return 1;

            return new Date(a.year, a.month, a.day).getTime() - new Date(b.year, b.month, b.day).getTime();
        });
    }


    const tableColumns: GenericTableColumn<StatementItemAggregate>[] = [
        {
            header: t('table.id'),
            accessor: (row) => <p className="underline">{`${dateFormat(row)}`}</p>
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
                navigate(`/merchant/${merchantId}/balance/${year}/categories/${categoryId}/items/${itemId}/months/${monthId}/days/${row.day}/transactions`);
            }
        },
    ]

    return <BalanceStatementViewSkeleton
        year={yearNum}
        merchantId={merchantId || "-"}
        categoryId={categoryId || "-"}
        item={{ id: parentStatementItem?.id || 0, label: `${parentStatementItem?.id} - ${parentStatementItem?.name}` }}
        month={new Number(monthId).valueOf()}
        loading={loading}
        leftSlot={<GenericTable
            columns={tableColumns}
            data={aggregates}
            actions={tableActions}
        />}
        rightSlot={<LineChart
            xAxis={[{ scaleType: 'point', data: aggregates.map(it => dateFormat(it)) }]}
            series={[{
                data: aggregates.map(it =>
                    it.total
                ),
            }]}
            width={850}
            height={500}
            colors={cheerfulFiestaPalette}
        />}
    />
}

export default DailyBalanceView;

import { StatementItem, StatementItemAggregate, StatementItemCategory, StatementItemDto } from "@derp/company-canister";
import { cheerfulFiestaPalette, PieChart } from "@mui/x-charts";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { statementItemsClient } from "../../../api/icp";
import BalanceStatementViewSkeleton from "../../../components/BalanceStatement/BalanceStatementViewSkeleton";
import { EyeIcon } from "../../../components/Icons/Icons";
import GenericTable, { GenericTableAction, GenericTableColumn } from "../../../components/Table/GenericTable";

const BalanceView = () => {
    const navigate = useNavigate();
    const { categoryId, year, merchantId } = useParams();
    const { t } = useTranslation(undefined, { keyPrefix: 'merchantBalance' });
    const [loading, setLoading] = useState(true);

    const [statementItems, setStatementItems] = useState<StatementItem[]>([]);
    const [statementAggregates, setStatementAggregates] = useState<StatementItemAggregate[]>([]);

    const yearNum = new Number(year).valueOf();

    useEffect(() => {
        fetchData();
    }, [categoryId, year]);

    const fetchData = async () => {
        setLoading(true);

        try {
            let data: StatementItem[] = [];
            const categoryIdNumber = new Number(categoryId);
            if (isNaN(categoryIdNumber.valueOf())) {
                data = await statementItemsClient.getStatementItems();
            } else {
                console.log("Fetching with number: ", categoryIdNumber.valueOf());
                data = await statementItemsClient.getStatementItems(categoryIdNumber.valueOf());
            }

            setStatementItems(data);
            const aggregates = await Promise.all(data.map(async item => {
                try {
                    return await statementItemsClient.getAggregateStatement(item.id, { year: yearNum })
                } catch (error) {
                    console.log(error);
                    return null;
                }
            }));

            setStatementAggregates(aggregates.filter(agg => agg !== null) as StatementItemAggregate[]);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const tableColumns: GenericTableColumn<StatementItem>[] = [
        {
            header: t('table.id'),
            accessor: (row) => <p className="underline">{`${row.id} - ${row.name}`}</p>
        },
        {
            header: t('table.currency'),
            accessor: "currency",
        },
        {
            header: t('table.total'),
            accessor: (row) => getTotal(row).toFixed(2)
        },
    ]

    const tableActions: GenericTableAction<StatementItem>[] = [
        {
            label: <EyeIcon />,
            onClick: (row) => {
                navigate(`/merchant/${categoryId}/balance/${year}/categories/${categoryId}/items/${row.id}`);
            }
        }
    ]

    const currentYear = new Date().getFullYear();

    const getTotal = (item: StatementItem) => {
        const parentTotal = statementAggregates.find(agg => agg.parentStatementItemId === item.id)?.total;
        return parentTotal || 0;
    }

    return <BalanceStatementViewSkeleton
        year={currentYear}
        merchantId={merchantId || "-"}
        categoryId={categoryId || "-"}
        loading={loading}
        leftSlot={<GenericTable
            columns={tableColumns}
            actions={tableActions}
            data={statementItems}
        />}
        rightSlot={<PieChart
            series={[{
                data: statementItems.map(it => ({
                    value: getTotal(it),
                    id: it.id,
                    label: `${it.id} - ${it.name}`
                })),
            }]}
            width={850}
            height={500}
            colors={cheerfulFiestaPalette}
        />}
    />
}

export default BalanceView;

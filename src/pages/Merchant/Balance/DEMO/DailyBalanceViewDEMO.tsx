import { StatementItem, StatementItemAggregate } from '@derp/company-canister';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowDown, ArrowUp, ChevronLeft, Eye, TrendingUp } from 'lucide-react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { statementItemsClient } from '../../../../api/icp';

interface DailyChartData {
    day: number;
    total: number;
    transactions: number;
}

const DailyBalanceViewDEMO = () => {
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

    //TODO move to utils file
    const monthName = (monthIndex?: number) => {
        if (monthIndex === undefined) {
            return "-";
        }

        const lang = i18n.language;
        const date = new Date(2020, monthIndex); // Year and day are arbitrary; monthIndex is 0-based
        return new Intl.DateTimeFormat(lang, { month: 'long' }).format(date);
    }

    const goBackToAnnualDetail = () => {
        navigate(`/merchant/${merchantId}/balance/${year}/categories/${categoryId}/items/${itemId}/months`)
    }

    //TODO move to utils file
    const fillDailyStatementItems = (items: StatementItemAggregate[], monthId: number, parentId: number) => {
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
    //TODO move to utils file
    const calculateMonthlyTotal = (statementItemAggregate: StatementItemAggregate[]): number => {
        return statementItemAggregate.reduce((acc, curr) => acc + curr.total, 0);
    }

    //TODO move to utils file
    const calculateDailyAverage = (statementItemAggregate: StatementItemAggregate[]): number => {
        return statementItemAggregate.reduce((acc, curr) => acc + curr.total, 0) / statementItemAggregate.length;
    }

    const calculateMonthlyMax = (statementItemAggregate: StatementItemAggregate[]): number => {
        return statementItemAggregate.reduce((acc, curr) => Math.max(acc, curr.total), 0);
    }

    const calculateMonthlyMin = (statementItemAggregate: StatementItemAggregate[]): number => {
        return statementItemAggregate.reduce((acc, curr) => Math.min(acc, curr.total), 0);
    }

    const buildLineChartData = (rawData: StatementItemAggregate[]): DailyChartData[] => {
        //TODO fix possibile day undefined
        return rawData.map(statement => ({
            day: statement.day || 0,
            total: statement.total,
            transactions: 0
        }));
    };

    const goToDailyDetails = (day: number | undefined) => {
        if(!day) return;
        navigate(`/merchant/${merchantId}/balance/${year}/categories/${categoryId}/items/${itemId}/months/${monthId}/days/${day}/transactions`);
    }

    return <div className="min-h-screen bg-base-100/50">
        <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600 mt-1">Panoramica andamento mensile per gruppo contabile</p>
        </div>
        {/* Header with Stats */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5 bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
                <button className="btn btn-ghost btn-sm p-2 hover:bg-base-100 rounded-full"
                        onClick={goBackToAnnualDetail}>
                    <ChevronLeft className="h-5 w-5" />
                </button>
                <div>
                    <h1 className="text-lg text-primary font-bold text-neutral">
                        {parentStatementItem?.id} {parentStatementItem?.name} - {monthName(Number(monthId))} - {year}
                    </h1>
                </div>
            </div>
            <div className="flex gap-4">
                <div className="bg-base-100 px-6 py-3 rounded-lg">
                    <div className="text-base text-neutral">Totale Mensile</div>
                    <div className="text-base font-semibold text-primary">
                        CHF {calculateMonthlyTotal(aggregates).toFixed(2)}
                    </div>
                </div>
                <div className="bg-base-100 px-6 py-3 rounded-lg">
                    <div className="text-base text-neutral">Media Giornaliera</div>
                    <div className="text-base font-semibold text-primary">
                        CHF {calculateDailyAverage(aggregates).toFixed(2)}
                    </div>
                </div>
                <div className="bg-base-100 px-6 py-3 rounded-lg">
                    <ArrowUp className="h-4 w-4 text-success" />
                    <span className="text-neutral">Max</span>
                    <div className="text-base font-semibold text-primary">
                        CHF {calculateMonthlyMax(aggregates).toFixed(2)}
                    </div>
                </div>
                <div className="bg-base-100 px-6 py-3 rounded-lg">
                    <ArrowDown className="h-4 w-4 text-success" />
                    <span className="text-neutral">Min</span>
                    <div className="text-base font-semibold text-primary">
                        CHF {calculateMonthlyMin(aggregates).toFixed(2)}
                    </div>
                </div>
            </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-4">
            {/* Chart */}
            <div className="card bg-white shadow-sm">
                <div className="card-body p-6">
                    <div className="flex items-center gap-2 text-sm text-neutral mb-4">
                        <TrendingUp className="h-4 w-4" />
                        Andamento Giornaliero
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={buildLineChartData(aggregates)}>
                                <XAxis
                                    dataKey="day"
                                    tick={{ fill: '#737373' }}
                                    axisLine={{ stroke: '#f8fafc' }}
                                />
                                <YAxis
                                    tick={{ fill: '#737373' }}
                                    axisLine={{ stroke: '#f8fafc' }}
                                />
                                <Tooltip
                                    formatter={(value: number, name: string) => {
                                        if (name === 'total') return [`CHF ${value.toFixed(2)}`, 'Totale'];
                                        if (name === 'transactions') return [value, 'Transazioni'];
                                        return [value, name];
                                    }}
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: '1px solid #f8fafc',
                                        borderRadius: '6px',
                                        boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="total"
                                    stroke="#d04b3d"
                                    strokeWidth={2}
                                    dot={{ fill: '#d04b3d', r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Monthly Details Table */}
            <div className="card bg-white shadow-sm text-base">
                <div className="card-body p-6">
                    <div className="text-neutral text-lg mb-4">
                        Dettaglio Giornaliero
                    </div>
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                            <tr className="border-b border-base-100">
                                <th className="text-left px-6 py-3 text-base font-medium text-neutral bg-base-100">Giorno</th>
                                <th className="text-left px-6 py-3 text-base font-medium text-neutral bg-base-100">Valuta</th>
                                <th className="text-right px-6 py-3 text-base font-medium text-neutral bg-base-100">Totale</th>
                                <th className="text-center px-6 py-3 text-base font-medium text-neutral bg-base-100">Azioni</th>
                            </tr>
                            </thead>
                            <tbody>
                            {aggregates.map((day, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-base-100 last:border-0 hover:bg-base-100/50 transition-colors"
                                >
                                    <td className="px-6 py-3 text-base text-neutral">{day.day}</td>
                                    <td className="px-6 py-3 text-base text-neutral">CHF</td>
                                    <td className="px-6 py-3 text-right text-primary text-base">
                                        {day.total.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-3 text-center">
                                        <button className="btn btn-ghost btn-sm p-1 hover:bg-base-100 rounded-full" onClick={()=> goToDailyDetails(day.day)}>
                                            <Eye className="h-4 w-4 text-neutral" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default DailyBalanceViewDEMO;

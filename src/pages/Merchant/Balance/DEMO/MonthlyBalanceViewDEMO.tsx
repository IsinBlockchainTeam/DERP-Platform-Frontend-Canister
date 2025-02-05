import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { statementItemsClient } from "../../../../api/icp";
import { ChevronLeft, Eye, TrendingUp } from 'lucide-react';
import { StatementItem, StatementItemAggregate } from "@derp/company-canister";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface MonthlyData {
    month: string;
    currency: string;
    total: number;
}

const MonthlyBalanceViewDEMO = () => {
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
            const itemIdNumber = Number(itemId);
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

    const buildBarChartData = (rawData: StatementItemAggregate[]): MonthlyData[] => {
        // Inizializza array con tutti i mesi a 0
        const monthlyData = rawData.map(statement => ({
            month: monthName(statement.month),
            currency: 'CHF',
            total: statement.total
        }));

        return monthlyData;
    };

    const calculateAnnualyTotal = (statementItemAggregate: StatementItemAggregate[]): number => {
        return statementItemAggregate.reduce((acc, curr) => acc + curr.total, 0);
    }

    const calculateMonthlyAverage = (statementItemAggregate: StatementItemAggregate[]): number => {
        return statementItemAggregate.reduce((acc, curr) => acc + curr.total, 0) / statementItemAggregate.length;
    }

    const goBackToAnnualBalance = () => {
        navigate(`/merchant/${merchantId}/balance/${year}/categories`)
    }

    const goToMonthlyDetails = (month: number) => {
        navigate(`/merchant/${merchantId}/balance/${year}/categories/${categoryId}/items/${itemId}/months/${month}/days`);
    }



    return <div className="min-h-screen bg-base-100/50">
        <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600 mt-1">Panoramica andamento annuale per gruppo contabile</p>
        </div>
        {/* Header with Stats */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5 bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
                <button className="btn btn-ghost btn-sm p-2 hover:bg-base-100 rounded-full"
                        onClick={goBackToAnnualBalance}>
                    <ChevronLeft className="h-5 w-5" />
                </button>
                <div>
                    <h1 className="text-lg text-primary font-bold">
                        {parentStatementItem?.id} {parentStatementItem?.name} - {year}
                    </h1>
                </div>
            </div>
            <div className="flex gap-4">
                <div className="bg-base-100 px-6 py-3 rounded-lg">
                    <div className="text-base text-neutral">Totale Anno</div>
                    <div className="text-base font-semibold text-primary">
                        CHF {calculateAnnualyTotal(monthlyAggregates).toFixed(2)}
                    </div>
                </div>
                <div className="bg-base-100 px-6 py-3 rounded-lg">
                    <div className="text-base text-neutral">Media Mensile</div>
                    <div className="text-base font-semibold text-primary">
                        CHF {calculateMonthlyAverage(monthlyAggregates).toFixed(2)}
                    </div>
                </div>
            </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-4">
            {/* Chart */}
            <div className="card bg-white shadow-sm">
                <div className="card-body p-6">
                    <div className="flex items-center gap-2 text-lg text-neutral mb-4">
                        <TrendingUp className="h-6 w-6" />
                        Andamento Annuale
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={buildBarChartData(monthlyAggregates)}>
                                <XAxis
                                    dataKey="month"
                                    tick={{ fill: 'hsl(var(--neutral))' }}
                                    axisLine={{ stroke: 'hsl(var(--base-100))' }}
                                />
                                <YAxis
                                    tick={{ fill: 'hsl(var(--neutral))' }}
                                    axisLine={{ stroke: 'hsl(var(--base-100))' }}
                                />
                                <Tooltip
                                    formatter={(value) => [`CHF ${Number(value).toFixed(2)}`, 'Totale']}
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: '1px solid hsl(var(--base-100))',
                                        borderRadius: '6px',
                                        boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
                                    }}
                                />
                                <Bar
                                    dataKey="total"
                                    fill="#d04b3d"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Monthly Details Table */}
            <div className="card bg-white shadow-sm text-base">
                <div className="card-body p-6">
                    <div className="text-neutral text-lg mb-4">
                        Dettaglio Mensile
                    </div>
                    <div className="overflow-x-auto">
                        <table className="table w-full text-base">
                            <thead className="text-base">
                            <tr className="border-b border-base-100">
                                <th className="text-left px-6 py-3 text-neutral bg-base-100">Mese</th>
                                <th className="text-left px-6 py-3  text-neutral bg-base-100">Valuta</th>
                                <th className="text-right px-6 py-3 text-neutral bg-base-100">Totale</th>
                                <th className="text-center px-6 py-3  text-neutral bg-base-100">Azioni</th>
                            </tr>
                            </thead>
                            <tbody>
                            {monthlyAggregates.map((month, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-base-100 last:border-0 hover:bg-base-100/50 transition-colors"
                                >
                                    <td className="px-6 py-3 text-neutral">{monthName(month.month)}</td>
                                    <td className="px-6 py-3 text-neutral">{"CHF"}</td>
                                    <td className="px-6 py-3 text-right text-primary">
                                        {month.total.toFixed(2)}
                                    </td>
                                    {month.month !== undefined ? <td className="px-6 py-3 text-center">
                                        <button className="btn btn-ghost btn-sm p-1 hover:bg-base-100 rounded-full"
                                                onClick={() => goToMonthlyDetails(month.month || 0)}>
                                            <Eye className="h-6 w-6 text-neutral" />
                                        </button>
                                    </td>
                                        : <td className="px-6 py-3 text-center">-</td>}

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

export default MonthlyBalanceViewDEMO;

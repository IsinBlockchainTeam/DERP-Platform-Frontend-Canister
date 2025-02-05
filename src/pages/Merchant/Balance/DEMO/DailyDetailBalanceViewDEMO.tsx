import { AccountingTransaction, StatementItem} from "@derp/company-canister";
import { ChevronLeft, Download, ExternalLink, Eye, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from 'react-router-dom';
import { statementItemsClient } from '../../../../api/icp';
import { AccountingTransactionStatus } from '../../../../model/AccountingTransaction';

const DailyDetailBalanceViewDEMO = () => {
    const { itemId, categoryId, merchantId, year, monthId, day } = useParams();
    const [loading, setLoading] = useState(true);
    const [parentStatementItem, setParentStatementItem] = useState<StatementItem | null>(null);
    const [transactions, setTransactions] = useState<AccountingTransaction[]>([]);
    const [selectedTransaction, setSelectedTransaction] = useState<AccountingTransaction | null>(null);
    const { i18n, t } = useTranslation(undefined, { keyPrefix: 'merchantBalance' });
    const navigate = useNavigate();


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

    const calculateDayTotal = (transactions: AccountingTransaction[]) => {
        return transactions.reduce((acc, transaction) => acc + (transaction.Header.TotalAmount || 0), 0);
    }

    //TODO move this to a common place
    const monthName = (monthIndex?: number) => {
        if (monthIndex === undefined) {
            return "-";
        }

        const lang = i18n.language;
        const date = new Date(2020, monthIndex); // Year and day are arbitrary; monthIndex is 0-based
        return new Intl.DateTimeFormat(lang, { month: 'long' }).format(date);
    }

    const goBackToMonthlyDetails = (month: number) => {
        navigate(`/merchant/${merchantId}/balance/${year}/categories/${categoryId}/items/${itemId}/months/${month}/days`);
    }


    return <div className="min-h-screen bg-base-100/50">
        <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600 mt-1">Lista transazioni giornaliera</p>
        </div>
        {/* Header */}
        <div className="bg-white mb-4 p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button className="btn btn-ghost btn-sm p-2 hover:bg-base-100 rounded-full" onClick={
                        () => goBackToMonthlyDetails(monthIdNumber.valueOf())}>
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-primary">
                            {parentStatementItem?.id} {parentStatementItem?.name} - {day} {monthName(monthIdNumber.valueOf())} {yearNum}
                        </h1>
                    </div>
                </div>
                <div className="text-right bg-base-100 px-6 py-3 rounded-lg">
                    <div className="text-base text-neutral">Totale Giorno</div>
                    <div className="text-lg font-bold text-primary">
                        CHF {calculateDayTotal(transactions).toFixed(2)}
                    </div>
                </div>
            </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-4">
            <div className="bg-white rounded-lg shadow-sm">
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                        <tr className="border-b border-base-100">
                            <th className="text-left px-6 py-3 text-lg font-medium text-neutral bg-base-100">ID</th>
                            <th className="text-left px-6 py-3 text-lg font-medium text-neutral bg-base-100">Fonte</th>
                            <th className="text-right px-6 py-3 text-lg font-medium text-neutral bg-base-100">Totale</th>
                            <th className="text-left px-6 py-3 text-lg font-medium text-neutral bg-base-100">Stato</th>
                            <th className="text-center px-6 py-3 text-lg font-medium text-neutral bg-base-100"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {transactions.map((transaction) => (
                            <tr
                                key={transaction.Header.DLTERPId}
                                className={`border-b border-base-100 last:border-0 hover:bg-base-100/50 transition-colors
                      ${selectedTransaction?.Header.DLTERPId === transaction.Header.DLTERPId ? 'bg-base-100/50' : ''}`}
                            >
                                <td className="px-6 py-3 text-neutral text-base">{transaction.Header.DLTERPId}</td>
                                <td className="px-6 py-3 text-neutral text-base">{transaction.Header.Source}</td>
                                <td className="px-6 py-3 text-right text-base text-primary">
                                    {transaction.Header.Currency} {transaction.Header.TotalAmount?.toFixed(2)}
                                </td>
                                <td className="px-6 py-3">
                      <span className={`text-base px-2 py-0.5 rounded-full bg-success/10 text-success`}>
                          Contabilizzato
                      </span>
                                </td>
                                <td className="px-6 py-3 text-center">
                                    <button
                                        className="btn btn-ghost btn-sm p-1 hover:bg-base-100 rounded-full"
                                        onClick={() => setSelectedTransaction(transaction)}
                                    >
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

        {/* Transaction Details Modal */}
        {selectedTransaction && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
                    <div className="p-4 border-b border-base-100 flex items-center justify-between">
                        <h2 className="text-base text-neutral">Dettaglio Transazione</h2>
                        <button
                            className="btn btn-ghost btn-sm p-1 hover:bg-base-100 rounded-full"
                            onClick={() => setSelectedTransaction(null)}
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="text-center p-4 bg-base-100 rounded-lg">
                            <div className="text-base text-neutral">Importo Totale</div>
                            <div className="text-lg font-bold text-primary mt-1">
                                {selectedTransaction.Header.Currency} {selectedTransaction.Header.TotalAmount?.toFixed(2)}
                            </div>
                        </div>

                        <div className="grid gap-4">
                            <div>
                                <div className="text-base text-neutral">ID Transazione</div>
                                <div className="text-base">{selectedTransaction.Header.DLTERPId}</div>
                            </div>

                            <div>
                                <div className="text-base text-neutral">Fonte</div>
                                <div className="text-base">{selectedTransaction.Header.Source}</div>
                            </div>

                            <div>
                                <div className="text-base text-neutral">Stato</div>
                                <div className={`inline-flex items-center px-2 py-1 rounded-full text-base bg-success/10 text-success`}>
                                    Contabilizzato
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 space-y-2">
                            <button className="btn btn-primary text-base w-full gap-2">
                                <Download className="h-4 w-4" />
                                Scarica PDF
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
}

export default DailyDetailBalanceViewDEMO;

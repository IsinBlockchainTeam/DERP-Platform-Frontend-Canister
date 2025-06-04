import { AccountingTransaction, AccountingTransactionType, DailyTransactionRecord, DispatchRule, StatementItem } from "@derp/company-canister";
import { ChevronLeft, Code, Download, ExternalLink, Eye, ScrollText, X, ListTree } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from 'react-router-dom';
import { dispatchRulesClient, statementItemsClient } from '../../../api/icp';
import AccountingTransactionDetails from '../../Stores/Tabs/AccountingTransactionsTab/AccountingTransactionDetails';
import { Modal } from '../../../components/Modal/Modal';
import CodeView from "../../../components/CodeView";
import LoadingSpinner from "../../../components/Loading/LoadingSpinner";
import { ArrowsPointingOutIcon, DocumentCurrencyDollarIcon } from "@heroicons/react/24/outline";
import TabTitle from "../../../components/Tabs/TabTitle";
import SelectStatementItemModal from "./SelectStatementItemModal";

const DailyDetailBalanceView = () => {
    const { itemId, categoryId, merchantId, year, monthId, day } = useParams();
    const [loading, setLoading] = useState(true);
    const [parentStatementItem, setParentStatementItem] = useState<StatementItem | null>(null);
    const [transactions, setTransactions] = useState<{ record: DailyTransactionRecord, transaction: AccountingTransaction }[]>([]);
    const [selectedTransaction, setSelectedTransaction] = useState<{ record: DailyTransactionRecord, transaction: AccountingTransaction } | null>(null);

    const [ruleModalOpen, setRuleModalOpen] = useState(false);
    const [loadingRuleForRecord, setLoadingRuleForRecord] = useState(false);
    const [currentRuleForRecord, setCurrentRuleForRecord] = useState<DispatchRule | null>(null);
    
    const [selectItemModalOpen, setSelectItemModalOpen] = useState(false);
    const [transactionDetailsModalOpen, setTransactionDetailsModalOpen] = useState(false);
    const [moveOperationLoading, setMoveOperationLoading] = useState(false);

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

            const transactions = await statementItemsClient.getStatementItemRecordsWithTransactions(itemIdNumber.valueOf(), currentDate);

            setTransactions(transactions);
            console.log("Transactions: " + JSON.stringify(transactions));
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const fetchRuleForRecord = async (record: DailyTransactionRecord) => {
        setLoadingRuleForRecord(true);
        try {
            const rule = await dispatchRulesClient.getDispatchRule(record.originalRuleId);
            setCurrentRuleForRecord(rule);
        } catch (error) {
            console.error('Error fetching dispatch rule:', error);
        } finally {
            setLoadingRuleForRecord(false);
        }
    }

    const calculateDayTotal = (transactions: { record: DailyTransactionRecord, transaction: AccountingTransaction }[]) => {
        return transactions.reduce((acc, transaction) => acc + (transaction.record.total || 0), 0);
    }

    const monthName = (monthIndex?: number) => {
        if (monthIndex === undefined) {
            return "-";
        }

        const lang = i18n.language;
        const date = new Date(2020, monthIndex);
        return new Intl.DateTimeFormat(lang, { month: 'long' }).format(date);
    }

    const goBackToMonthlyDetails = (month: number) => {
        navigate(`/merchant/${merchantId}/balance/${year}/categories/${categoryId}/items/${itemId}/months/${month}/days`);
    }

    const openRuleModal = (record: DailyTransactionRecord) => {
        setRuleModalOpen(true);
        fetchRuleForRecord(record);
    }
    
    const handleOpenTransactionDetailsModal = (record: DailyTransactionRecord, transaction: AccountingTransaction) => {
        setTransactionDetailsModalOpen(true);
        setSelectedTransaction({
            record: record,
            transaction: transaction
        });
    }
    
    const handleOpenSelectItemModal = (record: DailyTransactionRecord, transaction: AccountingTransaction) => {
        setSelectedTransaction({
            record: record,
            transaction: transaction
        });

        setSelectItemModalOpen(true);
    }

    const handleMoveTargetStatementItemSelected = async (item: StatementItem) => {
        if (!selectedTransaction) {
            return;
        }

        try {
            setMoveOperationLoading(true);
            await statementItemsClient.moveStatementItemRecord(selectedTransaction.record.id, item.id);
            await fetchData();
            setSelectedTransaction(null);
            setSelectItemModalOpen(false);
        } catch (error) {
            console.error('Error moving statement item record:', error);
            // TODO: Show error message to user
        } finally {
            setMoveOperationLoading(false);
        }
    }

    return <div className="min-h-screen bg-base-100/50">
        <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600 mt-1">{t('dailyDetail.title')}</p>
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
                                <th className="text-left px-6 py-3 text-lg font-medium text-neutral bg-base-100">{t('dailyDetail.table.dlterpId')}</th>
                                <th className="text-left px-6 py-3 text-lg font-medium text-neutral bg-base-100">{t('dailyDetail.table.source')}</th>
                                <th className="text-left px-6 py-3 text-lg font-medium text-neutral bg-base-100">{t('dailyDetail.table.externalId')}</th>
                                <th className="text-right px-6 py-3 text-lg font-medium text-neutral bg-base-100">{t('dailyDetail.table.amount')}</th>
                                <th className="text-center px-6 py-3 text-lg font-medium text-neutral bg-base-100">{t('dailyDetail.table.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction) => (
                                <tr
                                    key={transaction.transaction.Header.DLTERPId}
                                    className={`border-b border-base-100 last:border-0 hover:bg-base-100/50 transition-colors
                      ${selectedTransaction?.transaction.Header.DLTERPId === transaction.transaction.Header.DLTERPId ? 'bg-base-100/50' : ''}`}
                                >
                                    <td className="px-6 py-3 text-neutral text-base">{transaction.transaction.Header.DLTERPId}</td>
                                    <td className="px-6 py-3 text-neutral text-base">{transaction.transaction.Header.TypeKey}</td>
                                    <td className="px-6 py-3 text-neutral text-base">{transaction.transaction.Header.ExternalReferenceNumber}</td>
                                    <td className="px-6 py-3 text-right text-base text-primary">
                                        {transaction.transaction.Header.Currency} {transaction.record.total.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-3 text-center">
                                        <button className="btn btn-soft btn-disabled btn-sm p-1 hover:bg-base-100 rounded-full disabled mx-2">
                                            <ScrollText className="h-5 w-5 text-neutral" />
                                        </button>
                                        <button
                                            className="btn btn-soft btn-sm p-1 rounded-full mx-2"
                                            onClick={() => openRuleModal(transaction.record)}
                                        >
                                            <DocumentCurrencyDollarIcon className="h-5 w-5" />
                                        </button>
                                        <button
                                            className="btn btn-soft btn-sm p-1 rounded-full mx-2"
                                            onClick={() => handleOpenTransactionDetailsModal(transaction.record, transaction.transaction)}
                                        >
                                            <Eye className="h-5 w-5" />
                                        </button>
                                        <button
                                            className="btn btn-soft btn-sm p-1 rounded-full mx-2"
                                            onClick={() => handleOpenSelectItemModal(transaction.record, transaction.transaction)}
                                        >
                                            <ArrowsPointingOutIcon className="h-5 w-5" />
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
            <Modal
                open={transactionDetailsModalOpen}
                onChangeOpen={(open) => {
                    setTransactionDetailsModalOpen(open);
                    if (!open) {
                        setSelectedTransaction(null);
                    }
                }}
            >
                <div className="bg-dark" style={{ height: "80vh" }}>
                    <AccountingTransactionDetails
                        transactionId={selectedTransaction.transaction.Header.DLTERPId ?? undefined}
                        transactionType={selectedTransaction.transaction.Header.TypeCode ?? undefined}
                    />
                </div>
            </Modal>
        )}

        {/* Rule Details Modal */}
        {currentRuleForRecord && (
            <Modal
                open={ruleModalOpen}
                onChangeOpen={(open) => {
                    setRuleModalOpen(open);
                    if (!open) {
                        setCurrentRuleForRecord(null);
                    }
                }}
            >
                <div className="bg-dark" style={{ height: "80vh" }}>
                    {loadingRuleForRecord ? (
                        <LoadingSpinner />
                    ) : (
                        <div className="p-4 flex flex-col h-full">
                            <div className="flex-initial">
                                <TabTitle title={t('ruleDetails.title') + ' ' + currentRuleForRecord.id} />
                            </div>
                            <CodeView code={currentRuleForRecord} />
                        </div>
                    )}
                </div>
            </Modal>
        )}

        {/* Select Statement Item Modal */}
        <SelectStatementItemModal
            isOpen={selectItemModalOpen}
            onChangeOpen={(open) => setSelectItemModalOpen(open)}
            onItemSelected={handleMoveTargetStatementItemSelected}
            externalLoading={moveOperationLoading}
            title={t('moveToStatement')}
        />
    </div>
}

export default DailyDetailBalanceView;

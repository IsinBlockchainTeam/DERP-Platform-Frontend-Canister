import { AccountingTransaction, AccountingTransactionType, BankAccountingTransaction, CounterpartDispatchRule, DailyTransactionRecord, DispatchRule, DispatchRuleType, StatementItem } from "@derp/company-canister";
import { ChevronLeft, Eye, ScrollText, UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from 'react-router-dom';
import { dispatchRulesClient } from '../../../api/icp';
import AccountingTransactionDetails from '../../Stores/Tabs/AccountingTransactionsTab/AccountingTransactionDetails';
import { Modal } from '../../../components/Modal/Modal';
import LoadingSpinner from "../../../components/Loading/LoadingSpinner";
import { ArrowsPointingOutIcon, DocumentCurrencyDollarIcon } from "@heroicons/react/24/outline";
import SelectStatementItemModal from "../../../components/StatementItem/SelectStatementItemModal";
import DispatchRuleView from "../../../components/DispatchRule/DispatchRuleView";
import { useStatementItemsClient, useStoreData } from '../../Stores/StoreProvider';

const DailyDetailBalanceView = () => {
    const { itemId, categoryId, merchantId, year, monthId, day } = useParams();
    const [loading, setLoading] = useState(true);
    const [parentStatementItem, setParentStatementItem] = useState<StatementItem | null>(null);
    const [transactions, setTransactions] = useState<{ record: DailyTransactionRecord, transaction: AccountingTransaction }[]>([]);
    const [selectedTransaction, setSelectedTransaction] = useState<{ record: DailyTransactionRecord, transaction: AccountingTransaction } | null>(null);

    const [ruleModalOpen, setRuleModalOpen] = useState(false);
    const [loadingRuleForRecord, setLoadingRuleForRecord] = useState(false);
    const [currentRuleForRecord, setCurrentRuleForRecord] = useState<DispatchRule | null>(null);

    const [addCounterpartRuleModalOpen, setAddCounterpartRuleModalOpen] = useState(false);
    const [addCounterpartRuleLoadingTransactionId, setAddCounterpartRuleLoadingTransactionId] = useState<string | null>(null);
    const [selectItemModalOpen, setSelectItemModalOpen] = useState(false);
    const [transactionDetailsModalOpen, setTransactionDetailsModalOpen] = useState(false);
    const [moveOperationLoading, setMoveOperationLoading] = useState(false);

    const { client } = useStatementItemsClient();
    const {store} = useStoreData();
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
        if(!client){
            console.error("StatementItemsClient is not initialized");
            return;
        }
        setLoading(true);
        try {
            const currentDate = new Date(Date.UTC(yearNum, monthIdNumber.valueOf(), dayNumber.valueOf()));

            const originalStatementItem = await client.getStatementItem(itemIdNumber.valueOf());
            setParentStatementItem(originalStatementItem);
            const transactions = await client.getStatementItemRecordsWithTransactions(itemIdNumber.valueOf(), currentDate);
            setTransactions(transactions);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const fetchRuleForRecord = async (record: DailyTransactionRecord) => {
        setLoadingRuleForRecord(true);
        try {
            if (!record.originalRuleId) {
                return;
            }
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
        const date = new Date(Date.UTC(2020, monthIndex));
        return new Intl.DateTimeFormat(lang, { month: 'long' }).format(date);
    }

    const goBackToMonthlyDetails = (month: number) => {
        navigate(`/merchant/${merchantId}/stores/${store?.id}/balance/${year}/categories/${categoryId}/items/${itemId}/months/${month}/days`);
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

    const handleOpenMoveToItemModal = (record: DailyTransactionRecord, transaction: AccountingTransaction) => {
        setSelectedTransaction({
            record: record,
            transaction: transaction
        });

        setSelectItemModalOpen(true);
    }

    const handleOpenAddCounterpartRuleModal = async (record: DailyTransactionRecord, transaction: AccountingTransaction) => {
        if (!isBankTransaction(transaction) || !transaction.Counterpart?.Name) {
            return;
        }

        const transactionId = transaction.Header.DLTERPId;
        if (!transactionId) {
            return;
        }

        setAddCounterpartRuleLoadingTransactionId(transactionId);

        try {
            const rules = await dispatchRulesClient.getDispatchRules();
            const existingRule = rules.find(rule => isCounterpartRule(rule) && rule.counterpartName === transaction.Counterpart?.Name);
            if (existingRule && client) {
                const targetItems = existingRule.statementItemIDs.find(() => true);
                if (!targetItems) {
                    throw new Error("No target items found");
                }

                await client.moveStatementItemRecord(record.id, targetItems, existingRule.id);
                await fetchData();
                setSelectedTransaction(null);
                setAddCounterpartRuleModalOpen(false);
            } else {
                setSelectedTransaction({
                    record: record,
                    transaction: transaction
                });
                setAddCounterpartRuleModalOpen(true);
            }
        } catch (error) {
            console.error('Error adding counterpart rule:', error);
            // TODO: Show error message to user
        } finally {
            setAddCounterpartRuleLoadingTransactionId(null);
        }
    }

    const handleMoveTargetStatementItemSelected = async (item: StatementItem | StatementItem[]) => {
        if (Array.isArray(item)) {
            throw new Error("Moving multiple statement items is not supported");
        }
        if (!selectedTransaction || !client) {
            return;
        }

        try {
            setMoveOperationLoading(true);
            await client.moveStatementItemRecord(selectedTransaction.record.id, item.id);
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

    const handleAddCounterpartRule = async (item: StatementItem | StatementItem[]) => {
        if (Array.isArray(item)) {
            throw new Error("Adding multiple statement items is not supported");
        }

        const trx = selectedTransaction?.transaction;
        if (!trx || !isBankTransaction(trx) || !trx.Counterpart?.Name || !client) {
            return;
        }

        try {
            setAddCounterpartRuleLoadingTransactionId(trx.Header.DLTERPId || null);
            const rule = new CounterpartDispatchRule(undefined as unknown as number,
                [item.id],
                trx.Counterpart.Name,
            )

            const createdRule = await dispatchRulesClient.createDispatchRule(rule);
            await client.moveStatementItemRecord(selectedTransaction.record.id, item.id, createdRule.id);
            await fetchData();
            setSelectedTransaction(null);
            setAddCounterpartRuleModalOpen(false);
        } catch (error) {
            console.error('Error adding counterpart rule:', error);
            // TODO: Show error message to user
        } finally {
            setAddCounterpartRuleLoadingTransactionId(null);
        }
    }

    const isBankTransaction = (transaction?: AccountingTransaction | null): transaction is BankAccountingTransaction => {
        return transaction?.Header.TypeCode === AccountingTransactionType.BANK_TRX;
    }

    const isCounterpartRule = (rule: DispatchRule): rule is CounterpartDispatchRule => {
        return rule.ruleType === DispatchRuleType.BANK_COUNTERPART;
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
                                        <button 
                                            className="btn btn-soft btn-disabled btn-sm p-1 hover:bg-base-100 rounded-full disabled mx-2 tooltip"
                                            data-tip={t('dailyDetail.tooltips.downloadDocument')}
                                        >
                                            <ScrollText className="h-5 w-5 text-neutral" />
                                        </button>
                                        <button
                                            className={`btn btn-soft btn-sm p-1 rounded-full mx-2 tooltip ${transaction.record.originalRuleId ? '' : 'btn-disabled'}`}
                                            onClick={() => openRuleModal(transaction.record)}
                                            data-tip={t('dailyDetail.tooltips.showRule')}
                                        >
                                            <DocumentCurrencyDollarIcon className="h-5 w-5" />
                                        </button>
                                        <button
                                            className="btn btn-soft btn-sm p-1 rounded-full mx-2 tooltip"
                                            onClick={() => handleOpenTransactionDetailsModal(transaction.record, transaction.transaction)}
                                            data-tip={t('dailyDetail.tooltips.showTransactionDetails')}
                                        >
                                            <Eye className="h-5 w-5" />
                                        </button>
                                        <button
                                            className="btn btn-soft btn-sm p-1 rounded-full mx-2 tooltip"
                                            onClick={() => handleOpenMoveToItemModal(transaction.record, transaction.transaction)}
                                            data-tip={t('dailyDetail.tooltips.moveRecord')}
                                        >
                                            <ArrowsPointingOutIcon className="h-5 w-5" />
                                        </button>
                                        {
                                            (!parseInt(categoryId ?? '0') && isBankTransaction(transaction.transaction) && transaction.transaction.Counterpart?.Name) && (
                                                <button
                                                    className={`btn btn-soft btn-sm p-1 rounded-full mx-2 tooltip ${addCounterpartRuleLoadingTransactionId === transaction.transaction.Header.DLTERPId ? 'btn-disabled' : ''}`}
                                                    onClick={() => handleOpenAddCounterpartRuleModal(transaction.record, transaction.transaction)}
                                                    data-tip={t('dailyDetail.tooltips.addCounterpartRule') + ' ' + transaction.transaction.Counterpart?.Name}
                                                >
                                                    {addCounterpartRuleLoadingTransactionId === transaction.transaction.Header.DLTERPId ? (
                                                        <LoadingSpinner width={20} height={20} />
                                                    ) : (
                                                        <UserPlus className="h-5 w-5" />
                                                    )}
                                                </button>
                                            )
                                        }
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
                <DispatchRuleView rule={currentRuleForRecord} />
            </Modal>
        )}

        {/* Move Record to Statement Item Modal */}
        <SelectStatementItemModal
            isOpen={selectItemModalOpen}
            onChangeOpen={(open) => setSelectItemModalOpen(open)}
            onItemSelected={handleMoveTargetStatementItemSelected}
            externalLoading={moveOperationLoading}
            title={t('moveToStatement')}
            description={t('moveToStatementDescription')}
        />

        {/* Add Counterpart Rule Modal */}
        <SelectStatementItemModal
            isOpen={addCounterpartRuleModalOpen}
            onChangeOpen={(open) => setAddCounterpartRuleModalOpen(open)}
            onItemSelected={handleAddCounterpartRule}
            externalLoading={addCounterpartRuleLoadingTransactionId !== null}
            title={t('addCounterpartRule')}
            description={t('addCounterpartRuleDescription', { counterpart: isBankTransaction(selectedTransaction?.transaction) ? selectedTransaction?.transaction.Counterpart?.Name ?? '' : '' })}
        />
    </div>
}

export default DailyDetailBalanceView;

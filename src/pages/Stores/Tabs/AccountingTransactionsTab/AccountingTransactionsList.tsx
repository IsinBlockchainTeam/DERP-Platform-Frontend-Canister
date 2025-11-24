import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import LoadingSpinner from "../../../../components/Loading/LoadingSpinner";
import GenericTable, { GenericTableColumn, GenericTableAction } from "../../../../components/Table/GenericTable";
import TabTitle from "../../../../components/Tabs/TabTitle";
import { EyeIcon } from "../../../../components/Icons/Icons";
import { AccountingTransaction } from "@derp/company-canister";
import PaginationIndicator from "../../../Pagination/PaginationIndicator";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { storeService } from '../../../../api/services/Store';
import { StoreDto } from '../../../../dto/stores/StoreDto';
import { useAccountingService, useStoreData } from '../../StoreProvider';

const PAGE_SIZE = 20;

const AccountingTransactionsList = () => {
    const navigate = useNavigate();
    const { t } = useTranslation(undefined, { keyPrefix: 'supplierTransactions' });
    const { t: paginationT } = useTranslation(undefined, { keyPrefix: 'pagination' });
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState<boolean>(false);
    const [transactions, setTransactions] = useState<AccountingTransaction[]>([]);
    const [allTransactions, setAllTransactions] = useState<AccountingTransaction[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalFilteredTransactions, setTotalFilteredTransactions] = useState(0);

    const {store} = useStoreData();
    const {client} = useAccountingService();
    // Date filtering state
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to midnight
    const [dateFrom, setDateFrom] = useState<Date>(today);
    const [dateTo, setDateTo] = useState<Date>(today);

    const accountingTransactionColumns: GenericTableColumn<AccountingTransaction>[] = [
        {
            header: t('transactionsTable.id'),
            accessor: (row) => row.Header.DLTERPId || "-",
        },
        {
            header: t('transactionsTable.source'),
            accessor: (row) => row.Header.TypeKey || "-",
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
            accessor: (row) => row.Header.IssueDate?.toLocaleDateString()
        },
        {
            header: t('transactionsTable.valueDate'),
            accessor: (row) => row.Header.ValueDate?.toLocaleDateString()
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
                navigate(row.Header.TypeCode + '/' + row.Header.DLTERPId + '?' + searchParams.toString());
            }
        }
    ]

    const refreshData = async () => {
        setLoading(true);
        try {
            if(client===null || store===null) {
                console.log("Client or store is null");
                return;
            }
            // Ensure we're using midnight for both dates
            const fromDate = new Date(dateFrom);
            fromDate.setHours(0, 0, 0, 0);
            
            const toDate = new Date(dateTo);
            toDate.setHours(23, 59, 59, 999); // End of the day

            const ids = await client.listTransactionIDs({
                dateFrom: fromDate,
                dateTo: toDate
            });
            
            console.log(ids);
            
            // Get all transactions for these IDs
            const allTransactions = await client.getTransactionsByIDs(
                ids,
                dateFrom,
                toDate
            );
            
            setAllTransactions(allTransactions);
            setCurrentPage(1); // Reset to first page when refreshing
            loadPageTransactions(1, allTransactions);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    const loadPageTransactions = (page: number, transactions = allTransactions) => {
        const startIndex = (page - 1) * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE;
        const pageTransactions = transactions.slice(startIndex, endIndex);
        setTransactions(pageTransactions);
    }


    useEffect(() => {
        refreshData();
    }, [store]);


    // Date picker change handlers
    const handleDateFromChange = (date: Date | null) => {
        if (date) {
            const newDate = new Date(date);
            newDate.setHours(0, 0, 0, 0);
            setDateFrom(newDate);
        }
    };

    const handleDateToChange = (date: Date | null) => {
        if (date) {
            const newDate = new Date(date);
            newDate.setHours(0, 0, 0, 0);
            setDateTo(newDate);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        loadPageTransactions(page);
    };

    const totalPages = Math.ceil(allTransactions.length / PAGE_SIZE);
    const startItem = Math.min((currentPage - 1) * PAGE_SIZE + 1, allTransactions.length);
    const endItem = Math.min(currentPage * PAGE_SIZE, allTransactions.length);

    return (
        <>
            <TabTitle title={t('title')} />

            {/* Date Filter Section */}
            <div className="flex flex-wrap gap-4 mb-4 p-4">
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">{paginationT('from')}</span>
                    </label>
                    <ReactDatePicker
                        selected={dateFrom}
                        onChange={handleDateFromChange}
                        className="input input-bordered"
                        dateFormat="yyyy-MM-dd"
                        maxDate={dateTo}
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">{paginationT('to')}</span>
                    </label>
                    <ReactDatePicker
                        selected={dateTo}
                        onChange={handleDateToChange}
                        className="input input-bordered"
                        dateFormat="yyyy-MM-dd"
                        minDate={dateFrom}
                    />
                </div>

                <div className="form-control flex justify-end items-end">
                    <button 
                        className="btn btn-primary" 
                        onClick={refreshData}
                        disabled={loading}
                    >
                        {loading ? <span className="loading loading-spinner"></span> : paginationT('refresh')}
                    </button>
                </div>
            </div>

            {loading ? (
                <LoadingSpinner />
            ) : (
                <div className="flex w-full flex-col card bg-base-100 shadow">
                    <div className="card-body">
                        {allTransactions.length > 0 && (
                            <PaginationIndicator
                                currentPage={currentPage}
                                totalPages={totalPages}
                                startItem={startItem}
                                endItem={endItem}
                                totalItems={allTransactions.length}
                                onPageChange={handlePageChange}
                                className="mt-4"
                            />
                        )}
                        <GenericTable
                            data={transactions}
                            actions={accountingTransactionActions}
                            columns={accountingTransactionColumns}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default AccountingTransactionsList;

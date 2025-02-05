import Header from "../../components/Header/Header";
import React, { useState } from "react";
import { auth } from "../../api/auth";
import { useNavigate, useParams } from "react-router";
import { ordersService } from "../../api/services/Orders";
import { OrderDto } from "../../dto/OrderDto";
import { storeService } from "../../api/services/Store";
import { StoreDto } from "../../dto/stores/StoreDto";
import { ErpOrderStatus } from "../../model/WondType";
import Dropdown from "../../components/Dropdown/Dropdown";
import { ERPItemDto } from "../../dto/ERPItemDto";
import Progress from "../../components/Loading/Progress";
import { keccak256 } from "ethers";
import {
    DEFAULT_STATUS_DROPDOWN_VALUE,
    DEFAULT_STORE_NAME_DROPDOWN_VALUE,
} from "../../constants";

// @ts-expect-error since the types for this are not provided
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import "react-datepicker/dist/react-datepicker.css";
import { QueryOrderDto } from "../../dto/QueryOrderDto";
import { getMidnightDate } from "../../utils";
import LoadingSpinner from "../../components/Loading/LoadingSpinner";
import { BcStatus, CheckedOrderPayment } from "../../dto/CheckedOrderPayment";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
    changeBcStatus,
    initCheckedOrderPayments,
    selectCheckedOrderPayments,
} from "../../store/features/checkedOrderPaymentsSlice";
import { useTranslation } from "react-i18next";

function SupplierOrders() {
    const navigate = useNavigate();
    const { t } = useTranslation(undefined, { keyPrefix: 'supplierOrders' });
    const checkedOrderPayments = useAppSelector(selectCheckedOrderPayments);
    const dispatch = useAppDispatch();
    const [filteredOrders, setFilteredOrders] = useState < OrderDto[] > ([]);
    const [allOrders, setAllOrders] = useState < OrderDto[] > ([]);
    const [stores, setStores] = useState < StoreDto[] > ([]);
    const [orderStatuses, setOrderStatuses] = useState < ErpOrderStatus[] > ([]);
    const [storeSelected, setStoreSelected] = useState < string > (
        DEFAULT_STORE_NAME_DROPDOWN_VALUE
    );
    const [statusSelected, setStatusSelected] = useState < string > (
        DEFAULT_STATUS_DROPDOWN_VALUE
    );
    const [orderItems, setOrderItems] = useState < ERPItemDto[] > ([]);
    const [storeName, setStoreName] = useState < string > ("");
    const [orderId, setOrderId] = useState < string > ("");
    const [popUpLoading, setPopUpLoading] = useState < boolean > (false);
    const [tableLoading, setTableLoading] = useState < boolean > (true);
    const [input, setInput] = useState < string > ("");
    const [filters, setFilters] = useState <
        Map < string, (order: OrderDto) => boolean >
  > (new Map());
    const [dateFrom, setDateFrom] = useState < Date > (getMidnightDate());
    const [dateTo, setDateTo] = useState < Date > (getMidnightDate());
    const [errorMessage, setErrorMessage] = useState < string > ("");
    const { merchantId } = useParams<{ merchantId: string}>();

    const order = orderId !== undefined ? allOrders.filter((o) => o.id === orderId)[0] : null;

    const getAllOrders = async (dateFrom: Date, dateTo: Date) => {
        const nextDay = new Date(dateTo);
        nextDay.setDate(nextDay.getDate() + 1);
        const modifiedDateTo: Date = new Date(nextDay.getTime() - 1);
        setTableLoading(true);
        const response = await ordersService.getSupplierOrders({
            dateFrom,
            dateTo: modifiedDateTo,
        } as QueryOrderDto);
        setFilteredOrders(response);
        setAllOrders(response);
        setTableLoading(false);
    };

    const getStores = async () => {
        const response = await storeService.list(merchantId);
        setStores(response);
    };

    const getOrderStatus = async () => {
        const response = await ordersService.getOrderStatus();
        setOrderStatuses(response);
    };

    const getBadgeByStatus = (status: ErpOrderStatus) => {
        switch (status) {
            case ErpOrderStatus.DRAFT:
                return <div className="badge badge-neutral h-min">{t('orderStatus.draft')}</div>;
            case ErpOrderStatus.ORDERED:
                return <div className="badge badge-warning h-min">{t('orderStatus.ordered')}</div>;
            case ErpOrderStatus.CONFIRMED:
                return <div className="badge badge-info h-min">{t('orderStatus.confirmed')}</div>;
            case ErpOrderStatus.CLOSED:
                return <div className="badge badge-success h-min">{t('orderStatus.closed')}</div>;
            case ErpOrderStatus.CLOSED_AND_TRANSACTION:
                return <div className="badge badge-success h-min">{t('orderStatus.closedAndTransaction')}</div>;
            default:
                return <div className="badge badge-ghost h-min">{status}</div>;
        }
    };

    const getFilterByStoreName = (
        storeName: string
    ): ((order: OrderDto) => boolean) => {
        return (order: OrderDto) => order.storeName === storeName;
    };

    const getFilterByStatus = (
        status: string
    ): ((order: OrderDto) => boolean) => {
        return (order: OrderDto) => order.status === status;
    };

    const getFilterByInput = (input: string): ((order: OrderDto) => boolean) => {
        return (order) =>
            order.status.toLowerCase().includes(input) ||
            order.storeName.toLowerCase().includes(input);
    };

    const onSelectedStore = (storeName: string) => {
        filters.set("STORE-NAME", getFilterByStoreName(storeName));
        setStoreSelected(storeName);
    };
    const onSelectedOrderStatus = (status: string) => {
        filters.set("ORDER-STATUS", getFilterByStatus(status));
        setStatusSelected(status);
    };

    const onInputChange = (e: any) => {
        const input = e.target.value.toLowerCase();
        filters.set("INPUT", getFilterByInput(input));
        setInput(input);
    };

    const applyingFilters = () => {
        let filteredOrders: OrderDto[] = allOrders;
        filters.forEach((filter) => {
            filteredOrders = filteredOrders.filter(filter);
        });
        setFilteredOrders(filteredOrders);
    };

    const handleShowAllOrders = () => {
        setStoreSelected(DEFAULT_STORE_NAME_DROPDOWN_VALUE);
        setStatusSelected(DEFAULT_STATUS_DROPDOWN_VALUE);
        filters.clear();
        setInput("");
    };

    const onDetails = async (order: OrderDto) => {
        setPopUpLoading(true);
        showDetailsModal();
        await storeLogin(order.storeName);
        await getDataForModal(order.id);
        setStoreName(order.storeName);
        setOrderId(order.id);

        if (
            order.status === ErpOrderStatus.CLOSED_AND_TRANSACTION ||
            order.status === ErpOrderStatus.CLOSED
        )
            await getOrderPayments(order.id);

        setPopUpLoading(false);
    };
    const storeLogin = async (storeName: string) => {
        const store = stores.filter((store) => store.name === storeName)[0];
        await auth.storeLogin(store.url);
    };

    const getDataForModal = async (orderId: string) => {
        const orderItems = await ordersService.getOrderDetails(orderId);
        setOrderItems(orderItems);
    };

    const getOrderPayments = async (orderId: string) => {
        const orderPayments = await ordersService.getOrderPayments(orderId);
        const checkedOrderPayments = orderPayments.map((op) => {
            return {
                transactionId: op.trxId,
                invoiceUrl: op.invoiceUrl,
                bcStatus: BcStatus.LOADING,
                trxHash: op.trxHash,
            };
        });

        dispatch(initCheckedOrderPayments(checkedOrderPayments));
        establishOrderPaymentAuthenticity(checkedOrderPayments);
    };

    const establishOrderPaymentAuthenticity = (
        checkedOrderPayments: CheckedOrderPayment[]
    ) => {
        checkedOrderPayments.forEach(async (op) => {
            const bytesInvoice = await ordersService.getBytesInvoice(
                op.transactionId
            );
            const hashValue = keccak256(bytesInvoice);
            const hashValueFromUrl = op.invoiceUrl.split("/").at(-1);
            setTimeout(
                () =>
                    dispatch(
                        changeBcStatus({
                            transactionId: op.transactionId,
                            status:
                                hashValue === hashValueFromUrl
                                    ? BcStatus.VERIFIED
                                    : BcStatus.NOT_VERIFIED,
                        })
                    ),
                2000
            );
        });
    };

    const hideDetailsModal = () => {
        dispatch(initCheckedOrderPayments([]));
        setOrderItems([]);
        window.location.hash = "";
    };

    const showDetailsModal = () => {
        window.location.hash = "details-modal";
    };

    const onDateFromChanged = async (date: Date) => {
        setErrorMessage("");
        if (date.getTime() !== dateFrom.getTime()) {
            await getAllOrders(date, dateTo);
            setDateFrom(date);
        }
    };

    const onDateToChanged = async (date: Date) => {
        setErrorMessage("");
        if (date.getTime() !== dateTo.getTime()) {
            await getAllOrders(dateFrom, date);
            setDateTo(date);
        }
    };

    const isDateFromValid = (date: Date): boolean => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return date <= today && date <= dateTo;
    };
    const isDateToValid = (date: Date): boolean => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return date <= today && date >= dateFrom;
    };

    const realDateTo = (): Date => {
        const nextDay = new Date(dateTo);
        nextDay.setDate(nextDay.getDate() + 1);
        return new Date(nextDay.getTime() - 1);
    };

    React.useEffect(() => {
        applyingFilters();
    }, [storeSelected, statusSelected, input, dateFrom, dateTo]);

    React.useEffect(() => {
        if (!auth.isLogged()) {
            navigate("/erp-login");
            return;
        }

        getAllOrders(dateFrom, dateTo);
        getStores();
        getOrderStatus();
        hideDetailsModal();
    }, []);

    return (
        <main>
            <Header />

            {!tableLoading ? (
                <>
                    <div className="mx-4 lg:mx-28 xl:mx:28 2xl:mx-28 my-8">
                        <div className="flex flex-wrap items-center justify-around py-4 bg-white dark:bg-gray-800">
                            <div
                                className={
                                    errorMessage ? "alert alert-error shadow-lg" : "hidden"
                                }
                            >
                                <div>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="stroke-current flex-shrink-0 h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    <span>{errorMessage}</span>
                                </div>
                            </div>
                            <div className="mb-4 flex flex-row">
                                <span className="mx-4 mt-1  font-bold text-gray-500">{t('dateFrom')}</span>
                                <DatePicker
                                    selected={dateFrom}
                                    placeholderText="01/01/1970"
                                    filterDate={isDateFromValid}
                                    dateFormat="dd/MM/yyyy"
                                    onChange={onDateFromChanged}
                                    className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                                />
                            </div>
                            <div className="mb-4 flex flex-row">
                                <span className="mx-4 mt-1 font-bold text-gray-500">{t('dateTo')}</span>
                                <DatePicker
                                    selected={dateTo}
                                    placeholderText="01/01/1970"
                                    filterDate={isDateToValid}
                                    dateFormat="dd/MM/yyyy"
                                    onChange={onDateToChanged}
                                    className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                                />
                            </div>
                            {dateFrom && dateTo && (
                                <>
                                    <div className="mb-4 mx-2">
                                        <Dropdown
                                            dropdownName={storeSelected}
                                            items={stores.map((store) => store.name)}
                                            onSelectedItem={onSelectedStore}
                                        />
                                    </div>
                                    <div className="mb-4 mx-2">
                                        <Dropdown
                                            dropdownName={statusSelected}
                                            items={orderStatuses}
                                            onSelectedItem={onSelectedOrderStatus}
                                        />
                                    </div>
                                    <button
                                        className="inline-flex items-center mx-2 mb-4 text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                                        type="button"
                                        onClick={handleShowAllOrders}
                                    >
                                        {t('clearFiltersBtn')}
                                    </button>

                                    <a
                                        target="_blank"
                                        href={`${window.location.origin
                                            }/api/financial-report?dateFrom=${dateFrom.toISOString()}&dateTo=${realDateTo().toISOString()}&token=${auth.accessToken()}`}
                                        className="inline-flex btn btn-primary btn-sm normal-case mb-4 mx-2"
                                        type="button"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-4 h-4 mr-2"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                                            />
                                        </svg>
                                        {t('financialReportBtn')}
                                    </a>

                                    <div className="mb-4 mx-2">
                                        <label htmlFor="table-search" className="sr-only">
                                            {t('search')}
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <svg
                                                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                                                    aria-hidden="true"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                                        clipRule="evenodd"
                                                    ></path>
                                                </svg>
                                            </div>
                                            <input
                                                type="text"
                                                id="table-search-users"
                                                className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder={t('searchPlaceholder')}
                                                value={input}
                                                onChange={onInputChange}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            <div className="flex items-center">{t('ordersTable.id')}</div>
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            <div className="flex items-center">{t('ordersTable.store')}</div>
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            <div className="flex items-center">{t('ordersTable.table')}</div>
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            <div className="flex items-center">{t('ordersTable.status')}</div>
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            <div className="flex items-center">{t('ordersTable.date')}</div>
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            <div className="flex items-center">{t('ordersTable.ERP')}</div>
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            <div className="flex items-center">{t('ordersTable.actions')}</div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map((order) => (
                                        <tr
                                            key={order.id}
                                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                        >
                                            <td className="px-6 py-4">{order.id}</td>
                                            <th
                                                scope="row"
                                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-ellipsis overflow-hidden dark:text-white max-w-[12rem]"
                                            >
                                                {order.storeName}
                                            </th>
                                            <td className="px-6 py-4">
                                                {order.tableLabel || "None"}
                                            </td>
                                            <td className="px-6 py-4">
                                                {getBadgeByStatus(order.status)}
                                            </td>
                                            <th
                                                scope="row"
                                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                            >
                                                {`${order.date.getDate()}.${order.date.getMonth() + 1
                                                    }.${order.date.getFullYear()}`}
                                            </th>
                                            <td className="px-6 py-4">{order.erpType}</td>
                                            <td className="px-6 py-4">
                                                <a
                                                    onClick={() => onDetails(order)}
                                                    className="btn btn-ghost btn-circle"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={1.5}
                                                        stroke="currentColor"
                                                        className="w-8 h-8"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                                                        />
                                                    </svg>
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div id="details-modal" className="modal">
                        <div className="modal-box w-11/12 max-w-5xl">
                            <label
                                className="btn btn-accent btn-sm btn-circle absolute right-2 top-2"
                                onClick={hideDetailsModal}
                            >
                                ✕
                            </label>
                            {!popUpLoading ? (
                                <div>
                                    <div className="m-4">
                                        <div>
                                            <span className="font-bold">
                                                {t('orderPopup.storeName')}: &nbsp;
                                                <span className="font-normal">{storeName}</span>
                                                <br />
                                                {t('orderPopup.orderId')}: &nbsp;
                                                <span className="font-normal">{orderId}</span>
                                                <br />
                                                <div className="flex flex-row justify-start">
                                                    <a
                                                        className="btn btn-primary my-3 mr-5"
                                                        href={process.env.REACT_APP_BC_EXPLORER_URL_TEMPLATE?.replace(
                                                            "{{txHash}}",
                                                            order?.trxHash || ""
                                                        )}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                                        </svg>

                                                        {t('orderPopup.showTransactionBtn')}
                                                    </a>
                                                    <a
                                                        className="btn btn-primary my-3"
                                                        href={`/api/orders/${orderId}/report/json?token=${auth.accessToken()}`}
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth={1.5}
                                                            stroke="currentColor"
                                                            className="w-6 h-6 mr-3"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                                                            />
                                                        </svg>
                                                        {t('orderPopup.accountingReportBtn')}
                                                    </a>
                                                </div>
                                            </span>
                                        </div>
                                    </div>
                                    {checkedOrderPayments.checkedOrderPayments.length !== 0 && (
                                        <>
                                            <div className="m-4">
                                                <span className="font-bold">{t('orderPopup.paymentTransactions')}:</span>
                                            </div>
                                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg m-4">
                                                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                                        <tr className="text-center">
                                                            <th scope="col" className="px-6 py-3">
                                                                {t('orderPopup.transactionsTable.transactionId')}
                                                            </th>
                                                            <th scope="col" className="px-6 py-3">
                                                                {t('orderPopup.transactionsTable.bcStatus')}
                                                            </th>
                                                            <th scope="col" className="px-6 py-3">
                                                                {t('orderPopup.transactionsTable.invoice')}
                                                            </th>
                                                            <th scope="col" className="px-6 py-3">
                                                                {t('orderPopup.transactionsTable.bcExplorer')}
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {checkedOrderPayments.checkedOrderPayments.map(
                                                            (cop, index) => (
                                                                <tr
                                                                    key={index}
                                                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 text-center"
                                                                >
                                                                    <td
                                                                        scope="row"
                                                                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                                                    >
                                                                        <small>{cop.transactionId}</small>
                                                                    </td>
                                                                    <td
                                                                        scope="row"
                                                                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                                                    >
                                                                        {cop.bcStatus === BcStatus.VERIFIED && (
                                                                            <div className="badge badge-success gap-2">
                                                                                {t('orderPopup.transactionsTable.verified')}
                                                                            </div>
                                                                        )}

                                                                        {cop.bcStatus === BcStatus.NOT_VERIFIED && (
                                                                            <div className="badge badge-error gap-2">
                                                                                {t('orderPopup.transactionsTable.notVerified')}
                                                                            </div>
                                                                        )}

                                                                        {cop.bcStatus === BcStatus.LOADING && (
                                                                            <div className="flex justify-center">
                                                                                <LoadingSpinner
                                                                                    height={16}
                                                                                    width={16}
                                                                                />
                                                                            </div>
                                                                        )}
                                                                    </td>
                                                                    <td className="px-6 py-4">
                                                                        <a
                                                                            download
                                                                            href={`${window.location.origin}/api/orders/last/payed-invoice?trxId=${cop.transactionId}`}
                                                                            className="btn btn-ghost btn-circle"
                                                                        >
                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                fill="none"
                                                                                viewBox="0 0 24 24"
                                                                                strokeWidth={1.5}
                                                                                stroke="currentColor"
                                                                                className="w-10 h-10"
                                                                            >
                                                                                <path
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                                                                                />
                                                                            </svg>
                                                                        </a>
                                                                    </td>
                                                                    <td className="px-6 py-4">
                                                                        <a
                                                                            href={process.env.REACT_APP_BC_EXPLORER_URL_TEMPLATE?.replace(
                                                                                "{{txHash}}",
                                                                                cop.trxHash || ""
                                                                            )}
                                                                            target="_blank"
                                                                            rel="noreferrer"
                                                                            className="btn btn-ghost btn-circle"
                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                                                            </svg>
                                                                        </a>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </>
                                    )}
                                    <div className="m-4">
                                        <span className="font-bold">{t('orderPopup.orderItems')}:</span>
                                    </div>
                                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg m-4">
                                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                                <tr className="text-center">
                                                    <th scope="col" className="px-6 py-3">
                                                        {t('orderPopup.itemsTable.name')}
                                                    </th>
                                                    <th scope="col" className="px-6 py-3">
                                                        {t('orderPopup.itemsTable.quantity')}
                                                    </th>
                                                    <th scope="col" className="px-6 py-3">
                                                        {t('orderPopup.itemsTable.price')}
                                                    </th>
                                                    <th scope="col" className="px-6 py-3">
                                                        {t('orderPopup.itemsTable.bcExplorer')}
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {orderItems.map((order, index) => (
                                                    <tr
                                                        key={index}
                                                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 text-center"
                                                    >
                                                        <th
                                                            scope="row"
                                                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                                        >
                                                            {order.description}
                                                        </th>
                                                        <th
                                                            scope="row"
                                                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                                        >
                                                            {order.quantity}
                                                        </th>
                                                        <td className="px-6 py-4">{order.price}</td>
                                                        <td className="px-6 py-4">
                                                            <a
                                                                href={process.env.REACT_APP_BC_EXPLORER_URL_TEMPLATE?.replace(
                                                                    "{{txHash}}",
                                                                    order.trxHashes[order.trxHashes.length - 1] || ""
                                                                )}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="btn btn-ghost btn-circle"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                                                </svg>
                                                            </a>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ) : (
                                <Progress marginYClassName="my-52" />
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <Progress marginYClassName="my-72" />
            )}
        </main>
    );
}

export default SupplierOrders;

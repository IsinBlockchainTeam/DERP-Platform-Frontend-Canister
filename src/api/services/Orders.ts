import { ERPItemDto } from '../../dto/ERPItemDto';
import { NewOrderDto } from '../../dto/NewOrderDto';
import {
    OrderTotalDto,
    OrderDto,
    TransactionStatusDto,
} from '../../dto/OrderDto';
import { OrderTransactionDto } from '../../dto/OrderTransactionDto';
import api from '../api';
import { auth } from '../auth';
import { ErpOrderStatus } from '../../model/WondType';
import { OrderLine } from '../../dto/ERPOrderLineDto';
import { OfferDto } from '../../dto/OfferDto';
import { OrderPaymentDto } from '../../dto/OrderPaymentDto';
import { OfferLine } from '../../dto/OfferLine';
import { offersService } from './Offers';
import { LastOrderDetailsDto } from '../../dto/LastOrderDetailsDto';
import { QueryOrderDto } from '../../dto/QueryOrderDto';
import { LastOrderDetailsExpandedDto } from '../../dto/LastOrderDetailsExpandedDto';
import {
    CompleteOrderLineDto,
    CompleteOrderLineStatus,
    CompleteOrderLineTopic,
} from '../../dto/CompleteOrderLineDto';
import { OrderLineDto } from '../../dto/OrderLineDto';
import { CUSTOMER_TOKEN_KEY } from '../../constants';
import { CardInfoDto } from '../../dto/CardInfoDto';

let eventSource: EventSource;

export const ordersService = {
    getOrderLinesInfo: async (
        orderLines: OrderLine[],
    ): Promise<ERPItemDto[]> => {
        const items: ERPItemDto[] = [];
        const offers = new Map<string, OfferDto>();

        for (const line of orderLines) {
            const offer = offers.get(line.offerId);
            let offerLines: OfferLine[];

            if (offer) {
                offerLines = offer.offerLines;
            } else {
                const offer = await offersService.getOffer(line.offerId);
                offerLines = offer.offerLines;
                offers.set(line.offerId, offer);
            }

            const offerLine = offerLines.find((o) => o.id === line.offerLineId);

            if (!offerLine)
                throw new Error(
                    `Offerline with id ${line.offerLineId} not found`,
                );

            const it = items.find((i) => i.id === +offerLine.productId);
            if (!it) {
                items.push({
                    description: offerLine.description,
                    groups: offerLine.groups,
                    id: +offerLine.productId,
                    price: offerLine.price,
                    quantity: offerLine.quantity,
                    partialQuantity: 1,
                    trxHashes: [line.trxHash],
                });
            } else {
                it.quantity += offerLine.quantity;
                it.trxHashes.push(line.trxHash);
            }
        }

        return items;
    },

    getExpandedOrderLinesInfo: async (
        orderLines: OrderLine[],
    ): Promise<CompleteOrderLineDto[]> => {
        const items: CompleteOrderLineDto[] = [];
        const offers = new Map<string, OfferDto>();

        for (const line of orderLines) {
            const offer = offers.get(line.offerId);
            let offerLines: OfferLine[];

            if (offer) {
                offerLines = offer.offerLines;
            } else {
                const offer = await offersService.getOffer(line.offerId);
                offerLines = offer.offerLines;
                offers.set(line.offerId, offer);
            }

            const offerLine = offerLines.find((o) => o.id === line.offerLineId);

            if (!offerLine)
                throw new Error(
                    `Offerline with id ${line.offerLineId} not found`,
                );

            items.push({
                id: +offerLine.productId,
                description: offerLine.description,
                price: offerLine.price,
                checked: false,
                status: CompleteOrderLineStatus.SELECTABLE,
                offerId: line.offerId,
                offerLineId: line.offerLineId,
            });
        }

        return items;
    },

    getLastOrderDetails: async (): Promise<LastOrderDetailsDto> => {
        const res = await api.get<{
            id: string;
            orderLines: OrderLine[];
        }>('/api/orders/last/details', {
            headers: await auth.authenticatedHeaders(),
        });

        if (res.status === 204) return { id: '', orderLines: [] };

        const items = await ordersService.getOrderLinesInfo(
            res.data.orderLines,
        );

        return {
            id: res.data.id,
            orderLines: items,
        };
    },

    getLastOrderDetailsExpanded: async (
        orderId: string,
    ): Promise<LastOrderDetailsExpandedDto> => {
        const res = await api.get<OrderLine[]>(
            `/api/orders/${orderId}/details`,
            {
                headers: await auth.authenticatedHeaders(),
            },
        );
        const items = await ordersService.getExpandedOrderLinesInfo(res.data);

        return {
            orderLines: items,
        };
    },

    getLastOpenOrderId: async (): Promise<string> => {
        const res = await api.get<{ id: string }>('/api/orders/last/id', {
            headers: await auth.authenticatedHeaders(),
        });

        if (res.status === 204) throw new Error('No content');

        return res.data.id;
    },

    getSupplierOrders: async (
        queryOrder: QueryOrderDto,
    ): Promise<OrderDto[]> => {
        const res = await api.get<OrderDto[]>('/api/orders', {
            headers: await auth.authenticatedHeaders(),
            params: queryOrder,
        });
        return res.data.map((order: OrderDto) => ({
            ...order,
            date: new Date(order.date),
        }));
    },

    initPaymentTransaction: async (
        orderId: string,
        savePaymentInfo = false,
        cardInfo?: CardInfoDto,
    ): Promise<string> => {
        const res = await api.post<OrderTransactionDto>(
            `/api/orders/${orderId}/transaction`,
            {
                savePaymentInfo,
                cardInfo,
            },
            { headers: await auth.authenticatedHeaders() },
        );

        return res.data.transactionId;
    },

    initSplittedPaymentTransaction: async (
        orderId: string,
        savePaymentInfo = false,
        itemsToPay: OrderLineDto[],
        sseId: string,
        cardInfo?: CardInfoDto,
    ): Promise<string> => {
        const res = await api.post(
            `/api/orders/${orderId}/transaction`,
            {
                itemsToPay,
                sseId,
                savePaymentInfo,
                cardInfo,
            },
            { headers: await auth.authenticatedHeaders() },
        );

        return res.data.transactionId;
    },

    getReportInfo: async (orderId: string): Promise<OrderTotalDto> => {
        const res = await api.get<OrderTotalDto>(
            `/api/orders/${orderId}/total`,
            {
                headers: await auth.authenticatedHeaders(),
            },
        );
        return res.data;
    },

    createOrder: async (data: NewOrderDto): Promise<any> => {
        const res = await api.post(`/api/orders`, data, {
            headers: await auth.authenticatedHeaders(),
        });
        return res.data;
    },

    getOrderStatus: async (): Promise<ErpOrderStatus[]> => {
        const res = await api.get('/api/order-status');
        return res.data.orderStatuses;
    },

    getOrderDetails: async (orderId: string): Promise<ERPItemDto[]> => {
        const res = await api.get<OrderLine[]>(
            `/api/orders/${orderId}/details`,
            {
                headers: await auth.authenticatedHeaders(),
            },
        );

        const items = await ordersService.getOrderLinesInfo(res.data);
        return items;
    },

    getOrderPayments: async (orderId: string): Promise<OrderPaymentDto[]> => {
        const res = await api.get<OrderPaymentDto[]>(
            `/api/orders/${orderId}/payments`,
            {
                headers: await auth.authenticatedHeaders(),
            },
        );

        return res.data;
    },

    getBytesInvoice: async (transactionId: string) => {
        const res = await api.get<Blob>(
            `/api/orders/last/payed-invoice?trxId=${transactionId}`,
            {
                responseType: 'blob',
            },
        );

        return new Uint8Array(await res.data.arrayBuffer());
    },

    getPaidItems: async (orderId: string): Promise<OrderLineDto[]> => {
        const res = await api.get<OrderLineDto[]>(
            `/api/orders/${orderId}/payedItems`,
            {
                headers: await auth.authenticatedHeaders(),
            },
        );

        return res.data;
    },

    getAliases: async (): Promise<CardInfoDto[]> => {
        const res = await api.get<CardInfoDto[]>('/api/orders/aliases', {
            headers: await auth.authenticatedHeaders(),
        });

        let aliases = [] as CardInfoDto[];
        if (res.status === 200) aliases = res.data;

        return aliases;
    },

    onSelectionOrderLine: async (selectedOrderLine: {
        orderLine: OrderLineDto;
        topic: CompleteOrderLineTopic;
        sseId: string;
    }): Promise<void> => {
        await api.post('api/orders/line/selection', selectedOrderLine, {
            headers: await auth.authenticatedHeaders(),
        });
    },

    initEventSource: async (sseId: string) => {
        eventSource = new EventSource(
            `${
                window.location.origin
            }/api/orders/sse?sseId=${sseId}&customerToken=${localStorage.getItem(
                CUSTOMER_TOKEN_KEY,
            )}`,
        );
        eventSource.onmessage = () => {
            return;
        };
    },

    setEventSourceHandler(
        onmessage: (this: EventSource, ev: MessageEvent<any>) => any,
    ) {
        eventSource.onmessage = onmessage;
    },

    getSelectedItems: async () => {
        const res = await api.get<{
            selected: OrderLineDto[];
            inPayment: (OrderLineDto & { sseId: string })[];
        }>(`/api/orders/selectedItems`, {
            headers: await auth.authenticatedHeaders(),
        });

        return res.data;
    },

    signalPaymentFailure: async (transactionId: string) => {
        await api.post(
            `/api/orders/transaction/${transactionId}/fail`,
            {},
            { headers: await auth.authenticatedHeaders() },
        );
    },

    signalPaymentCanceled: async (transactionId: string) => {
        await api.post(
            `/api/orders/transaction/${transactionId}/cancel`,
            {},
            { headers: await auth.authenticatedHeaders() },
        );
    },

    getTrxStatus: async (trxId: string): Promise<TransactionStatusDto> => {
        const res = await api.get<TransactionStatusDto>(
            `/api/transactions/${trxId}/status`,
        );

        if (res.status !== 200) {
            console.error(res);
            throw new Error(
                `Unexpected response from server: ${res.status} ${res.statusText}`,
            );
        }

        return res.data;
    },

    getInvoiceProxyUrl: (url: string): string => {
        return `/api/invoice?url=${url}`;
    }
};

import {
    OrderDto,
    TransactionStatusDto,
} from '../../dto/OrderDto';
import { OrderTransactionDto } from '../../dto/OrderTransactionDto';
import api from '../api';
import { auth } from '../auth';
import { OfferLineDto, Unique } from '../../dto/OfferLine';
import { offersService } from './Offers';
import { QueryOrderDto } from '../../dto/QueryOrderDto';
import { OrderLineDto } from '../../dto/OrderLineDto';
import { CardInfoDto } from '../../dto/CardInfoDto';
import { InvoiceItemDto } from '../../dto/Invoices';


export const ordersService = {
    getOrderlines: async (storeId: number, orderId: number): Promise<OrderLineDto[]> => {
        const res = await api.get<OrderLineDto[]>(`/api/orders/${orderId}/details`, {
            headers: await auth.authenticatedHeaders(),
            params: {storeId},
        });
        
        return res.data;
    },

    getOfferlinesFromInvoiceItems: async (
        invoiceItems: InvoiceItemDto[],
    ): Promise<Unique<OfferLineDto>[]> => {
        const uniqueOrderIds = Array.from(new Set(invoiceItems.map((o) => o.orderId))).filter((id) => id !== undefined);
        const orderLines = (await Promise.all(uniqueOrderIds.map((id) => ordersService.getOrderlines(0, id!)))).flat();

        const uniqueOfferIds = Array.from(new Set(orderLines.map((o) => o.offerId)));
        const offers = await Promise.all(uniqueOfferIds.map(id => offersService.getOffer(id)));
        const result = [] as Unique<OfferLineDto>[];

        for (const line of orderLines) {
            // TODO: get offerline
            const offerLine = offers.find((o) => o.id === line.offerId)?.offerLines.find((l) => l.id === line.offerLineId);
            if(!offerLine) throw new Error(`Offerline with id ${line.offerLineId} not found`);
            
            const it = result.find((o) => o.id === offerLine.id);
            if (!it) {
                result.push({
                    id: offerLine.id,
                    description: offerLine.description,
                    price: offerLine.price,
                    quantity: offerLine.quantity,
                    offerId: line.offerId,
                    productId: offerLine.productId,
                    repeat: 1,
                });
            } else {
                it.repeat += offerLine.quantity;
            }
        }

        return result;
    },

    getLastOpenOrderId: async (): Promise<number> => {
        const res = await api.get<{ id: number }>('/api/orders/last/id', {
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
        orderId: number,
        savePaymentInfo = false,
        cardInfo?: CardInfoDto,
    ): Promise<string> => {
        const res = await api.post<OrderTransactionDto>(
            `/api/payments/orders/${orderId}`,
            {
                savePaymentInfo,
                cardInfo,
            },
            { headers: await auth.authenticatedHeaders() },
        );

        return res.data.transactionId;
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

    getAliases: async (): Promise<CardInfoDto[]> => {
        const res = await api.get<CardInfoDto[]>('/api/orders/aliases', {
            headers: await auth.authenticatedHeaders(),
        });

        let aliases = [] as CardInfoDto[];
        if (res.status === 200) aliases = res.data;

        return aliases;
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

    getPaymentReceiptUrl: (paymentId: number): string => {
        let base = process.env.REACT_APP_BACKEND_URL;
        base = base?.endsWith('/') ? base.slice(0, -1) : base;
        return `${base}/payments/${paymentId}/receipt`;
    }
};

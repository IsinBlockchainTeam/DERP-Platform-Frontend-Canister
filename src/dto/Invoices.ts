import {StoreDto} from "./stores/StoreDto";

export type ItemVatDto = {
    description: string;
    gross: number;
    net: number;
    vat: number;
    vatPct: number;
};

type ItemPayDto = {
    paymentId?: number;
}

export enum ItemPayType {
    WITH_ORDER_LINE= 'WITH_ORDER_LINE',
    WITHOUT_ORDER_LINE = 'WITHOUT_ORDER_LINE',
    EXTERNAL_ORDER = 'EXTERNAL_ORDER'
}

export type ItemPayExternalDto = ItemPayDto & {
    type: ItemPayType.EXTERNAL_ORDER;
    amount: number;
};

export type ItemPayWithOrderLineDto = ItemPayDto & {
    type: ItemPayType.WITH_ORDER_LINE;
    orderId: number;
    orderLineId: number;
};

export type ItemPayWithoutOrderLineDto = ItemPayDto & {
    type: ItemPayType.WITHOUT_ORDER_LINE;
    orderId: number;
    amount: number;
};

export type ItemPayDtoUnion = ItemPayExternalDto | ItemPayWithOrderLineDto | ItemPayWithoutOrderLineDto;

export interface InvoiceList<T> {
    invoices: T[];
}

export interface BaseInvoiceDto {
    id: number;
    docId: string;
    pdfUrls: string[];
    issueTimestamp: Date;
    expirationTimestamp: Date;
    supplier?: StoreDto;
    supplierUrl: string;
    customerUrl: string;
    totalGross: number;
    totalNet: number;
    totalVat: number;
    vats: ItemVatDto[];
    toPayList: ItemPayDtoUnion[];
}

export interface InvoiceDto extends BaseInvoiceDto {
    supplier: undefined;
}

export interface InvoiceWithStore extends BaseInvoiceDto {
    supplier: StoreDto;
}

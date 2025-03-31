import {StoreDto} from "./stores/StoreDto";

export enum InvoiceItemType {
    // external invoice item, details not registered in the system
    EXTERNAL = 'EXTERNAL',

    // invoice item related to an order in DERP
    ORDER = 'ORDER',
}

export interface InvoiceItemDto {
    id: number;
    type: InvoiceItemType;
    orderId?: number;
    orderLineId?: number;
    amount?: number;
}

export interface ItemVatDto {
    description: string;
    gross: number;
    net: number;
    vat: number;
    vatPct: number;
}

export interface InvoiceDto {
    id: number;
    docId: string;
    pdfUrls: string[];
    issueDate: Date;
    expiryDate: Date;
    customerId?: string;
    storeId: number;
    totalGross: number;
    totalNet: number;
    totalVat: number;
    vats: ItemVatDto[];
    items: InvoiceItemDto[];
}

export interface InvoiceWithStore extends InvoiceDto {
    store: StoreDto;
}

export interface InvoiceList<T> {
    invoices: T[];
}
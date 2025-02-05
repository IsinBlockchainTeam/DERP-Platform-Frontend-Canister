export interface CompleteOrderLineDto {
    id: number;
    description: string;
    price: number;
    checked: boolean;
    status: CompleteOrderLineStatus;
    offerId: string;
    offerLineId: string;
    payerSseId?: string;
}

export enum CompleteOrderLineStatus {
    PAID = 'paid',
    SELECTABLE = 'selectable',
    SELECTED_BY_ME = 'selected_by_me',
    SELECTED_BY_OTHERS = 'selected_by_others',
    IN_PAYMENT = 'in_payment',
}

export enum CompleteOrderLineTopic {
    SELECTED = 'selected',
    UNSELECTED = 'unselected',
    STEAL_SELECTION = 'steal_selection',
    IN_PAYMENT = 'in_payment',
    PAYMENT_CONFIRMED = 'payment_confirmed',
    PAYMENT_FAILED = 'payment_failed',
}
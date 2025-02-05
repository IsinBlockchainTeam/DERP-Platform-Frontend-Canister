export enum BcStatus {
    VERIFIED = 'verified',
    NOT_VERIFIED = 'not_verified',
    LOADING = 'loading'
}

export interface CheckedOrderPayment {
    transactionId: string;
    invoiceUrl: string;
    bcStatus: BcStatus;
    trxHash?: string;
}
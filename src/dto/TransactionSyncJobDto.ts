export enum TransactionSyncJobType {
    ERP = 'erp',
    INTERNAL = 'internal',
    BANK = 'bank'
}

export interface TransactionSyncJobDto {
    type: TransactionSyncJobType;
    cron: string;
    enabled: boolean;
}

export interface TransactionSyncJobDtoWithId extends TransactionSyncJobDto {
    id: string;
    lastRun: Date | null;
}
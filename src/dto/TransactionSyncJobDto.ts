export enum TransactionSyncJobType {
    ERP = 'erp',
    INTERNAL = 'internal',
    BANK = 'bank'
}

export interface TransactionSyncJobDto {
    type: TransactionSyncJobType;
    cron: string;
    enabled: boolean;
    dayRolloverTime?: string; // Optional field for ERP type jobs
}

export interface TransactionSyncJobDtoWithId extends TransactionSyncJobDto {
    id: string;
    lastRun: Date | null;
}
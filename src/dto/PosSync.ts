export interface PosSyncJobDto {
    cron: string;
    enabled: boolean;
}

export interface PosSyncJobDtoWithId extends PosSyncJobDto {
    id: string;
    lastRun: Date | null;
}

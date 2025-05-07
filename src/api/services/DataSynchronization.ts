import { TransactionSyncJobDto, TransactionSyncJobDtoWithId } from "../../dto/TransactionSyncJobDto";
import api from "../api";
import { auth } from "../auth";

export const dataSynchronizationService = {
    runNow: async (scheduleId: string) => {
        const response = await api.post(`/sync-jobs/transactions/${scheduleId}/run`, {}, {
            headers: await auth.authenticatedHeaders(),
        });

        if (response.status !== 200 && response.status !== 201) {
            throw new Error('Error running data synchronization job');
        }
    },
    list: async (storeId: number) => {
        const response = await api.get<TransactionSyncJobDtoWithId[]>('/sync-jobs/transactions', {
            headers: await auth.authenticatedHeaders(),
            params: {
                storeId
            }
        });

        if (response.status === 204) {
            return [];
        }

        if (response.status !== 200) {
            throw new Error('Error getting data synchronization jobs');
        }

        return response.data.map(job => ({
            ...job,
            lastRun: job.lastRun ? new Date(job.lastRun) : null
        }));
    },

    create: async (storeId: number, job: TransactionSyncJobDto) => {
        const response = await api.post('/sync-jobs/transactions', job, {
            headers: await auth.authenticatedHeaders(),
            params: {
                storeId
            }
        });

        if (response.status !== 201) {
            throw new Error('Error creating data synchronization job');
        }
    },

    update: async (storeId: number, job: TransactionSyncJobDtoWithId) => {
        const response = await api.put(`/sync-jobs/transactions/${job.id}`, job, {
            headers: await auth.authenticatedHeaders(),
            params: {
                storeId
            }
        });

        if (response.status !== 200) {
            throw new Error('Error updating data synchronization job');
        }
    }

}
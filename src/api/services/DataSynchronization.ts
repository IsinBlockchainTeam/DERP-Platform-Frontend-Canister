import { TransactionSyncJobDto, TransactionSyncJobDtoWithId } from "../../dto/TransactionSyncJobDto";
import api from "../api";
import { auth } from "../auth";

export const dataSynchronizationService = {
  list: async (storeUrl: string) => {
    const response = await api.get<TransactionSyncJobDtoWithId[]>('/sync-jobs/transactions', {
      headers: await auth.authenticatedHeaders(),
      params: {
        storeUrl
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

  create: async (storeUrl: string, job: TransactionSyncJobDto) => {
    const response = await api.post('/sync-jobs/transactions', job, {
      headers: await auth.authenticatedHeaders(),
      params: {
        storeUrl
      }
    });

    if (response.status !== 201) {
      throw new Error('Error creating data synchronization job');
    }
  },
  
  update: async (storeUrl: string, job: TransactionSyncJobDtoWithId) => {
    const response = await api.put(`/sync-jobs/transactions/${job.id}`, job, {
      headers: await auth.authenticatedHeaders(),
      params: {
        storeUrl
      }
    });
    
    if (response.status !== 200) {
      throw new Error('Error updating data synchronization job');
    }
  }

}
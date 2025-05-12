import { CreateTableDto } from '../../dto/CreateTableDto';
import { CreateStoreDto, StoreDto } from '../../dto/stores/StoreDto';
import { TableDto } from '../../dto/TableDto';
import { PosType } from '../../model/PosType';
import api from '../api';
import { auth } from '../auth';

export const storeService = {
    createStore: async (
        store: CreateStoreDto,
        merchantId: number,
    ): Promise<StoreDto> => {
        const res = await api.post(`/stores`, store, {
            headers: await auth.authenticatedHeaders(),
            params: { merchantId },
        });

        return res.data;
    },

    getStore: async (storeId: number): Promise<StoreDto> => {
        const res = await api.get<StoreDto>(`/stores/store`, {
            headers: await auth.authenticatedHeaders(),
            params: { storeId },
        });

        return res.data;
    },

    updateStore: async (
        storeUrl: string,
        name: string,
        address: string,
        city: string,
        cap: number,
    ): Promise<void> => {
        await api.put(
            `/stores`,
            { name, address, city, cap },
            {
                params: {storeUrl},
                headers: await auth.authenticatedHeaders(),
            },
        );
    },

    updateStoreColor: async (storeId: number, color: string): Promise<void> => {
        await api.put(
            '/stores/update-color',
            {
                color,
            },
            {
                params: {storeId},
                headers: await auth.authenticatedHeaders(),
            },
        );
    },

    updateStoreFont: async (storeId: number, font: string): Promise<void> => {
        await api.put(
            '/stores/update-font',
            {
                font,
            },
            {
                params: {storeId},
                headers: await auth.authenticatedHeaders(),
            },
        );
    },

    list: async (merchantId?: string): Promise<StoreDto[]> => {
        const params = merchantId ? { merchantId } : {};
        const res = await api.get<{ stores: StoreDto[] }>(`/stores`, { params });
        return res.data.stores;
    },

    listMine: async (): Promise<StoreDto[]> => {
        const res = await api.get<{ stores: StoreDto[] }>(`/stores/my-stores`, {
            headers: await auth.authenticatedHeaders(),
        });

        return res.data.stores;
    },

    getStoreEssentialInfo: async (): Promise<{
        color: string;
        name: string;
        font: string;
    }> => {
        const res = await api.get<{
            color: string;
            name: string;
            font: string;
        }>(`/stores/store-essential-info`, {
            headers: await auth.authenticatedHeaders(),
        });

        return res.data;
    },

    uploadImage: async (storeId: number, formData: FormData): Promise<{ imageUrl: string }> => {
        const res = await api.post<{ imageUrl: string }>(
            `/stores/image`,
            formData,
            {
                params: {storeId},
                headers: {
                    ...(await auth.authenticatedHeaders()),
                    'Content-Type': 'multipart/form-data',
                },
            },
        );

        return res.data;
    },

    listTables: async (storeId: number): Promise<TableDto[]> => {
        const res = await api.get<TableDto[]>(`/stores/tables`, {
            headers: await auth.authenticatedHeaders(),
            params: {
                storeId,
            },
        });

        return res.data;
    },

    createTable: async (storeId: number, dto: CreateTableDto): Promise<TableDto> => {
        const res = await api.post<TableDto>(`/stores/tables`, dto, {
            params: {storeId},
            headers: await auth.authenticatedHeaders(),
        });

        return res.data;
    },

    getFontNames: async () => {
        const res = await api.get<{ fontNames: string[] }>(
            '/stores/font-names',
            {
                headers: await auth.authenticatedHeaders(),
            },
        );

        return res.data.fontNames;
    },
};

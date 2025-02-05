import { CreateStoreDto, StoreDto } from '../../dto/stores/StoreDto';
import { MySuppliersList, StoreList } from '../../dto/stores/StoreList';
import api from '../api';
import { auth } from '../auth';
import { WondType } from '../../model/WondType';
import { TableDto } from '../../dto/TableDto';
import { CreateTcposTableDto } from '../../dto/CreateTableDto';

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

    getStore: async (storeUrl: string): Promise<StoreDto> => {
        const res = await api.get<StoreDto>(`/stores/store`, {
            headers: await auth.authenticatedHeaders(),
            params: { storeUrl },
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

    updateStoreColor: async (storeUrl: string, color: string): Promise<void> => {
        await api.put(
            '/stores/update-color',
            {
                color,
            },
            {
                params: {storeUrl},
                headers: await auth.authenticatedHeaders(),
            },
        );
    },

    updateStoreFont: async (storeUrl: string, font: string): Promise<void> => {
        await api.put(
            '/stores/update-font',
            {
                font,
            },
            {
                params: {storeUrl},
                headers: await auth.authenticatedHeaders(),
            },
        );
    },

    getErpTypes: async (): Promise<string[]> => {
        const res = await api.get(`/stores/erp-types`);
        return res.data.erpTypes;
    },

    list: async (merchantId?: string): Promise<StoreDto[]> => {
        const params = merchantId ? { merchantId } : {};
        const res = await api.get<StoreList>(`/stores`, { params });
        return res.data.stores;
    },

    listMine: async (): Promise<StoreDto[]> => {
        const res = await api.get<StoreList>(`/stores/my-stores`, {
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

    uploadImage: async (storeUrl: string, formData: FormData): Promise<{ imageUrl: string }> => {
        const res = await api.post<{ imageUrl: string }>(
            `/stores/image`,
            formData,
            {
                params: {storeUrl},
                headers: {
                    ...(await auth.authenticatedHeaders()),
                    'Content-Type': 'multipart/form-data',
                },
            },
        );

        return res.data;
    },

    getStoreCredentials: async (
        erpCredentialsUrl: string,
        storeUrl: string,
        erpType: WondType,
    ): Promise<{ username: string; password: string; shopId: number }> => {
        const res = await api.get<{
            username: string;
            password: string;
            shopId: number;
        }>('/stores/store-erp-credentials', {
            headers: await auth.authenticatedHeaders(),
            params: {
                erpCredentialsUrl,
                storeUrl,
                erpType,
            },
        });

        return res.data;
    },

    listTables: async (storeUrl: string): Promise<TableDto[]> => {
        const res = await api.get<TableDto[]>(`/stores/tables`, {
            headers: await auth.authenticatedHeaders(),
            params: {
                storeUrl,
            },
        });

        return res.data;
    },

    createTcposTable: async (storeUrl: string, dto: CreateTcposTableDto): Promise<TableDto> => {
        const res = await api.post<TableDto>(`/stores/tables`, dto, {
            params: {storeUrl},
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

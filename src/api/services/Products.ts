import {ERPProductDto} from '../../dto/ERPProductDto';
import {ProductGroup, VatGroup} from '../../dto/ProductGroup';
import api from '../api';
import {auth} from '../auth';

export const productsService = {
    getProducts: async (storeUrl?: string): Promise<ERPProductDto[]> => {
        const res = await api.get(`/api/products`, {
            headers: await auth.authenticatedHeaders(),
            params: {storeUrl}
        });
        return res.data;
    },

    listProductGroups: async (storeUrl: string): Promise<ProductGroup[]> => {
        const res = await api.get(`/api/productGroups`, {
            headers: await auth.authenticatedHeaders(),
            params: {storeUrl}
        });

        return res.data;
    },

    listVatGroups: async (storeUrl: string): Promise<VatGroup[]> => {
        const res = await api.get(`/api/vatGroups`, {
            headers: await auth.authenticatedHeaders(),
            params: {storeUrl}
        });

        return res.data;
    }
};
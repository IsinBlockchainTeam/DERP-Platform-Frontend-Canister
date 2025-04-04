import { ProductDto } from '../../dto/ProductDto';
import {ProductGroup, VatGroup} from '../../dto/ProductGroup';
import api from '../api';
import {auth} from '../auth';

export const productsService = {
    getProducts: async (storeId?: number): Promise<ProductDto[]> => {
        const res = await api.get(`/api/products`, {
            headers: await auth.authenticatedHeaders(),
            params: {storeId}
        });
        return res.data;
    },

    listProductGroups: async (storeId: number): Promise<ProductGroup[]> => {
        const res = await api.get(`/api/productGroups`, {
            headers: await auth.authenticatedHeaders(),
            params: {storeId}
        });

        return res.data;
    },

    listVatGroups: async (storeId: number): Promise<VatGroup[]> => {
        const res = await api.get(`/api/vatGroups`, {
            headers: await auth.authenticatedHeaders(),
            params: {storeId}
        });

        return res.data;
    }
};
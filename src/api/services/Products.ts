import {ERPProductDto} from '../../dto/ERPProductDto';
import api from '../api';
import {auth} from '../auth';

export const productsService = {
    getProducts: async (storeUrl?: string): Promise<ERPProductDto[]> => {
        const res = await api.get(`/api/products`, {
            headers: await auth.authenticatedHeaders(),
            params: {storeUrl}
        });
        return res.data;
    }
};
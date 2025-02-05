import api from '../api';
import { auth } from '../auth';
import {
    CreateCompanyDto,
    CreatedCompanyDto,
    InfoCompanyDto,
} from '../../dto/CompanyDto';

export const companyService = {
    createCompanyInfo: async (
        newCompanyInfo: CreateCompanyDto,
    ): Promise<CreatedCompanyDto> => {
        const res = await api.post(`/company`, newCompanyInfo, {
            headers: await auth.authenticatedHeaders(),
        });

        if (res.status !== 201) {
            throw new Error('Error creating company info content');
        }
        return res.data;
    },

    findAll: async (filters?: {reseller?: string, type?: string}): Promise<InfoCompanyDto[]> => {
        const res = await api.get('/company', {
            headers: await auth.authenticatedHeaders(),
            params: filters
        });

        if (res.status !== 200) {
            throw new Error('Error fetching company info content');
        }

        return res.data;
    },

    getById: async (companyId: number): Promise<InfoCompanyDto> => {
        const res = await api.get(`/company/${companyId}`, {
            headers: await auth.authenticatedHeaders(),
        });

        if (res.status !== 200) {
            throw new Error('Error fetching company info content');
        }

        return res.data;
    },
};

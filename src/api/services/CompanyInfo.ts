import {CompanyInfoDto} from "../../dto/CompanyInfoDto";
import {auth} from "../auth";
import api from "../api";
import {RegisterUserResponseDto} from "../../dto/auth/RegisterUserDto";

export const companyInfoService = {

    createCompanyInfo: async (companyInfo: CompanyInfoDto, supplier?: RegisterUserResponseDto): Promise<void> => {
        const res = await api.post(`/company-info`, {companyInfo, supplier}, {headers: await auth.authenticatedHeaders()});

        if (res.status !== 201) {
            throw new Error('Error creating company info content');
        }
    },

    getCompanyInfo: async (): Promise<CompanyInfoDto | undefined> => {
        const res = await api.get<CompanyInfoDto>(`/company-info`, {headers: await auth.authenticatedHeaders()});

        if (res.status === 204) {
            return undefined;
        }

        if (res.status !== 200) {
            throw new Error('Error getting company info content');
        }
        return res.data;
    },

    updateCompanyInfo: async (companyInfo: CompanyInfoDto, supplierWebId?: string): Promise<void> => {
        const res = await api.put(`/company-info`, {companyInfo, supplierWebId}, {headers: await auth.authenticatedHeaders()});

        if (res.status !== 200) {
            throw new Error('Error updating company info content');
        }
    },

    getCompanyInfoBySupplierWebId: async (supplierWebId: string): Promise<CompanyInfoDto | undefined> => {
        const res = await api.get<CompanyInfoDto>(`/company-info/supplier`, {
            headers: await auth.authenticatedHeaders(),
            params: {supplierWebId: encodeURI(supplierWebId)}
        });

        if (res.status === 204) {
            return undefined;
        }

        if (res.status !== 200) {
            throw new Error('Error getting company info content');
        }

        return res.data;
    }
}

import api from "../api";
import { auth } from "../auth";
import { SupplierPublicDto, SupplierPrivateDto, RegisterSupplierDto } from "../../dto/stores/StoreList";

export const relationsService = {
    async getMySuppliers(storeId?: number): Promise<SupplierPrivateDto[]> {
        const resp = await api.get<SupplierPrivateDto[]>(`/api/rel/suppliers`,
            { params: { storeId }, headers: await auth.authenticatedHeaders() }
        );

        return resp.data;
    },

    async getCustomers(storeId?: number): Promise<SupplierPublicDto[]> {
        let params = {};
        if (storeId) {
            params = { storeId };
        }

        const resp = await api.get<SupplierPublicDto[]>(`/api/rel/customers`,
            { params, headers: await auth.authenticatedHeaders() }
        );

        return resp.data;
    },

    async addSupplier(supplierStoreId?: number, name?: string, forStoreId?: number): Promise<void> {
        let params = {};
        if (forStoreId) {
            params = { storeId: forStoreId };
        }


        params = { ...params, storeToAddId: supplierStoreId };
        await api.post<SupplierPrivateDto, RegisterSupplierDto>(`/api/rel/suppliers`,
            { name, representsStoreId: supplierStoreId },
            { headers: await auth.authenticatedHeaders(), params }
        );
    },

    async removeSupplier(supplierId: number, fromStoreId?: number): Promise<void> {
        let params = {};
        if (fromStoreId) {
            params = { storeId: fromStoreId };
        }

        params = { ...params, supplierId };
        await api.delete(`/api/rel/suppliers`,
            { headers: await auth.authenticatedHeaders(), params }
        );
    }
}

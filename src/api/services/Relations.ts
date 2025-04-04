import {StoreDto} from "../../dto/stores/StoreDto";
import {MySupplier, MySuppliersList} from "../../dto/stores/StoreList";
import api from "../api";
import {auth} from "../auth";

export type MyCustomer = MySupplier;

export const relationsService = {
  async getSuppliers(storeId?: number): Promise<MySupplier[]> {
    const resp = await api.get<MySuppliersList>(`/api/rel/suppliers`,
      { params: {storeId}, headers: await auth.authenticatedHeaders()}
    );

    return resp.data.stores;
  },

  async getCustomers(storeId?: number): Promise<MyCustomer[]> {
    let params = {};
    if (storeId) {
      params = {storeId};
    }

    const resp = await api.get<MySuppliersList>(`/api/rel/customers`,
      { params, headers: await auth.authenticatedHeaders()}
    );

    return resp.data.stores;
  },

  async addSupplier(supplierStoreId: number, supplierExternalID: string, forStoreId?: number): Promise<void> {
    let params = {};
    if (forStoreId) {
      params = {storeId: forStoreId};
    }

    params = {...params, storeToAddId: supplierStoreId};
    await api.post(`/api/rel/suppliers`,
      {supplierExternalID},
      { headers: await auth.authenticatedHeaders(), params }
    );
  },

  async removeSupplier(supplierStoreId: number, fromStoreId?: number): Promise<void> {
    let params = {};
    if (fromStoreId) {
      params = {storeId: fromStoreId};
    }

    params = {...params, storeToRemoveId: supplierStoreId};
    await api.delete(`/api/rel/suppliers`,
      { headers: await auth.authenticatedHeaders(), params }
    );
  }
}

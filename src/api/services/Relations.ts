import {StoreDto} from "../../dto/stores/StoreDto";
import {MySupplier, MySuppliersList} from "../../dto/stores/StoreList";
import api from "../api";
import {auth} from "../auth";

export type MyCustomer = MySupplier;

export const relationsService = {
  async getSuppliers(storeUrl?: string): Promise<MySupplier[]> {
    const resp = await api.get<MySuppliersList>(`/api/rel/suppliers`,
      { params: {storeUrl}, headers: await auth.authenticatedHeaders()}
    );

    return resp.data.stores;
  },

  async getCustomers(storeUrl?: string): Promise<MyCustomer[]> {
    let params = {};
    if (storeUrl) {
      params = {storeUrl};
    }

    const resp = await api.get<MySuppliersList>(`/api/rel/customers`,
      { params, headers: await auth.authenticatedHeaders()}
    );

    return resp.data.stores;
  },

  async addSupplier(supplierUrl: string, supplierExternalID: string, storeUrl?: string): Promise<void> {
    let params = {};
    if (storeUrl) {
      params = {storeUrl};
    }

    params = {...params, storeToAddUrl: supplierUrl};
    await api.post(`/api/rel/suppliers`,
      {supplierExternalID},
      { headers: await auth.authenticatedHeaders(), params }
    );
  },

  async removeSupplier(supplierUrl: string, storeUrl?: string): Promise<void> {
    let params = {};
    if (storeUrl) {
      params = {storeUrl};
    }

    params = {...params, storeToRemoveUrl: supplierUrl};
    await api.delete(`/api/rel/suppliers`,
      { headers: await auth.authenticatedHeaders(), params }
    );
  }
}

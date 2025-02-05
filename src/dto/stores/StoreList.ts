import {StoreDto} from "./StoreDto";

export interface StoreList {
  stores: StoreDto[];
}

export interface MySuppliersList {
  stores: MySupplier[]
}

export interface MySupplier {
  store: StoreDto,
  options: {
    supplierExternalID: string
  }
}

export interface Supplier {
  email: string,
  webId: string,
}
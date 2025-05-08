import {StoreDto} from "./StoreDto";

export type SupplierPublicDto = {
    id: number;
    representsStore?: StoreDto;
    name?: string;
}

export type RegisterSupplierDto = {
    representsStoreId: number;
    name: string;
}


export type SupplierPrivateDto = SupplierPublicDto & {
    token: string;
}
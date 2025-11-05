import { PosType } from "../../model/PosType";

export interface WritableStoreDto {
    name: string;
    address: string;
    additionalInfo: string;
    postalCodeAndLocation: string;
    canton?: string;
    country?: string;
    color: string;
    font: string;
}

export interface StoreDto extends WritableStoreDto {
    id: number;
    imageUrl: string;
    canisterId: string;
}

export interface CreateStoreDto {
    name: string;
    address: string;
    additionalInfo: string;
    postalCodeAndLocation: string;
    canton?: string;
    country?: string;
}

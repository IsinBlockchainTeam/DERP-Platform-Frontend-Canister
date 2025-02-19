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
    bcPrivateKey: string;
    bcAddress: string;
}

export interface StoreDto extends WritableStoreDto {
    id: number;
    url: string;
    imageUrl: string;
}

export interface CreateStoreDto {
    name: string;
    address: string;
    additionalInfo: string;
    postalCodeAndLocation: string;
    canton?: string;
    country?: string;
    bcPrivateKey: string;
    bcAddress: string;
}

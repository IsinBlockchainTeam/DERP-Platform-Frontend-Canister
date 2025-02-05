import { WondType } from '../../model/WondType';

export interface WritableStoreDto {
    name: string;
    address: string;
    additionalInfo: string;
    postalCodeAndLocation: string;
    canton?: string;
    country?: string;
    color: string;
    erpUrl: string;
    font: string;
    bcPrivateKey: string;
    bcAddress: string;
}

export interface StoreDto extends WritableStoreDto {
    id: number;
    url: string;
    erpType: WondType;
    imageUrl: string;
    associationId: number;
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

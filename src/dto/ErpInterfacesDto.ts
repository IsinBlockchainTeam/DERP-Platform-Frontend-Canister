import { WondType } from '../model/WondType';

export enum InterfaceType {
    WOND = 'wond',
    KUMO = 'kumo',
    EBICS = 'ebics'
}

export interface CreateInterfaceReqDto {
    interfaceType: InterfaceType;
    name: string;
    url: string;
}

export interface CreateKumoInterfaceReqDto extends CreateInterfaceReqDto {
    username: string;
    password: string;
}

export interface CreateWondInterfaceReqDto extends CreateInterfaceReqDto {
    wondType: WondType;
}

export interface CreateEbicsInterfaceRequestDto extends CreateInterfaceReqDto {
    bankName: string;
    url: string;
    partnerId: string;
    userId: string;
    hostId: string;
    passphrase: string;
}

export interface CreateTcposInterfaceReqDto extends CreateWondInterfaceReqDto {
    username: string;
    password: string;
}

export interface CreateLightspeedInterfaceReqDto extends CreateWondInterfaceReqDto {
    apiKey: string;
}

// Update
// Parent
export interface UpdateInterfaceReqDto {
    id: number;
    interfaceType: InterfaceType;
    url: string;
}

export interface UpdateWondInterfaceReqDto extends UpdateInterfaceReqDto {
    wondType: WondType;
}

export interface UpdateKumoInterfaceReqDto extends UpdateInterfaceReqDto {
    username: string;
    password: string;
}

export interface UpdateEbicsInterfaceReqDto extends UpdateInterfaceReqDto {
    username: string;
    password: string;
}

export interface UpdateTcposInterfaceReqDto extends UpdateWondInterfaceReqDto {
    username: string;
    password: string;
}

export interface UpdateLightspeedInterfaceReqDto extends UpdateWondInterfaceReqDto {
    apiKey: string;
}

export interface InterfaceResponseDto {
    id: number;
    name: string;
    interfaceType: InterfaceType;
    url: string;
}

export interface WondInterfaceResponseDto extends InterfaceResponseDto {
    wondType: WondType;
}

export interface KumoInterfaceResponseDto extends InterfaceResponseDto {
    username: string;
    password: string;
}

export interface EbicsInterfaceResponseDto extends InterfaceResponseDto {
    username: string;
    password: string;

}

export interface TcposInterfaceResponseDto extends WondInterfaceResponseDto {
    username: string;
    password: string;
}

export interface LightspeedInterfaceResponseDto extends WondInterfaceResponseDto {
    apiKey: string;
}

export interface CreateAssociationReqDto {
    interfaceId: number;
    interfaceType: InterfaceType;
}

export interface CreateTcposAssociationReqDto extends CreateAssociationReqDto {
    shopId: number;
}

export interface CreateLightspeedAssociationReqDto extends CreateAssociationReqDto {
    key: number;
}

export interface UpdateAssociationReqDto {
    interfaceId: number;
    interfaceType: InterfaceType;
}

export interface UpdateTcposAssociationReqDto extends UpdateAssociationReqDto {
    shopId: number;
}

export interface UpdateLightspeedAssociationReqDto extends UpdateAssociationReqDto {
    key: number;
}

export interface AssociationResponseDto {
    id: number;
    storeId: number;
    interfaceId: number;
    interfaceType: InterfaceType;
}

export type EbicsAssociationResponseDto = AssociationResponseDto;

export interface KumoAssociationResponseDto extends AssociationResponseDto {
    shopId: number;
}

export interface WondAssociationResponseDto extends AssociationResponseDto {
    wondType: WondType;
}

export interface LightspeedAssociationResponseDto extends WondAssociationResponseDto {
    key: number;
}

export interface TcposAssociationResponseDto extends WondAssociationResponseDto {
    shopId: number;
}


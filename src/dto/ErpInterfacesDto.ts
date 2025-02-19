import { PosType } from "../model/PosType";

export enum InterfaceStatus {
    ACTIVE = 'active',
    PENDING = 'pending'
}

export enum InterfaceType {
    POS = 'pos',
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

export interface CreatePosInterfaceReqDto extends CreateInterfaceReqDto {
    posType: PosType;
}

export interface CreateEbicsInterfaceRequestDto extends CreateInterfaceReqDto {
    bankName: string;
    url: string;
    partnerId: string;
    userId: string;
    hostId: string;
    passphrase: string;
}

export interface CreateTcposInterfaceReqDto extends CreatePosInterfaceReqDto {
    username: string;
    password: string;
}

export interface CreateLightspeedInterfaceReqDto extends CreatePosInterfaceReqDto {
    apiKey: string;
}

// Update
// Parent
export interface UpdateInterfaceReqDto {
    id: number;
    interfaceType: InterfaceType;
    url: string;
}

export interface UpdatePosInterfaceReqDto extends UpdateInterfaceReqDto {
    posType: PosType;
}

export interface UpdateKumoInterfaceReqDto extends UpdateInterfaceReqDto {
    username: string;
    password: string;
}

export interface UpdateEbicsInterfaceReqDto extends UpdateInterfaceReqDto {
    username: string;
    password: string;
}

export interface UpdateTcposInterfaceReqDto extends UpdatePosInterfaceReqDto {
    username: string;
    password: string;
}

export interface UpdateLightspeedInterfaceReqDto extends UpdatePosInterfaceReqDto {
    apiKey: string;
}

export interface InterfaceResponseDto {
    id: number;
    name: string;
    interfaceType: InterfaceType;
    url: string;
    status: InterfaceStatus;
}

export interface PosInterfaceResponseDto extends InterfaceResponseDto {
    posType: PosType;
}

export interface KumoInterfaceResponseDto extends InterfaceResponseDto {
    username: string;
    password: string;
}

export interface EbicsInterfaceResponseDto extends InterfaceResponseDto {
    username: string;
    password: string;

}

export interface TcposInterfaceResponseDto extends PosInterfaceResponseDto {
    username: string;
    password: string;
}

export interface LightspeedInterfaceResponseDto extends PosInterfaceResponseDto {
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

export interface PosAssociationResponseDto extends AssociationResponseDto {
    posType: PosType;
}

export interface LightspeedAssociationResponseDto extends PosAssociationResponseDto {
    key: number;
}

export interface TcposAssociationResponseDto extends PosAssociationResponseDto {
    shopId: number;
}


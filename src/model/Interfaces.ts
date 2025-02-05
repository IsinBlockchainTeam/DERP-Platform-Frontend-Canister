import { AssociationResponseDto, InterfaceResponseDto } from "../dto/ErpInterfacesDto";

export type InterfaceAssociation = AssociationResponseDto & {
    interface: InterfaceResponseDto,
}

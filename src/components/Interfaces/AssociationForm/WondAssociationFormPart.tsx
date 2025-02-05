import { WondAssociationResponseDto } from "../../../dto/ErpInterfacesDto";
import { WondType } from "../../../model/WondType";
import TcposAssociationFormPart from "./Wond/TcposAssociationFormPart";
import { InterfaceAssociationFormPartProps } from "./BaseInterfaceAssociationFormPart";


type WondAssociationResponseDtoLocal = WondAssociationResponseDto & {
    wondType: WondType
}


type Props = InterfaceAssociationFormPartProps<WondAssociationResponseDtoLocal>

const typesFormMap = {
    [WondType.TCPOS]: TcposAssociationFormPart,
    [WondType.LIGHTSPEED]: TcposAssociationFormPart,
    [WondType.NONE]: TcposAssociationFormPart
}

const WondAssociationFormPart = (props: Props) => {
    if (!props.association.wondType) {
        // TODO: add select when extending support
        props.onUpdateAssociation({
            ...props.association,
            wondType: WondType.TCPOS 
        })
    }
    
    const Component = typesFormMap[props.association.wondType || WondType.TCPOS];
    return <Component {...props} />
}

export default WondAssociationFormPart;
import { PosAssociationResponseDto } from "../../../dto/ErpInterfacesDto";
import { PosType } from "../../../model/PosType";
import { InterfaceAssociationFormPartProps } from "./BaseInterfaceAssociationFormPart";
import TcposAssociationFormPart from "./Pos/TcposAssociationFormPart";


type PosAssociationResponseDtoLocal = PosAssociationResponseDto & {
    posType: PosType
}

type Props = InterfaceAssociationFormPartProps<PosAssociationResponseDtoLocal>

const typesFormMap = {
    [PosType.TCPOS]: TcposAssociationFormPart,
    [PosType.INTERNAL]: TcposAssociationFormPart
}

const PosAssociationFormPart = (props: Props) => {
    if (!props.association.posType) {
        // TODO: add select when extending support to other POS types, e.g. Lightspeed
        props.onUpdateAssociation({
            ...props.association,
            posType: PosType.TCPOS 
        })
    }
    
    const Component = typesFormMap[props.association.posType || PosType.TCPOS];
    return <Component {...props} />
}

export default PosAssociationFormPart;

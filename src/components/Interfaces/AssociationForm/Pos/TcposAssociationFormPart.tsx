import { useTranslation } from "react-i18next";
import { TcposAssociationResponseDto } from "../../../../dto/ErpInterfacesDto";
import { PosType } from "../../../../model/PosType";
import SmartIntInput from "../../../SmartIntInput/SmartIntInput";
import { InterfaceAssociationFormPartProps } from "../../AssociationForm/BaseInterfaceAssociationFormPart";

type TcposAssociationResponseDtoLocal = TcposAssociationResponseDto & {
    posType: PosType
}

type Props = InterfaceAssociationFormPartProps<TcposAssociationResponseDtoLocal> 


const TcposAssociationFormPart = (props: Props) => {
    const {t} = useTranslation(undefined, {keyPrefix: 'supplierInterfacesDashboard.associations.pos.tcpos'})
    
    const onChangeShopId = (shopId: number) => { 
        const newAssociation =  { ...props.association, shopId }
        props.onUpdateAssociation(newAssociation);
    }

    return <>
        <label className="form-control w-full max-w-xs">
            <div className="label">
                <span className="label-text">{t('shopId')}</span>
            </div>
            <SmartIntInput placeholder="19" className="input-bordered w-full max-w-xs" value={props.association.shopId || 0} onChange={v => onChangeShopId(v)} />
        </label>
    </>
}

export default TcposAssociationFormPart;

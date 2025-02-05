import { useTranslation } from "react-i18next";
import { KumoAssociationResponseDto, TcposAssociationResponseDto } from "../../../../dto/ErpInterfacesDto";
import SmartIntInput from "../../../SmartIntInput/SmartIntInput";
import { InterfaceAssociationFormPartProps } from "../../AssociationForm/BaseInterfaceAssociationFormPart";
import { WondType } from "../../../../model/WondType";

type TcposAssociationResponseDtoLocal = TcposAssociationResponseDto & {
    wondType: WondType
}

type Props = InterfaceAssociationFormPartProps<KumoAssociationResponseDto> 


const TcposAssociationFormPart = (props: Props) => {
    const {t} = useTranslation(undefined, {keyPrefix: 'supplierInterfacesDashboard.associations.wond.tcpos'})
    
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
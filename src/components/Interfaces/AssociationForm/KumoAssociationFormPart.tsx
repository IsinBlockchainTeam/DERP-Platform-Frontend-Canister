import { useTranslation } from "react-i18next";
import SmartIntInput from "../../SmartIntInput/SmartIntInput"
import { InterfaceAssociationFormPartProps } from "./BaseInterfaceAssociationFormPart";
import { KumoAssociationResponseDto } from "../../../dto/ErpInterfacesDto";


type Props = InterfaceAssociationFormPartProps<KumoAssociationResponseDto>


const KumoAssociationFormPart = (props: Props) => {
    const {t} = useTranslation(undefined, {keyPrefix: 'supplierInterfacesDashboard.associations.kumo'})
    
    const onChangeShopId = (shopId: number) => { 
        const newAssociation =  { ...props.association, shopId }
        props.onUpdateAssociation(newAssociation);
    }

    return <>
        <label className="form-control w-full  mt-2">
            <div className="label">
                <span className="label-text">{t('shopId')}:</span>
            </div>
            <SmartIntInput placeholder="19" className="input-bordered w-full " value={props.association.shopId || 0} onChange={v => onChangeShopId(v)} />
        </label>
    </>
}

export default KumoAssociationFormPart;
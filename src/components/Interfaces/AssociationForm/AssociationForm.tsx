import { useState } from "react";
import { AssociationResponseDto, InterfaceType } from "../../../dto/ErpInterfacesDto"
import BaseInterfaceAssociationFormPart from "./BaseInterfaceAssociationFormPart";
import KumoAssociationFormPart from "./KumoAssociationFormPart"
import { useTranslation } from "react-i18next";
import EbicsAssociationFormPart from "./EbicsAssociationFormPart";
import PosAssociationFormPart from "./PosAssociationFormPart";

interface Props {
    storeUrl: string,
    merchantId: number,
    association: Partial<AssociationResponseDto>,
    onUpdateAssociation: (association: Partial<AssociationResponseDto>) => void,
}

const typesFormMap = {
    [InterfaceType.POS]: PosAssociationFormPart,
    [InterfaceType.KUMO]: KumoAssociationFormPart,
    [InterfaceType.EBICS]: EbicsAssociationFormPart
}

const AssociationForm = (props: Props) => {
    const { t } = useTranslation(undefined, { keyPrefix: 'supplierInterfacesDashboard.associations' })
    const onUpdateAssociation = (a: Partial<AssociationResponseDto>) => {
        props.onUpdateAssociation(a)
    }

    const Component = props.association.interfaceType ? typesFormMap[props.association.interfaceType] : null;
    const componentProps = { ...props, onUpdateAssociation };

    return <>
        <h1 className="text-3xl font-light">{t('addBtn')}</h1>
        <BaseInterfaceAssociationFormPart {...componentProps} />
        {
            props.association.interfaceType && Component ?
                <Component {...componentProps} interfaceType={props.association.interfaceType} />
                : <></>
        }
    </>

}

export default AssociationForm;

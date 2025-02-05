import { useTranslation } from "react-i18next";
import { EbicsAssociationResponseDto } from "../../../dto/ErpInterfacesDto";
import { InterfaceAssociationFormPartProps } from "./BaseInterfaceAssociationFormPart";

type Props = InterfaceAssociationFormPartProps<EbicsAssociationResponseDto>;

const EbicsAssociationFormPart = (props: Props) => {
    const { t } = useTranslation(undefined, { keyPrefix: 'supplierInterfacesDashboard.associations.ebics' })
    return <div className="flex flex-row justify-center">
        <p className="text-gray-700 italic mt-5">{t('noAdditionalInfo')}</p>
    </div>
}


export default EbicsAssociationFormPart;
import { useEffect, useState } from "react";
import { AssociationResponseDto, InterfaceType, PosAssociationResponseDto } from "../../dto/ErpInterfacesDto";
import { interfacesService } from "../../api/services/Interfaces";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "../Loading/LoadingSpinner";

interface Props {
    children: React.ReactNode;
    merchantId: number;
    storeUrl: string;
}

const AssociatedPosFeatureGuard = ({
    children,
    merchantId,
    storeUrl
}: Props) => {
    const { t } = useTranslation(undefined, { keyPrefix: 'supplierInterfacesDashboard' });
    const [posInterfaces, setPosInterfaces] = useState<AssociationResponseDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    const fetchData = async () => {
        // fetch associated interfaces
        setLoading(true);
        try {
            const posAssociations: PosAssociationResponseDto[] = [];
            const associations = await interfacesService.getAssociations(storeUrl)
            associations.forEach(association => {
                if (association.interfaceType === InterfaceType.POS) {
                    posAssociations.push(association as PosAssociationResponseDto);
                }
            })

            setPosInterfaces(posAssociations);
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        fetchData();
    }, [children, storeUrl, merchantId]);

    const onGotoAssociations = () => {
        navigate(`/merchant/${merchantId}/stores/store/interfaces?storeUrl=${encodeURIComponent(storeUrl)}`);
    }

    return <>
        {loading ? <div className="flex-row justify-center"><LoadingSpinner /></div> :
            posInterfaces.length > 0 ? children :
                <div className="flex-row text-center">
                    <p>{t('associations.noAssociation')} <a className="inline btn btn-sm btn-primary" onClick={onGotoAssociations}>{t('associations.noInterfaceLinkText')}</a>.</p>
                </div>
        }
    </>
}

export default AssociatedPosFeatureGuard;
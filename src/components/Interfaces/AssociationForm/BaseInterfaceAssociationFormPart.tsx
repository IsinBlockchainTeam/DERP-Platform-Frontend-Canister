import { ChangeEvent, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { interfacesService } from "../../../api/services/Interfaces"
import { AssociationResponseDto, InterfaceResponseDto, InterfaceType } from "../../../dto/ErpInterfacesDto"

export interface InterfaceAssociationFormPartProps<T extends AssociationResponseDto = AssociationResponseDto> {
    association: Partial<T>
    onUpdateAssociation: (updated: Partial<T>) => void
    storeUrl: string
    merchantId: number
    interfaceType: InterfaceType
}

type BaseInterfaceAssociationFormProps = Omit<InterfaceAssociationFormPartProps, 'interfaceType'>

const BaseInterfaceAssociationFormPart = ({
    merchantId, storeUrl, association, onUpdateAssociation
}: BaseInterfaceAssociationFormProps) => {
    const [loading, setLoading] = useState(false);
    const [merchantInterfaces, setMerchantInterfaces] = useState<InterfaceResponseDto[]>([])
    const {t} = useTranslation(undefined, {keyPrefix: 'supplierInterfacesDashboard.associations'})

    useEffect(() => {
        fetchData()
    }, [storeUrl])

    const fetchData = async () => {
        setLoading(true);
        try {
            const interfaces = await interfacesService.listByCompany(merchantId);
            setMerchantInterfaces(interfaces);
        } finally {
            setLoading(false);
        }
    }
    
    const onChangeChosenInterface = async (e: ChangeEvent<HTMLSelectElement>) => {
        console.log("Changing interface id to " + e.target.value)
        const { interfaceType, id } = dataFromIdentifier(e.target.value);
        if (id === null || interfaceType === null) {
            throw new Error(`Invalid identifier ${e.target.value}`)
        }

        const iface = merchantInterfaces.find(i => i.id === id && i.interfaceType === interfaceType);
        if (!iface) {
            throw new Error(`Cannot find an interface with id ${id} locally`)
        }

        const newAss = { interfaceId: iface.id, interfaceType: iface.interfaceType, id: association.id };
        onUpdateAssociation(newAss);
    }
    
    const getIdentifier = (iface: {id?: number, interfaceType?: string}) => {
        if (iface.interfaceType && iface.id) {
            return iface.interfaceType + '-' + iface.id;
        }
        
        return "null";
    }
    
    const dataFromIdentifier = (identifier: string) => {
        if (identifier === "null") {
            return { interfaceType: null, id: null };
        }

        const [type, id] = identifier.split('-');
        return { interfaceType: type, id: Number(id) };
    }
    
    return <>
        <label className="form-control w-full  mt-2">
            <div className="label">
                <span className="label-text">{ t('form.interfaceAssociation' )}</span>
            </div>
            <select className="select select-bordered" value={getIdentifier({id: association.interfaceId, interfaceType: association.interfaceType})} onChange={e => onChangeChosenInterface(e)}>
                <option value="null" disabled>{t('form.interfaceAssociationLabel')}</option>
                {
                    merchantInterfaces.map(i => 
                        <option value={getIdentifier(i)} key={getIdentifier(i)}>{i.interfaceType} - {i.name}</option>
                    )
                }
            </select>
        </label>
    </>
}

export default BaseInterfaceAssociationFormPart;
import { DispatchRuleDto, DispatchRuleType } from "@derp/company-canister";
import { useEffect, useState } from "react";
import { DispatchRuleFormProps, DispatchRuleTypeFormElement, DispatchRuleViewProps } from "../types";
import { storeService } from "../../../../api/services/Store";
import { useParams } from "react-router-dom";
import { VatGroup } from "../../../../dto/ProductGroup";
import { StoreDto } from "../../../../dto/stores/StoreDto";
import { productsService } from "../../../../api/services/Products";
import { useTranslation } from "react-i18next";

export default function VatGroupDispatchRuleForm(props: DispatchRuleFormProps) {
    const { t } = useTranslation(undefined, { keyPrefix: 'merchantBalance.balanceSettings.rulesForm.type.types.VAT_GROUP' })
    const { merchantId } = useParams();

    const [isLoadingStores, setIsLoadingStores] = useState(false);
    const [isLoadingVatGroups, setIsLoadingVatGroups] = useState(false);
    const [stores, setStores] = useState<StoreDto[]>([]);
    const [vatGroups, setVatGroups] = useState<VatGroup[]>([]);

    const fetchStores = async () => {
        setIsLoadingStores(true);
        try {
            const stores = await storeService.list(merchantId)
            setStores(stores);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingStores(false);
        }
    }
    
    const fetchVatGroups = async () => {
        if (props.value.storeId[0] === undefined || props.value.storeId[0] === null) return;

        setIsLoadingVatGroups(true);
        try {
            const vatGroups = await productsService.listVatGroups(props.value.storeId[0])
            setVatGroups(vatGroups);
            console.log(vatGroups)
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingVatGroups(false);
        }
    }
    
    useEffect(() => {
        fetchStores();
        fetchVatGroups();
    }, [merchantId]);

    useEffect(() => {
        fetchVatGroups();
    }, [props.value]);
    
    return (
        <div className="flex flex-col gap-4">
            {isLoadingStores && <div className="loading loading-spinner loading-lg"></div>}
            {!isLoadingStores && (
            <div className="form-control">
                <label className="label">
                    <span className="label-text">{t('fields.store')}</span>
                </label>
                <select className="select select-bordered w-full"
                    value={props.value.storeId[0] ?? ""}
                    onChange={(e) => props.onChange({ ...props.value, storeId: [Number(e.target.value)] })}
                >
                    <option disabled value={""}>{t('fields.storePlaceholder')}</option>
                    {stores.map((store) => (
                        <option key={store.id} value={store.id}>{store.name}</option>
                    ))}
                </select>
            </div>
            )}
            {isLoadingVatGroups && <div className="loading loading-spinner loading-lg"></div>}
            {!isLoadingVatGroups && (
            <div className="form-control">
                <label className="label">
                    <span className="label-text">{t('fields.vatGroup')}</span>
                </label>
                <select className="select select-bordered w-full"
                    value={props.value.vatGroupId[0] ?? ""}
                    onChange={(e) => props.onChange({ ...props.value, vatGroupId: [e.target.value] })}
                >
                    <option disabled value={""}>{t('fields.vatGroupPlaceholder')}</option>
                    {vatGroups.map((vatGroup) => (
                        <option key={vatGroup.id} value={vatGroup.id}>{vatGroup.name}</option>
                    ))}
                </select>
            </div>
            )}
        </div>
    );
}

export const VatGroupDispatchRuleView = (props: DispatchRuleViewProps) => {
    const { t } = useTranslation(undefined, { keyPrefix: 'merchantBalance.balanceSettings.rulesForm.type.types.VAT_GROUP' })
    const [store, setStore] = useState<StoreDto | undefined>(undefined);
    const [vatGroup, setVatGroup] = useState<VatGroup | undefined>(undefined);
    
    useEffect(() => {
        if (props.value.storeId[0] === undefined || props.value.storeId[0] === null ||
            props.value.vatGroupId[0] === undefined || props.value.vatGroupId[0] === null) return;
        
        const fetchData = async () => {
            const store = await storeService.getStore(props.value.storeId[0]!)
            setStore(store)

            const vatGroups = await productsService.listVatGroups(props.value.storeId[0]!)
            setVatGroup(vatGroups.find((vatGroup) => vatGroup.id === props.value.vatGroupId[0]))
        }

        fetchData()
    }, [props.value.storeId[0], props.value.vatGroupId[0]])

    return (
        <div>
            <h1>{t('fields.store')}: {store?.name}</h1>
            <h1>{t('fields.vatGroup')}: {vatGroup?.name}</h1>
        </div>
    )
}

export const VatGroupDispatchRuleFormElement: DispatchRuleTypeFormElement = {
    value: DispatchRuleType.VAT_GROUP,
    formComponent: VatGroupDispatchRuleForm,
    viewComponent: VatGroupDispatchRuleView,
    validate: (value: DispatchRuleDto) => {
        return value.storeId.length > 0 && value.vatGroupId.length > 0 && value.storeId[0] !== undefined && value.vatGroupId[0] !== undefined
    }
} 
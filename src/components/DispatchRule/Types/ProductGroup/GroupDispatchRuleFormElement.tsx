import { DispatchRuleDto, DispatchRuleType } from "@derp/company-canister";
import { useEffect, useState } from "react";
import { DispatchRuleFormProps, DispatchRuleTypeFormElement, DispatchRuleViewProps } from "../types";
import { storeService } from "../../../../api/services/Store";
import { useParams } from "react-router-dom";
import { ProductGroup } from "../../../../dto/ProductGroup";
import { StoreDto } from "../../../../dto/stores/StoreDto";
import { productsService } from "../../../../api/services/Products";
import { useTranslation } from "react-i18next";

export default function GroupDispatchRuleForm(props: DispatchRuleFormProps) {
    const { t } = useTranslation(undefined, { keyPrefix: 'merchantBalance.balanceSettings.rulesForm.type.types.GROUP' })
    const { merchantId } = useParams();

    const [isLoadingStores, setIsLoadingStores] = useState(false);
    const [isLoadingGroups, setIsLoadingGroups] = useState(false);
    const [stores, setStores] = useState<StoreDto[]>([]);
    const [groups, setGroups] = useState<ProductGroup[]>([]);

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
    
    const fetchGroups = async () => {
        if (props.value.storeId[0] === undefined || props.value.storeId[0] === null) return;

        setIsLoadingGroups(true);
        try {
            const groups = await productsService.listProductGroups(props.value.storeId[0])
            setGroups(groups);
            console.log(groups)
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingGroups(false);
        }
    }
    
    useEffect(() => {
        fetchStores();
        fetchGroups();
    }, [merchantId]);

    useEffect(() => {
        fetchGroups();
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
            {isLoadingGroups && <div className="loading loading-spinner loading-lg"></div>}
            {!isLoadingGroups && (
            <div className="form-control">
                <label className="label">
                    <span className="label-text">{t('fields.group')}</span>
                </label>
                <select className="select select-bordered w-full"
                    value={props.value.groupId[0] ?? ""}
                    onChange={(e) => props.onChange({ ...props.value, groupId: [e.target.value] })}
                >
                    <option disabled value={""}>{t('fields.groupPlaceholder')}</option>
                    {groups.map((group) => (
                        <option key={group.id} value={group.id}>{group.name}</option>
                    ))}
                </select>
            </div>
            )}
        </div>
    );
}

export const GroupDispatchRuleView = (props: DispatchRuleViewProps) => {
    const { t } = useTranslation(undefined, { keyPrefix: 'merchantBalance.balanceSettings.rulesForm.type.types.GROUP' })
    const [store, setStore] = useState<StoreDto | undefined>(undefined);
    const [group, setGroup] = useState<ProductGroup | undefined>(undefined);
    
    useEffect(() => {
        if (props.value.storeId[0] === undefined || props.value.storeId[0] === null ||
            props.value.groupId[0] === undefined || props.value.groupId[0] === null) return;
        
        const fetchData = async () => {
            const store = await storeService.getStore(props.value.storeId[0]!)
            setStore(store)

            const groups = await productsService.listProductGroups(props.value.storeId[0]!)
            setGroup(groups.find((group) => group.id === props.value.groupId[0]))
        }

        fetchData()
    }, [props.value.storeId[0], props.value.groupId[0]])

    return (
        <div>
            <h1>{t('fields.store')}: {store?.name}</h1>
            <h1>{t('fields.group')}: {group?.name}</h1>
        </div>
    )
}

export const GroupDispatchRuleFormElement: DispatchRuleTypeFormElement = {
    value: DispatchRuleType.GROUP,
    formComponent: GroupDispatchRuleForm,
    viewComponent: GroupDispatchRuleView,
    validate: (value: DispatchRuleDto) => {
        return value.storeId.length > 0 && value.groupId.length > 0 && value.storeId[0] !== undefined && value.groupId[0] !== undefined
    }
}
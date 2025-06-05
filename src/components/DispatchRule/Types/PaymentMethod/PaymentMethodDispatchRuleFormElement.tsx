import { DispatchRuleDto, DispatchRuleType } from "@derp/company-canister";
import { useEffect, useState } from "react";
import { DispatchRuleFormProps, DispatchRuleTypeFormElement, DispatchRuleViewProps } from "../types";
import { storeService } from "../../../../api/services/Store";
import { useParams } from "react-router-dom";
import { PaymentMethodDto } from "../../../../dto/PaymentMethod";
import { StoreDto } from "../../../../dto/stores/StoreDto";
import { paymentsService } from "../../../../api/services/Payments";
import { useTranslation } from "react-i18next";

export default function PaymentMethodDispatchRuleForm(props: DispatchRuleFormProps) {
    const { t } = useTranslation(undefined, { keyPrefix: 'merchantBalance.balanceSettings.rulesForm.type.types.PAYMENT_METHOD' })
    const { merchantId } = useParams();

    const [isLoadingStores, setIsLoadingStores] = useState(false);
    const [isLoadingPaymentMethods, setIsLoadingPaymentMethods] = useState(false);
    const [stores, setStores] = useState<StoreDto[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethodDto[]>([]);

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
    
    const fetchPaymentMethods = async () => {
        if (props.value.storeId[0] === undefined || props.value.storeId[0] === null) return;

        setIsLoadingPaymentMethods(true);
        try {
            const paymentMethods = await paymentsService.getPaymentMethods(props.value.storeId[0])
            setPaymentMethods(paymentMethods);
            console.log(paymentMethods)
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingPaymentMethods(false);
        }
    }
    
    useEffect(() => {
        fetchStores();
        fetchPaymentMethods();
    }, [merchantId]);

    useEffect(() => {
        fetchPaymentMethods();
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
            {isLoadingPaymentMethods && <div className="loading loading-spinner loading-lg"></div>}
            {!isLoadingPaymentMethods && (
            <div className="form-control">
                <label className="label">
                    <span className="label-text">{t('fields.paymentMethod')}</span>
                </label>
                <select className="select select-bordered w-full"
                    value={props.value.paymentMethodId[0] ?? ""}
                    onChange={(e) => props.onChange({ ...props.value, paymentMethodId: [e.target.value] })}
                >
                    <option disabled value={""}>{t('fields.paymentMethodPlaceholder')}</option>
                    {paymentMethods.map((paymentMethod) => (
                        <option key={paymentMethod.id} value={paymentMethod.id}>{paymentMethod.name}</option>
                    ))}
                </select>
            </div>
            )}
        </div>
    );
}

export const PaymentMethodDispatchRuleView = (props: DispatchRuleViewProps) => {
    const { t } = useTranslation(undefined, { keyPrefix: 'merchantBalance.balanceSettings.rulesForm.type.types.PAYMENT_METHOD' })
    const [store, setStore] = useState<StoreDto | undefined>(undefined);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethodDto | undefined>(undefined);
    
    useEffect(() => {
        if (props.value.storeId[0] === undefined || props.value.storeId[0] === null ||
            props.value.paymentMethodId[0] === undefined || props.value.paymentMethodId[0] === null) return;
        
        const fetchData = async () => {
            const store = await storeService.getStore(props.value.storeId[0]!)
            setStore(store)

            const paymentMethods = await paymentsService.getPaymentMethods(props.value.storeId[0]!)
            setPaymentMethod(paymentMethods.find((paymentMethod) => paymentMethod.id.toString() === props.value.paymentMethodId[0]))
        }

        fetchData()
    }, [props.value.storeId[0], props.value.paymentMethodId[0]])

    return (
        <div>
            <h1>{t('fields.store')}: {store?.name}</h1>
            <h1>{t('fields.paymentMethod')}: {paymentMethod?.name}</h1>
        </div>
    )
}

export const PaymentMethodDispatchRuleFormElement: DispatchRuleTypeFormElement = {
    value: DispatchRuleType.PAYMENT_METHOD,
    formComponent: PaymentMethodDispatchRuleForm,
    viewComponent: PaymentMethodDispatchRuleView,
    validate: (value: DispatchRuleDto) => {
        return value.storeId.length > 0 && value.paymentMethodId.length > 0 && value.storeId[0] !== undefined && value.paymentMethodId[0] !== undefined
    }
} 
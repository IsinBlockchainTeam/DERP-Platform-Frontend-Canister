import { DispatchRuleDto, DispatchRuleType } from "@derp/company-canister";
import { DispatchRuleFormProps, DispatchRuleTypeFormElement, DispatchRuleViewProps } from "../types";
import { useTranslation } from "react-i18next";

export default function BankCounterpartDispatchRuleForm(props: DispatchRuleFormProps) {
    const { t } = useTranslation(undefined, { keyPrefix: 'merchantBalance.balanceSettings.rulesForm.type.types.BANK_COUNTERPART' })

    return (
        <div className="flex flex-col gap-4">
            <div className="form-control">
                <label className="label">
                    <span className="label-text">{t('fields.bankCounterpart')}</span>
                </label>
                <input 
                    type="text" 
                    className="input input-bordered w-full"
                    placeholder={t('fields.bankCounterpartPlaceholder')}
                    value={props.value.counterpartName[0] ?? ""}
                    onChange={(e) => props.onChange({ ...props.value, counterpartName: [e.target.value] })}
                />
            </div>
        </div>
    );
}

export const BankCounterpartDispatchRuleView = (props: DispatchRuleViewProps) => {
    const { t } = useTranslation(undefined, { keyPrefix: 'merchantBalance.balanceSettings.rulesForm.type.types.BANK_COUNTERPART' })

    return (
        <div>
            <h1>{t('fields.bankCounterpart')}: {props.value.counterpartName[0] || ''}</h1>
        </div>
    )
}

export const BankCounterpartDispatchRuleFormElement: DispatchRuleTypeFormElement = {
    value: DispatchRuleType.BANK_COUNTERPART,
    formComponent: BankCounterpartDispatchRuleForm,
    viewComponent: BankCounterpartDispatchRuleView,
    validate: (value: DispatchRuleDto) => {
        return value.counterpartName.length > 0 && value.counterpartName[0] !== undefined && value.counterpartName[0].trim() !== ""
    }
} 
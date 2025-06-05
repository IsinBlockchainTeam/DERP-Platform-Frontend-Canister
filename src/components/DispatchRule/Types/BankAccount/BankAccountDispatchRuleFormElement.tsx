import { DispatchRuleDto, DispatchRuleType } from "@derp/company-canister";
import { DispatchRuleFormProps, DispatchRuleTypeFormElement, DispatchRuleViewProps } from "../types";
import { useTranslation } from "react-i18next";

export default function BankAccountDispatchRuleForm(props: DispatchRuleFormProps) {
    const { t } = useTranslation(undefined, { keyPrefix: 'merchantBalance.balanceSettings.rulesForm.type.types.BANK_ACCOUNT' })

    return (
        <div className="flex flex-col gap-4">
            <div className="form-control">
                <label className="label">
                    <span className="label-text">{t('fields.bankAccount')}</span>
                </label>
                <input 
                    type="text" 
                    className="input input-bordered w-full"
                    placeholder={t('fields.bankAccountPlaceholder')}
                    value={props.value.IBAN[0] ?? ""}
                    onChange={(e) => props.onChange({ ...props.value, IBAN: [e.target.value] })}
                />
            </div>
        </div>
    );
}

export const BankAccountDispatchRuleView = (props: DispatchRuleViewProps) => {
    const { t } = useTranslation(undefined, { keyPrefix: 'merchantBalance.balanceSettings.rulesForm.type.types.BANK_ACCOUNT' })

    return (
        <div>
            <h1>{t('fields.bankAccount')}: {props.value.IBAN[0] || ''}</h1>
        </div>
    )
}

export const BankAccountDispatchRuleFormElement: DispatchRuleTypeFormElement = {
    value: DispatchRuleType.BANK_ACCOUNT,
    formComponent: BankAccountDispatchRuleForm,
    viewComponent: BankAccountDispatchRuleView,
    validate: (value: DispatchRuleDto) => {
        return value.IBAN.length > 0 && value.IBAN[0] !== undefined && value.IBAN[0].trim() !== ""
    }
} 
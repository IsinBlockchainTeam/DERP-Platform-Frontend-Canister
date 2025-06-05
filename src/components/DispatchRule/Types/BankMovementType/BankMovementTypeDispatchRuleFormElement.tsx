import { DispatchRuleDto, DispatchRuleType, BankTransactionType } from "@derp/company-canister";
import { DispatchRuleFormProps, DispatchRuleTypeFormElement, DispatchRuleViewProps } from "../types";
import { useTranslation } from "react-i18next";

export default function BankMovementTypeDispatchRuleForm(props: DispatchRuleFormProps) {
    const { t } = useTranslation(undefined, { keyPrefix: 'merchantBalance.balanceSettings.rulesForm.type.types.BANK_MOVEMENT_TYPE' })

    return (
        <div className="flex flex-col gap-4">
            <div className="form-control">
                <label className="label">
                    <span className="label-text">{t('fields.bankMovementType')}</span>
                </label>
                <select 
                    className="select select-bordered w-full"
                    value={props.value.movementType[0] ?? ""}
                    onChange={(e) => props.onChange({ ...props.value, movementType: [e.target.value] })}
                >
                    <option disabled value="">{t('fields.bankMovementTypePlaceholder')}</option>
                    <option value={BankTransactionType.DEBIT}>{t('fields.bankMovementTypes.DEBIT')}</option>
                    <option value={BankTransactionType.CREDIT}>{t('fields.bankMovementTypes.CREDIT')}</option>
                </select>
            </div>
        </div>
    );
}

export const BankMovementTypeDispatchRuleView = (props: DispatchRuleViewProps) => {
    const { t } = useTranslation(undefined, { keyPrefix: 'merchantBalance.balanceSettings.rulesForm.type.types.BANK_MOVEMENT_TYPE' })

    return (
        <div>
            <h1>{t('fields.bankMovementType')}: {props.value.movementType[0] ? t(`fields.bankMovementTypes.${props.value.movementType[0]}` as any) : ''}</h1>
        </div>
    )
}

export const BankMovementTypeDispatchRuleFormElement: DispatchRuleTypeFormElement = {
    value: DispatchRuleType.BANK_MOVEMENT_TYPE,
    formComponent: BankMovementTypeDispatchRuleForm,
    viewComponent: BankMovementTypeDispatchRuleView,
    validate: (value: DispatchRuleDto) => {
        return value.movementType.length > 0 && value.movementType[0] !== undefined && value.movementType[0].trim() !== ""
    }
} 
import { DispatchRuleDto, DispatchRuleType } from "@derp/company-canister";
import { DispatchRuleFormProps, DispatchRuleTypeFormElement, DispatchRuleViewProps } from "../types";
import { useTranslation } from "react-i18next";

export default function BankCausalDispatchRuleForm(props: DispatchRuleFormProps) {
    const { t } = useTranslation(undefined, { keyPrefix: 'merchantBalance.balanceSettings.rulesForm.type.types.BANK_CAUSAL' })

    const handleDomainCodeChange = (value: string) => {
        if (value.length <= 4) {
            props.onChange({ ...props.value, domainCode: [value] });
        }
    };

    const handleFamilyCodeChange = (value: string) => {
        if (value.length <= 4) {
            props.onChange({ ...props.value, familyCode: [value] });
        }
    };

    const handleSubFamilyCodeChange = (value: string) => {
        if (value.length <= 4) {
            props.onChange({ ...props.value, subFamilyCode: [value] });
        }
    };

    return (
        <div className="flex flex-col gap-4 mt-4">
            <div className="form-control">
                <label className="label">
                    <span className="label-text">{t('fields.bankCausal')}</span>
                </label>
                <div className="flex items-center gap-2">
                    <input 
                        type="text" 
                        className="input input-bordered w-20 text-center"
                        placeholder="XXXX"
                        maxLength={4}
                        value={props.value.domainCode[0] ?? ""}
                        onChange={(e) => handleDomainCodeChange(e.target.value)}
                    />
                    <span className="text-lg">-</span>
                    <input 
                        type="text" 
                        className="input input-bordered w-20 text-center"
                        placeholder="XXXX"
                        maxLength={4}
                        value={props.value.familyCode[0] ?? ""}
                        onChange={(e) => handleFamilyCodeChange(e.target.value)}
                    />
                    <span className="text-lg">-</span>
                    <input 
                        type="text" 
                        className="input input-bordered w-20 text-center"
                        placeholder="XXXX"
                        maxLength={4}
                        value={props.value.subFamilyCode[0] ?? ""}
                        onChange={(e) => handleSubFamilyCodeChange(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}

export const BankCausalDispatchRuleView = (props: DispatchRuleViewProps) => {
    const { t } = useTranslation(undefined, { keyPrefix: 'merchantBalance.balanceSettings.rulesForm.type.types.BANK_CAUSAL' })

    const causalCode = `${props.value.domainCode[0] || 'XXXX'}-${props.value.familyCode[0] || 'XXXX'}-${props.value.subFamilyCode[0] || 'XXXX'}`;

    return (
        <div>
            <h1>{t('fields.bankCausal')}: {causalCode}</h1>
        </div>
    )
}

export const BankCausalDispatchRuleFormElement: DispatchRuleTypeFormElement = {
    value: DispatchRuleType.BANK_CAUSAL,
    formComponent: BankCausalDispatchRuleForm,
    viewComponent: BankCausalDispatchRuleView,
    validate: (value: DispatchRuleDto) => {
        return value.domainCode.length > 0 && value.familyCode.length > 0 && value.subFamilyCode.length > 0 &&
               value.domainCode[0] !== undefined && value.familyCode[0] !== undefined && value.subFamilyCode[0] !== undefined &&
               value.domainCode[0].trim() !== "" && value.familyCode[0].trim() !== "" && value.subFamilyCode[0].trim() !== ""
    }
} 
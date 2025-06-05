import { DispatchRuleType } from "@derp/company-canister";
import { useTranslation } from "react-i18next";
import { forms } from "./Types/forms";


export interface DispatchRuleTypeSelectorProps {
    onChange: (value: DispatchRuleType) => void;
    value?: DispatchRuleType;
}

export default function DispatchRuleTypeSelector({ onChange, value }: DispatchRuleTypeSelectorProps) {
    const { t } = useTranslation(undefined, { keyPrefix: 'merchantBalance.balanceSettings.rulesForm.type' });

    const label = (type: DispatchRuleType) => {
        return t(`types.${type}.label` as any) as unknown as string;
    };

    const description = (type: DispatchRuleType) => {
        return t(`types.${type}.description` as any) as unknown as string;
    };

    return (
        <div className="space-y-4 w-full">
            <div className="grid gap-4">
                {forms.map((form) => (
                    <div
                        key={form.value}
                        onClick={() => onChange(form.value)}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-base-100 ${
                            value === form.value ? 'border-l-4 border-l-primary bg-primary/5 hover:bg-primary/10' : ''
                        }`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="font-medium text-base">
                                    {label(form.value)}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                    {description(form.value)}
                                </div>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    checked={value === form.value}
                                    onChange={() => onChange(form.value)}
                                    className="radio radio-primary"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 
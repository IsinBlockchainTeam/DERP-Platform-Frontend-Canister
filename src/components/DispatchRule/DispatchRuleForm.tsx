import { DispatchRule, DispatchRuleDto, DispatchRuleEntityMapper, DispatchRuleType, StatementItem } from "@derp/company-canister";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StatementItemSelector, useStatementItems } from "../StatementItem/StatementItemSelector";
import DispatchRuleTypeSelector from "./DispatchRuleTypeSelector";
import BaseFieldsForm from "./BaseFieldsForm";
import { forms } from "./Types/forms";
import { isDefined } from "../../utils";

type DispatchRuleFormProps = {
    onCancel: () => void;
    onSubmit: (rule: DispatchRule) => void;
    submitLabel: string;
    cancelLabel: string;
    externalLoading?: boolean;
    rule?: DispatchRule | null; // Optional rule for editing mode
}

type Tabs = "target-items" | "type" | "details";

// Helper function to get default rule state
const getDefaultRuleState = (): DispatchRuleDto => ({
    id: 0,
    statementItemIDs: [],
    rules: [],
    ruleType: DispatchRuleType.GROUP,
    accountingOperation: [],
    validFrom: [],
    validTo: [],
    txType: [],
    storeId: [],
    groupId: [],
    vatGroupId: [],
    counterpartName: [],
    movementType: [],
    IBAN: [],
    domainCode: [],
    familyCode: [],
    subFamilyCode: [],
    paymentMethodId: [],
    issuer: [],
    recipient: [],
});

export default function DispatchRuleForm({ onCancel, onSubmit, submitLabel, cancelLabel, externalLoading, rule: existingRule }: DispatchRuleFormProps) {
    const { t } = useTranslation();
    const { items, categories, loading: dataLoading } = useStatementItems();
    const [activeTab, setActiveTab] = useState<Tabs>("type");
    
    // Initialize rule state - use existing rule if provided, otherwise create new
    const [rule, setRule] = useState<DispatchRuleDto>(() => {
        if (existingRule) {
            // Convert existing DispatchRule to DispatchRuleDto for editing
            return existingRule.toDto();
        }
        // Default new rule
        return getDefaultRuleState();
    });

    // Update form state when existingRule prop changes
    useEffect(() => {
        if (existingRule) {
            setRule(existingRule.toDto());
        } else {
            // Reset to default new rule
            setRule(getDefaultRuleState());
        }
    }, [existingRule]);

    // Proxy function for onCancel that resets form state
    const handleCancel = () => {
        setRule(getDefaultRuleState());
        setActiveTab("type");
        onCancel();
    };

    // Proxy function for onSubmit that resets form state
    const handleSubmit = (submittedRule: DispatchRule) => {
        setRule(getDefaultRuleState());
        setActiveTab("type");
        onSubmit(submittedRule);
    };

    const handleStatementItemsChange = (items: StatementItem | StatementItem[]) => {
        if (Array.isArray(items)) {
            setRule({
                ...rule,
                statementItemIDs: items.map((item) => item.id),
            });
        } else {
            setRule({
                ...rule,
                statementItemIDs: [items.id],
            });
        }
    };

    const handleRuleTypeChange = (type: DispatchRuleType) => {
        setRule({
            ...rule,
            ruleType: type,
        });
    }
    
    const formElement = useMemo(() => {
        return forms.find((form) => form.value === rule.ruleType);
    }, [rule.ruleType]);
    
    const valid = useMemo(() => {
        if (!rule.ruleType) return false;
        if (rule.statementItemIDs.length < 1) return false;
        return formElement?.validate(rule);
    }, [rule]);

    return (
        <div className="w-full h-[80vh] px-8 flex flex-col">
            <div role="tablist" className="tabs tabs-boxed w-full mb-4">
                <a role="tab" className={`tab ${activeTab === "type" ? "tab-active" : ""}`} onClick={() => setActiveTab("type")}>
                    {t('dispatchRuleForm.tabs.type')}
                </a>
                <a role="tab" className={`tab ${activeTab === "details" ? "tab-active" : ""}`} onClick={() => setActiveTab("details")}>
                    {t('dispatchRuleForm.tabs.details')}
                </a>
                <a role="tab" className={`tab ${activeTab === "target-items" ? "tab-active" : ""}`} onClick={() => setActiveTab("target-items")}>
                    {t('dispatchRuleForm.tabs.targetItems')}
                </a>
            </div>
            <div className="flex-1 overflow-y-auto p-1">

                {/* Target statement items TAB */}
                { activeTab === "target-items" && (
                <div>
                    <StatementItemSelector
                        items={items}
                        categories={categories}
                        value={[...rule.statementItemIDs].map((id) => items.find((item) => item.id === id)).filter(isDefined)}
                        multi={true}
                        externalLoading={dataLoading}
                        onItemSelected={handleStatementItemsChange}
                    />
                </div>
                )}

                {/* Rule type TAB */}
                { activeTab === "type" && (
                <div>
                    <DispatchRuleTypeSelector
                        onChange={handleRuleTypeChange}
                        value={rule.ruleType}
                    />
                </div>
                )}

                {/* Rule details TAB */}
                { activeTab === "details" && (
                    <div className={`flex-col gap-4`}>
                        <BaseFieldsForm
                            value={rule}
                            onChange={setRule}
                        />
                        {formElement?.formComponent && <formElement.formComponent value={rule} onChange={setRule} />}
                    </div>
                )}
            </div>
            
            {/* Error message */}
            {!valid && (
                <div className="text-error text-sm mb-4">
                    {t('dispatchRuleForm.validation.completeAllFields')}
                </div>
            )}
            
            <div className="flex justify-end gap-4">
                <button className="btn btn-outline" onClick={handleCancel} disabled={externalLoading}>{cancelLabel}</button>
                <button 
                    className={`btn btn-primary ${valid && !externalLoading ? "" : "btn-disabled"}`} 
                    onClick={() => handleSubmit(DispatchRuleEntityMapper.fromDto(rule))}
                    disabled={!valid || externalLoading}
                >
                    {externalLoading && <span className="loading loading-spinner loading-sm"></span>}
                    {submitLabel}
                </button>
            </div>
        </div>
    );
}
import { DispatchRule, DispatchRuleDto, StatementItem, StatementItemCategory } from "@derp/company-canister";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import { statementItemsClient } from "../../api/icp";
import StatementItemsDisplay from "../StatementItem/StatementItemsDisplay";
import LoadingSpinner from "../Loading/LoadingSpinner";
import { forms } from "./Types/forms";

interface DispatchRuleViewProps {
    rule: DispatchRule;
    /** Optional custom class name */
    className?: string;
}

export default function DispatchRuleView({ rule, className = "" }: DispatchRuleViewProps) {
    const { t } = useTranslation(undefined, { keyPrefix: 'merchantBalance.balanceSettings.rulesForm' });
    const { t: tGlobal } = useTranslation();
    const [statementItems, setStatementItems] = useState<StatementItem[]>([]);
    const [categories, setCategories] = useState<StatementItemCategory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatementData = async () => {
            try {
                setLoading(true);
                
                // Fetch categories first
                const categoriesData = await statementItemsClient.getStatementItemsCategories();
                setCategories(categoriesData);
                
                // Fetch statement items that match the rule's statement item IDs
                const allItems: StatementItem[] = [];
                
                // Get items from all categories
                for (const category of categoriesData) {
                    const items = await statementItemsClient.getStatementItems(category.id);
                    allItems.push(...items);
                }
                
                // Get items without category
                const itemsWithoutCategory = await statementItemsClient.getStatementItems();
                allItems.push(...itemsWithoutCategory);
                
                // Filter items that match the rule's statement item IDs
                const ruleItems = allItems.filter(item => 
                    rule.statementItemIDs.includes(item.id)
                );
                setStatementItems(ruleItems);
            } catch (error) {
                console.error('Error fetching statement data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStatementData();
    }, [rule.statementItemIDs]);

    const formatDate = (date: Date | undefined) => {
        if (!date) return '∞';
        return date.toLocaleDateString();
    };
    
    const viewElement = useMemo(() => {
        return forms.find((form) => form.value === rule.ruleType);
    }, [rule.ruleType]);

    return (
        <div className={`w-full px-6 py-4 ${className}`}>
            <div className="space-y-6">
                {/* Rule Type */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">
                        {(t(`type.types.${rule.ruleType}.label` as any) as string) || rule.ruleType}
                    </h3>
                    <p className="text-gray-600 text-sm">
                        {(t(`type.types.${rule.ruleType}.description` as any) as string) || ''}
                    </p>
                </div>

                {/* Valid Dates */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('validFrom')}
                        </label>
                        <div className="text-sm bg-gray-50 px-3 py-2 rounded-md border">
                            {formatDate(rule.validFrom)}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('validTo')}
                        </label>
                        <div className="text-sm bg-gray-50 px-3 py-2 rounded-md border">
                            {formatDate(rule.validTo)}
                        </div>
                    </div>
                </div>

                {/* Accounting Operation */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('accountingOperation')}
                    </label>
                    <div className="text-sm bg-gray-50 px-3 py-2 rounded-md border">
                        {t(`accountingOperations.${rule.accountingOperation}` as any) as string}
                    </div>
                </div>

                {/* Target Statement Items */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {tGlobal('dispatchRuleForm.tabs.targetItems')}
                    </label>
                    {loading ? (
                        <div className="flex justify-center py-4">
                            <LoadingSpinner />
                        </div>
                    ) : (
                        <StatementItemsDisplay
                            selectedItems={statementItems}
                            multi={true}
                            categories={categories}
                            show={true}
                            className="mt-2"
                        />
                    )}
                </div>

                {viewElement && <viewElement.viewComponent value={rule.toDto()} />}
            </div>
        </div>
    );
}
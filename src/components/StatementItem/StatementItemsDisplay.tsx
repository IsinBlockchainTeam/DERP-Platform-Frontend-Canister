import { StatementItem, StatementItemCategory } from "@derp/company-canister";
import { useTranslation } from "react-i18next";

interface SelectedStatementItemsDisplayProps {
    /** The selected items - either a single item, array of items, or null/undefined */
    selectedItems: StatementItem | StatementItem[] | null | undefined;
    /** Whether this is for multi-selection mode */
    multi: boolean;
    /** Categories for displaying category names */
    categories: StatementItemCategory[];
    /** Whether to show the display (controls visibility) */
    show: boolean;
    /** Optional custom class name */
    className?: string;
}

const StatementItemsDisplay = ({
    selectedItems,
    multi,
    categories,
    show,
    className = ""
}: SelectedStatementItemsDisplayProps) => {
    const { t } = useTranslation(undefined, { keyPrefix: 'merchantBalance.selectStatementItemModal' });

    const getCategoryDisplay = (categoryId: number | undefined) => {
        if (categoryId === undefined) return t('unknown');
        const category = categories.find(cat => cat.id === categoryId);
        return category?.name || t('categoryFallback', { categoryId });
    };

    const hasSelection = () => {
        if (multi) {
            return Array.isArray(selectedItems) && selectedItems.length > 0;
        } else {
            return selectedItems !== null && selectedItems !== undefined && !Array.isArray(selectedItems);
        }
    };

    return (
        <div className={`p-3 bg-primary/5 border border-primary/20 rounded-lg ${
            show && hasSelection() ? 'visible' : 'invisible'
        } ${className}`}>
            <div className="text-sm text-gray-600">{t('selected')}</div>
            <div className="font-medium">
                {multi ? (
                    Array.isArray(selectedItems) && selectedItems.length > 0 ? (
                        <div className="space-y-1">
                            {selectedItems.map((item, index) => (
                                <div key={item.id}>
                                    {index + 1}. {item.name} ({getCategoryDisplay(item.category)})
                                </div>
                            ))}
                        </div>
                    ) : (
                        t('noItemsSelected')
                    )
                ) : (
                    selectedItems && !Array.isArray(selectedItems) ? 
                    `${selectedItems.name} (${getCategoryDisplay(selectedItems.category)} - ${selectedItems.currency})` : 
                    t('noItemSelected')
                )}
            </div>
        </div>
    );
};

export default StatementItemsDisplay; 
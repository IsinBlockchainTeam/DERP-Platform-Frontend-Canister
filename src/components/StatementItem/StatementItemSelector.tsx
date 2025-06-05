import { StatementItem, StatementItemCategory } from "@derp/company-canister";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { statementItemsClient } from "../../api/icp";
import LoadingSpinner from "../Loading/LoadingSpinner";
import StatementItemsDisplay from "./StatementItemsDisplay";

/**
 * Custom hook to fetch statement items and categories
 * Can be used by parent components to control data fetching
 */
export const useStatementItems = () => {
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState<StatementItem[]>([]);
    const [categories, setCategories] = useState<StatementItemCategory[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // First fetch all categories
            const fetchedCategories = await statementItemsClient.getStatementItemsCategories();
            setCategories(fetchedCategories);

            // Then fetch all items for each category
            const allItems: StatementItem[] = [];
            for (const category of fetchedCategories) {
                try {
                    const categoryItems = await statementItemsClient.getStatementItems(category.id);
                    allItems.push(...(categoryItems as StatementItem[]));
                } catch (error) {
                    console.warn(`Failed to fetch items for category ${category.id}:`, error);
                }
            }
            
            const itemsWithoutCategory = await statementItemsClient.getStatementItems();
            allItems.push(...(itemsWithoutCategory as StatementItem[]));

            setItems(allItems);
        } catch (error) {
            console.error('Error fetching statement items:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return {
        items,
        categories,
        loading,
        error,
        refetch: fetchData
    };
};

/**
 * Utility functions to help with finding statement items by IDs
 */
export const statementItemUtils = {
    /**
     * Find a single statement item by ID
     */
    findItemById: (items: StatementItem[], id: number): StatementItem | undefined => {
        return items.find(item => item.id === id);
    },

    /**
     * Find multiple statement items by IDs
     */
    findItemsByIds: (items: StatementItem[], ids: number[]): StatementItem[] => {
        return ids.map(id => items.find(item => item.id === id)).filter((item): item is StatementItem => item !== undefined);
    },

    /**
     * Convert StatementItem(s) to their ID(s)
     */
    toIds: (value: StatementItem | StatementItem[]): number | number[] => {
        return Array.isArray(value) ? value.map(item => item.id) : value.id;
    },

    /**
     * Convert ID(s) to StatementItem(s) using provided items array
     */
    fromIds: (items: StatementItem[], ids: number | number[]): StatementItem | StatementItem[] | null => {
        if (Array.isArray(ids)) {
            return statementItemUtils.findItemsByIds(items, ids);
        } else {
            return statementItemUtils.findItemById(items, ids) || null;
        }
    }
};

interface Props {
    multi?: boolean;
    onItemSelected?: (item: StatementItem | StatementItem[]) => void;
    externalLoading?: boolean;
    onSelectionChange?: (hasSelection: boolean) => void;
    /** The currently selected item(s). If provided, the component becomes controlled. */
    value?: StatementItem | StatementItem[];
    /** Items to display. This prop is required. */
    items: StatementItem[];
    /** Categories for displaying category names. This prop is required. */
    categories: StatementItemCategory[];
}

const StatementItemSelector = ({ 
    multi = false, 
    externalLoading = false, 
    onItemSelected,
    onSelectionChange,
    value,
    items,
    categories
}: Props) => {
    const { t } = useTranslation(undefined, { keyPrefix: 'merchantBalance.selectStatementItemModal' });
    const [selectedItem, setSelectedItem] = useState<StatementItem | null>(null);
    const [selectedItems, setSelectedItems] = useState<StatementItem[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');

    // Sync internal state with external value if provided
    useEffect(() => {
        if (value !== undefined) {
            if (multi) {
                setSelectedItems(Array.isArray(value) ? value : []);
            } else {
                setSelectedItem(Array.isArray(value) ? null : value);
            }
        }
    }, [value, multi]);

    const getCategoryDisplay = (categoryId: number | undefined) => {
        if (categoryId === undefined) return t('unknown');
        const category = categories.find(cat => cat.id === categoryId);
        return category?.name || t('categoryFallback', { categoryId });
    };

    const getFilteredItems = () => {
        if (!searchTerm.trim()) return items;
        
        const lowercaseSearch = searchTerm.toLowerCase();
        return items.filter(item => {
            const itemName = item.name.toLowerCase();
            const currency = item.currency.toLowerCase();
            const categoryDisplay = getCategoryDisplay(item.category).toLowerCase();
            
            return itemName.includes(lowercaseSearch) || 
                   currency.includes(lowercaseSearch) ||
                   categoryDisplay.includes(lowercaseSearch) ||
                   item.id.toString().includes(lowercaseSearch);
        });
    };

    const handleItemSelect = (item: StatementItem) => {
        if (multi) {
            const isSelected = selectedItems.some(selected => selected.id === item.id);
            let newSelection: StatementItem[];
            
            if (isSelected) {
                newSelection = selectedItems.filter(selected => selected.id !== item.id);
            } else {
                newSelection = [...selectedItems, item];
            }
            
            // Only update internal state if not controlled
            if (value === undefined) {
                setSelectedItems(newSelection);
            }
            
            if (onItemSelected) {
                onItemSelected(newSelection);
            }
            if (onSelectionChange) {
                onSelectionChange(newSelection.length > 0);
            }
        } else {
            const newSelection = selectedItem?.id === item.id ? null : item;
            
            // Only update internal state if not controlled
            if (value === undefined) {
                setSelectedItem(newSelection);
            }
            
            if (onItemSelected && newSelection !== null) {
                onItemSelected(newSelection);
            }
            if (onSelectionChange) {
                onSelectionChange(newSelection !== null);
            }
        }
    };

    const isItemSelected = (item: StatementItem) => {
        if (value !== undefined) {
            if (multi) {
                return Array.isArray(value) && value.some(selected => selected.id === item.id);
            } else {
                return !Array.isArray(value) && value?.id === item.id;
            }
        }
        
        if (multi) {
            return selectedItems.some(selected => selected.id === item.id);
        } else {
            return selectedItem?.id === item.id;
        }
    };

    const clearSelection = () => {
        // Only update internal state if not controlled
        if (value === undefined) {
            setSelectedItem(null);
            setSelectedItems([]);
        }
        
        setSearchTerm('');
        if (onSelectionChange) {
            onSelectionChange(false);
        }
        if (onItemSelected) {
            onItemSelected(multi ? [] : undefined as any);
        }
    };

    const filteredItems = getFilteredItems();

    // Get the current selected items for display
    const getSelectedItemsForDisplay = () => {
        if (value !== undefined) {
            return value;
        }
        return multi ? selectedItems : selectedItem;
    };

    return (
        <div className="space-y-4">
            {externalLoading ? (
                <div className="flex justify-center items-center py-8">
                    <LoadingSpinner />
                    <span className="ml-2">{t('processing')}</span>
                </div>
            ) : (
                <div className="space-y-4">
                    {items.length === 0 ? (
                        <div className="text-gray-500 italic">
                            {t('noItemsFound')}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {/* Search Input */}
                            <input
                                type="text"
                                placeholder={t('searchPlaceholder')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input input-bordered w-full"
                            />
                            
                            {/* Results List */}
                            <div className={`max-h-96 overflow-y-auto border rounded-lg`}>
                                {filteredItems.length === 0 ? (
                                    <div className="p-4 text-gray-500 italic text-center">
                                        {t('noMatchingItems')}
                                    </div>
                                ) : (
                                    <div className="divide-y">
                                        {filteredItems.map((item) => (
                                            <div
                                                key={item.id}
                                                onClick={() => handleItemSelect(item)}
                                                className={`p-3 cursor-pointer hover:bg-base-100 transition-colors ${
                                                    isItemSelected(item) ? 'border-l-4 border-l-primary' : ''
                                                }`}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <div className="font-medium text-base">
                                                            {item.name}
                                                        </div>
                                                        <div className="text-sm text-gray-600 mt-1">
                                                            {getCategoryDisplay(item.category)} • {item.currency}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        {multi && (
                                                            <input
                                                                type="checkbox"
                                                                checked={isItemSelected(item)}
                                                                onChange={() => handleItemSelect(item)}
                                                                className="checkbox checkbox-primary"
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                        )}
                                                        <div className="text-xs text-gray-500">
                                                            ID: {item.id}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            {/* Selected Item(s) Display */}
                            <StatementItemsDisplay
                                selectedItems={getSelectedItemsForDisplay()}
                                multi={multi}
                                categories={categories}
                                show={true}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export { StatementItemSelector };
export default StatementItemSelector; 
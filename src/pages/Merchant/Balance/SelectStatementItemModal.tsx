import { StatementItem, StatementItemCategory } from "@derp/company-canister";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { statementItemsClient } from "../../../api/icp";
import { Modal } from "../../../components/Modal/Modal";
import LoadingSpinner from "../../../components/Loading/LoadingSpinner";

interface Props {
    isOpen: boolean;
    title: string;
    onChangeOpen: (open: boolean) => void;
    onItemSelected?: (item: StatementItem) => void;
    externalLoading?: boolean;
}

const SelectStatementItemModal = ({ isOpen, onChangeOpen, onItemSelected, title, externalLoading = false }: Props) => {
    const { t } = useTranslation(undefined, { keyPrefix: 'merchantBalance.selectStatementItemModal' });
    const [loading, setLoading] = useState(false);
    const [allStatementItems, setAllStatementItems] = useState<StatementItem[]>([]);
    const [categories, setCategories] = useState<StatementItemCategory[]>([]);
    const [selectedItem, setSelectedItem] = useState<StatementItem | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const isLoading = loading || externalLoading;

    const fetchAllStatementItems = async () => {
        try {
            setLoading(true);
            
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

            setAllStatementItems(allItems);
        } catch (error) {
            console.error('Error fetching statement items:', error);
        } finally {
            setLoading(false);
        }
    };

    const getCategoryName = (categoryId: number | undefined) => {
        if (categoryId === undefined) return 'Unknown';
        const category = categories.find(cat => cat.id === categoryId);
        return category?.name || 'Unknown';
    };

    const getFilteredItems = () => {
        if (!searchTerm.trim()) return allStatementItems;
        
        const lowercaseSearch = searchTerm.toLowerCase();
        return allStatementItems.filter(item => {
            const itemName = item.name.toLowerCase();
            const categoryName = getCategoryName(item.category).toLowerCase();
            const currency = item.currency.toLowerCase();
            
            return itemName.includes(lowercaseSearch) || 
                   categoryName.includes(lowercaseSearch) || 
                   currency.includes(lowercaseSearch) ||
                   item.id.toString().includes(lowercaseSearch);
        });
    };

    const handleSubmit = () => {
        if (selectedItem && onItemSelected) {
            onItemSelected(selectedItem);
            onChangeOpen(false);
        }
    };

    const handleCancel = () => {
        if (!isLoading) {
            setSelectedItem(null);
            setSearchTerm('');
            onChangeOpen(false);
        }
    };

    const handleItemSelect = (item: StatementItem) => {
        setSelectedItem(item);
    };

    useEffect(() => {
        if (isOpen) {
            fetchAllStatementItems();
        } else {
            setSelectedItem(null);
            setSearchTerm('');
        }
    }, [isOpen]);

    const filteredItems = getFilteredItems();

    return (
        <Modal
            open={isOpen}
            onChangeOpen={(open) => {
                if (!isLoading) {
                    onChangeOpen(open);
                }
            }}
            closeButton={false}
        >
            <div className="modal-header">
                <h3 className="text-3xl font-light">{title}</h3>
            </div>

            <div className="modal-body mt-4">
                {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                        <LoadingSpinner />
                        <span className="ml-2">{externalLoading ? t('processing') : t('loading')}</span>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <p>{t('chooseItem')}</p>
                        
                        {allStatementItems.length === 0 ? (
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
                                <div className="max-h-64 overflow-y-auto border rounded-lg">
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
                                                        selectedItem?.id === item.id ? 'border-l-4 border-l-primary' : ''
                                                    }`}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1">
                                                            <div className="font-medium text-base">
                                                                {item.name}
                                                            </div>
                                                            <div className="text-sm text-gray-600 mt-1">
                                                                {getCategoryName(item.category)} • {item.currency}
                                                            </div>
                                                        </div>
                                                        <div className="text-xs text-gray-500 ml-2">
                                                            ID: {item.id}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                
                                {/* Selected Item Display */}
                                {selectedItem && (
                                    <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                                        <div className="text-sm text-gray-600">Selected:</div>
                                        <div className="font-medium">
                                            {selectedItem.name} ({getCategoryName(selectedItem.category)} - {selectedItem.currency})
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="modal-action">
                <button 
                    className="btn btn-secondary" 
                    onClick={handleCancel}
                    disabled={isLoading}
                >
                    {t('cancel')}
                </button>
                <button 
                    className="btn btn-primary" 
                    onClick={handleSubmit}
                    disabled={isLoading || !selectedItem || allStatementItems.length === 0}
                >
                    {t('submit')}
                </button>
            </div>
        </Modal>
    );
};

export default SelectStatementItemModal; 
import { StatementItem, StatementItemCategory } from "@derp/company-canister";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "../../../../components/Loading/LoadingSpinner";
import GenericTable, { GenericTableColumn } from "../../../../components/Table/GenericTable";
import AddItemModal from "./AddItemModal";
import EditItemModal from "./EditItemModal";
import { useStatementItemsClient } from '../../../Stores/StoreProvider';

const BalanceSettingsItems = () => {
    const { t } = useTranslation(undefined, { keyPrefix: "merchantBalance.balanceSettings" })
    const [loading, setLoading] = useState<boolean>(false);
    const [catgeories, setCategories] = useState<StatementItemCategory[]>([]);
    const [statementItems, setStatementItems] = useState<StatementItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [addItemModalOpen, setAddItemModalOpen] = useState<boolean>(false);
    const [editItemModalOpen, setEditItemModalOpen] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<StatementItem | null>(null);

    const statementItemsClient = useStatementItemsClient();

    const fetchCategories = async () => {
        if (statementItemsClient.client === null){
            console.error("StatementItemsClient is not available.");
            return;
        }
        const categories = await statementItemsClient.client.getStatementItemsCategories();
        setCategories(categories);
    }

    const fetchStatementItems = async () => {
        if (statementItemsClient.client === null){
            console.error("StatementItemsClient is not available.");
            return;
        }
        setLoading(true);
        try {
            let allStatementItems: StatementItem[] = [];
            if (selectedCategory === 0) {
                for (const category of catgeories) {
                    const statementItems = await statementItemsClient.client.getStatementItems(category.id);
                    allStatementItems = allStatementItems.concat(statementItems);
                }
                
                const uncategorizedStatementItems = await statementItemsClient.client.getStatementItems();
                allStatementItems = allStatementItems.concat(uncategorizedStatementItems);

            } else if (selectedCategory) {
                const statementItems = await statementItemsClient.client.getStatementItems(selectedCategory);
                allStatementItems = allStatementItems.concat(statementItems);
            } else {
                const statementItems = await statementItemsClient.client.getStatementItems();
                allStatementItems = allStatementItems.concat(statementItems);
            }

            allStatementItems = allStatementItems.sort((a, b) => a.name.localeCompare(b.name));
            setStatementItems(allStatementItems);
        } catch (error) {
            console.error(error);
            setStatementItems([]);
        } finally {
            setLoading(false);
        }
    }

    const getFilteredItems = () => {
        if (!searchTerm.trim()) return statementItems;
        
        const lowercaseSearch = searchTerm.toLowerCase();
        return statementItems.filter(item => {
            const itemName = item.name.toLowerCase();
            const currency = item.currency.toLowerCase();
            const categoryDisplay = catgeories.find((category) => category.id === item.category)?.name?.toLowerCase() || '';
            
            return itemName.includes(lowercaseSearch) || 
                   currency.includes(lowercaseSearch) ||
                   categoryDisplay.includes(lowercaseSearch) ||
                   item.id.toString().includes(lowercaseSearch);
        });
    };

    useEffect(() => {
        fetchStatementItems();
    }, [selectedCategory])

    useEffect(() => {
        fetchCategories().then(() => {
            setSelectedCategory(0);
        });
    }, [])

    const columns: GenericTableColumn<StatementItem>[] = [
        {
            header: t('itemsTable.id'),
            accessor: 'id',
        },
        {
            header: t('itemsTable.name'),
            accessor: 'name'
        },
        {
            header: t('itemsTable.category'),
            accessor: (item) => catgeories.find((category) => category.id === item.category)?.name
        },
        {
            header: t('itemsTable.currency'),
            accessor: 'currency',
        },
        {
            header: 'Actions',
            accessor: (item) => (
                <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => handleEditItem(item)}
                    title="Edit item"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                </button>
            )
        }
    ];

    const onChangeAddItemModal = (open: boolean) => {
        setAddItemModalOpen(open);
        if (!open)
            fetchStatementItems();
    }

    const onChangeEditItemModal = (open: boolean) => {
        setEditItemModalOpen(open);
        if (!open) {
            setSelectedItem(null);
            fetchStatementItems();
        }
    }

    const handleEditItem = (item: StatementItem) => {
        setSelectedItem(item);
        setEditItemModalOpen(true);
    }

    const filteredItems = getFilteredItems();

    return <div className="flex flex-col items-start">
        <div className="flex flex-row items-center gap-2 w-full">
            <label className="form-control">
                <select className="select select-bordered w-full max-w-xs"
                    onChange={(e) => setSelectedCategory(Number(e.target.value))}
                >
                    <option value={0}>{t('allCategories')}</option>
                    <option value={undefined}>{t('noCategory')}</option>
                    {
                        catgeories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)
                    }
                </select>
            </label>

            <input
                type="text"
                placeholder={t('searchItems')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-bordered flex-1"
            />

            <button className="btn btn-primary" onClick={() => setAddItemModalOpen(true)}>{t('addStatementItem')}</button>
        </div>
        <div className="w-full mt-2">
            {
                loading ? <LoadingSpinner /> :
                        <GenericTable
                            data={filteredItems}
                            columns={columns}
                        />
            }
        </div>

        <AddItemModal
            isOpen={addItemModalOpen}
            onChangeOpen={onChangeAddItemModal}
            onItemCreated={() => fetchStatementItems()}
        />

        <EditItemModal
            isOpen={editItemModalOpen}
            onChangeOpen={onChangeEditItemModal}
            item={selectedItem}
            onItemUpdated={() => fetchStatementItems()}
        />
    </div>
}

export default BalanceSettingsItems;

import { StatementItem, StatementItemCategory } from "@derp/company-canister";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { statementItemsClient } from "../../../../api/icp";
import LoadingSpinner from "../../../../components/Loading/LoadingSpinner";
import GenericTable, { GenericTableColumn } from "../../../../components/Table/GenericTable";
import AddItemModal from "./AddItemModal";
import EditItemModal from "./EditItemModal";

const BalanceSettingsItems = () => {
    const { t } = useTranslation(undefined, { keyPrefix: "merchantBalance.balanceSettings" })
    const [loading, setLoading] = useState<boolean>(false);
    const [catgeories, setCategories] = useState<StatementItemCategory[]>([]);
    const [statementItems, setStatementItems] = useState<StatementItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
    const [addItemModalOpen, setAddItemModalOpen] = useState<boolean>(false);
    const [editItemModalOpen, setEditItemModalOpen] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<StatementItem | null>(null);

    const fetchCategories = async () => {
        const categories = await statementItemsClient.getStatementItemsCategories();
        setCategories(categories);
    }

    const fetchStatementItems = async () => {
        if (!selectedCategory)
            throw new Error("No category selected");

        setLoading(true);
        try {
        const statementItems = await statementItemsClient.getStatementItems(selectedCategory);
        setStatementItems(statementItems as StatementItem[]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (selectedCategory)
            fetchStatementItems();
    }, [selectedCategory])

    useEffect(() => {
        fetchCategories();
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

    return <div className="flex flex-col items-start">
        <div className="flex flex-row">
            <label className="form-control ml-2">
                <select className="select select-bordered w-full max-w-xs"
                    onChange={(e) => setSelectedCategory(Number(e.target.value))}
                >
                    <option disabled selected>{t('chooseCategory')}</option>
                    {
                        catgeories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)
                    }
                </select>
            </label>

            <button className="btn btn-primary ml-2" onClick={() => setAddItemModalOpen(true)}>{t('addStatementItem')}</button>

        </div>
        <div className="w-full mt-2">
            {
                loading ? <LoadingSpinner /> :
                    selectedCategory ?
                        <GenericTable
                            data={statementItems}
                            columns={columns}
                        /> : <div className="w-full italic text-gray-800 mt-4">{t('noCategorySelected')}</div>
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

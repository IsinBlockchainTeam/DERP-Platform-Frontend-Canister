import { StatementItem, StatementItemCategory } from "@derp/company-canister";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { statementItemsClient } from "../../../../api/icp";
import LoadingSpinner from "../../../../components/Loading/LoadingSpinner";
import GenericTable, { GenericTableColumn } from "../../../../components/Table/GenericTable";
import AddItemModal from "./AddItemModal";

const BalanceSettingsItems = () => {
    const { t } = useTranslation(undefined, { keyPrefix: "merchantBalance.balanceSettings" })
    const [loading, setLoading] = useState<boolean>(false);
    const [catgeories, setCategories] = useState<StatementItemCategory[]>([]);
    const [statementItems, setStatementItems] = useState<StatementItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
    const [addItemModalOpen, setAddItemModalOpen] = useState<boolean>(false);


    const fetchCategories = async () => {
        const categories = await statementItemsClient.getStatementItemsCategories();
        setCategories(categories);
    }

    const fetchStatementItems = async () => {
        if(!selectedCategory)
            throw new Error("No category selected");

        const statementItems = await statementItemsClient.getStatementItems(selectedCategory);
        setStatementItems(statementItems as StatementItem[]);
    }

    useEffect(() => {
        if(selectedCategory)
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
        }
    ];

    const onChangeAddItemModal = (open: boolean) => {
        setAddItemModalOpen(open);
        if(!open)
            fetchStatementItems();
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

        <AddItemModal isOpen={addItemModalOpen} onChangeOpen={onChangeAddItemModal}/>
    </div>
}

export default BalanceSettingsItems;

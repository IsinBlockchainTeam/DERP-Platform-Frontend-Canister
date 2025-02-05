import { StatementItemCategory } from "@derp/company-canister";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { statementItemsClient } from "../../../../api/icp";
import LoadingSpinner from "../../../../components/Loading/LoadingSpinner";
import GenericTable, { GenericTableColumn } from "../../../../components/Table/GenericTable";
import AddCategoryModal from "./AddCategoryModal";

const BalanceSettingsCategories = () => {
    const { t } = useTranslation(undefined, { keyPrefix: 'merchantBalance.balanceSettings' });
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<StatementItemCategory[]>([]);
    const [addCategoryModalOpen, setAddCategoryModalOpen] = useState(false);


    const fetchData = async () => {
        try {
            setLoading(true);
            const categories = await statementItemsClient.getStatementItemsCategories();
            setCategories(categories);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }


    const columns: GenericTableColumn<StatementItemCategory>[] = [
        {
            header: t('categoriesTable.id'),
            accessor: 'id'
        },
        {
            header: t('categoriesTable.name'),
            accessor: 'name'
        }
    ]

    const onChangeOpenModal = (open: boolean) => {
        setAddCategoryModalOpen(open);
        if(!open)
            fetchData();
    }

    useEffect(() => {
        fetchData();
    }, [])

    return <div>
        {
            loading ?
                <LoadingSpinner /> :
                <>
                    <button className="btn btn-primary mb-2" onClick={() => setAddCategoryModalOpen(true)}>{t('addCategory')}</button>
                    <GenericTable
                        columns={columns}
                        data={categories}
                    />
                    <AddCategoryModal isOpen={addCategoryModalOpen} onChangeOpen={onChangeOpenModal} />
                </>
        }
    </div>
}

export default BalanceSettingsCategories;

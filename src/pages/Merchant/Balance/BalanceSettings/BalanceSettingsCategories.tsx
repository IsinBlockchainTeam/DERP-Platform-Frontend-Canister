import { StatementItemCategory } from "@derp/company-canister";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { statementItemsClient } from "../../../../api/icp";
import LoadingSpinner from "../../../../components/Loading/LoadingSpinner";
import GenericTable, { GenericTableColumn } from "../../../../components/Table/GenericTable";
import AddCategoryModal from "./AddCategoryModal";
import { Modal } from "../../../../components/Modal/Modal";
import { statementService } from "../../../../api/services/Statement";
import { useParams } from "react-router-dom";

const BalanceSettingsCategories = () => {
    const { t } = useTranslation(undefined, { keyPrefix: 'merchantBalance.balanceSettings' });
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<StatementItemCategory[]>([]);
    const [addCategoryModalOpen, setAddCategoryModalOpen] = useState(false);
    const [setupDefaultCategoriesModalOpen, setSetupDefaultCategoriesModalOpen] = useState(false);
    const [setupDefaultCategoriesLoading, setSetupDefaultCategoriesLoading] = useState(false);
    const { merchantId } = useParams();

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
        if (!open)
            fetchData();
    }

    const onClickSetupDefaultCategories = async () => {
        setSetupDefaultCategoriesModalOpen(true);
    }

    const onSubmitSetupDefaultCategories = async () => {
        try {
            if (!merchantId) {
                throw new Error('Merchant ID is required');
            }

            setSetupDefaultCategoriesLoading(true);
            await statementService.setupDefaultCategories(merchantId);
            await fetchData();
            setSetupDefaultCategoriesModalOpen(false);
        } catch (error) {
            console.error(error);
        } finally {
            setSetupDefaultCategoriesLoading(false);
        }
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
                    <div className="flex justify-center">
                        {
                            categories.length === 0 &&
                            <button className="btn btn-secondary my-2" onClick={onClickSetupDefaultCategories}>{t('setupDefaultCategories')}</button>
                        }
                    </div>
                    <AddCategoryModal isOpen={addCategoryModalOpen} onChangeOpen={onChangeOpenModal} />
                    <Modal open={setupDefaultCategoriesModalOpen} onChangeOpen={() => setSetupDefaultCategoriesModalOpen(false)}>
                        {
                            setupDefaultCategoriesLoading ?
                                <LoadingSpinner /> :
                                <>
                                    <div className={"modal-header"}>
                                        <h3 className={"text-3xl font-light"}>{t('setupDefaultCategoriesModal.title')}</h3>
                                    </div>
                                    <div className={"modal-body mt-4"}>
                                        <p>{t('setupDefaultCategoriesModal.message')}</p>
                                        <ul className="list-disc list-inside">
                                            <li>{t('setupDefaultCategoriesModal.changeCategories')}</li>
                                            <li>{t('setupDefaultCategoriesModal.changeItems1')}</li>
                                            <li>{t('setupDefaultCategoriesModal.changeItems2')}</li>
                                            <li>{t('setupDefaultCategoriesModal.changeItems3')}</li>
                                        </ul>
                                    </div>
                                    <div className={"modal-action"}>
                                        <button className="btn btn-secondary" onClick={() => setSetupDefaultCategoriesModalOpen(false)}>{t('setupDefaultCategoriesModal.cancel')}</button>
                                        <button className="btn btn-primary" onClick={onSubmitSetupDefaultCategories}>{t('setupDefaultCategoriesModal.submit')}</button>
                                    </div>
                                </>
                        }
                    </Modal>
                </>
        }
    </div>
}

export default BalanceSettingsCategories;

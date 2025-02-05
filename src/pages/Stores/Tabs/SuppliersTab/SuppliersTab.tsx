import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { relationsService } from "../../../../api/services/Relations";
import LoadingSpinner from "../../../../components/Loading/LoadingSpinner";
import ConfirmationModal from "../../../../components/Modal/ConfirmationModal";
import { Modal } from "../../../../components/Modal/Modal";
import GenericTable, { GenericTableColumn, GenericTableAction } from "../../../../components/Table/GenericTable";
import TabTitle from "../../../../components/Tabs/TabTitle";
import { StoreDto } from "../../../../dto/stores/StoreDto";
import { MySupplier } from "../../../../dto/stores/StoreList";
import { parseSearchParamSafe, useStoreUrl } from "../../../../utils";
import AllSuppliersTable from "./AllSuppliers";

export default function SuppliersTab() {
    const [loading, setLoading] = useState<boolean>(false);
    const [suppliers, setSuppliers] = useState<MySupplier[]>([]);
    const [extIDinSelectedStore, setExtIDinSelectedStore] = useState<string>('');
    const [selectedStoreForAdd, setSelectedStoreForAdd] = useState<StoreDto>();

    const [optionsModalOpen, setOptionsModalOpen] = useState<boolean>(false);
    const [showAllSuppliers, setShowAllSuppliers] = useState<boolean>(false);
    const [supplierToRemove, setSupplierToRemove] = useState<MySupplier>();
    const [confirmRemoveModalOpen, setConfirmRemoveModalOpen] = useState<boolean>(false);
    const storeUrl = useStoreUrl();

    const { t } = useTranslation(undefined, { keyPrefix: 'mySuppliers' })

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await relationsService.getSuppliers(storeUrl);
            setSuppliers(response);
        } finally {
            setLoading(false);
        }
    }

    const supplierColumns: GenericTableColumn<MySupplier>[] = [
        {
            header: 'Logo',
            accessor: (supplier) => <div className="avatar">
                <div className="mask mask-circle h-12 w-12">
                    <img src={supplier.store.imageUrl} alt="logo" />
                </div>
            </div>
        },
        {
            header: 'Name',
            accessor: (supplier) => supplier.store.name
        },
        {
            header: 'Address',
            accessor: (supplier) => supplier.store.address
        },
        {
            header: 'Your ID',
            accessor: (supplier) => supplier.options.supplierExternalID
        }
    ]

    const supplierActions: GenericTableAction<MySupplier>[] = [
        {
            label: 'Remove',
            onClick: (supplier) => {
                setSupplierToRemove(supplier);
                setConfirmRemoveModalOpen(true);
            }
        }
    ]

    const onConfirmRemoveSupplier = async () => {
        if (!supplierToRemove) {
            throw new Error("No supplier to remove");
        }

        await relationsService.removeSupplier(supplierToRemove.store.url);
        setSuppliers(suppliers.filter(s => s.store.url !== supplierToRemove.store.url))
        setSupplierToRemove(undefined);
    }

    const onSubmitSupplier = async () => {
        if (!selectedStoreForAdd) {
            throw new Error("No store selected");
        }

        const store = selectedStoreForAdd;
        await relationsService.addSupplier(store.url, extIDinSelectedStore, storeUrl);
        setSuppliers((current) => [...current, { store: store, options: { supplierExternalID: extIDinSelectedStore } }]);
        setExtIDinSelectedStore('');
        setOptionsModalOpen(false);
    }

    const onClickAddSupplier = async (store: StoreDto) => {
        setSelectedStoreForAdd(store);
        setOptionsModalOpen(true);
    }

    const cancel = () => {
        setExtIDinSelectedStore('');
        setOptionsModalOpen(false);
    }
    
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="flex flex-col w-full">
            <TabTitle title={t('title')} rightSlot={
                <button className="btn btn-primary" onClick={() => setShowAllSuppliers(true)}>{t('addSupplier')}</button>
            } />
            {
                loading || suppliers.length ?
                    <div className={'flex flex-row flex-1 w-full'}>
                        {
                            loading ?
                                <LoadingSpinner /> :
                                <div className="flex flex-col w-full">
                                    <GenericTable data={suppliers} columns={supplierColumns} actions={supplierActions} />
                                </div>
                        }
                    </div> :
                    <div className={'flex-row text-center'}>{t('noFavSuppliers')}</div>
            }

            <Modal open={showAllSuppliers} onChangeOpen={setShowAllSuppliers}>
                <AllSuppliersTable mySuppliers={suppliers} onClickAddSupplier={onClickAddSupplier}/>
            </Modal>
            
            {/* Modal to add options when store is added to mySuppliers */}
            <Modal open={optionsModalOpen} onChangeOpen={setOptionsModalOpen}>
                <div className={'modal-header'}>
                    <h3 className={'text-lg'}>{t('addInfo')}</h3>
                </div>
                <div className={'modal-body'}>
                    <div className={'flex flex-col'}>
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">{t('extSupplierIDLabel')}</span>
                            </div>
                            <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs"
                                value={extIDinSelectedStore}
                                onChange={(e) => setExtIDinSelectedStore(e.target.value)}
                            />
                            <div className="label">
                                <span className="label-text-alt">{t('extSupplierIDDescription')} {selectedStoreForAdd?.name}</span>
                            </div>
                        </label>
                    </div>
                    <div className={'flex flex-row w-full justify-between mt-3'}>
                        <button className={'btn btn-outline'} onClick={() => cancel()}>{t('cancel')}</button>
                        <button className={'btn btn-primary'} onClick={() => onSubmitSupplier()}>{t('submit')}</button>
                    </div>
                </div>
            </Modal>
            
            <ConfirmationModal title={t('removeSupplier')}
                message={t('removeSupplierDangerMessage')}
                open={confirmRemoveModalOpen}
                onChangeOpen={setConfirmRemoveModalOpen}
                onConfirm={onConfirmRemoveSupplier}
            />
        </div>
    );
}

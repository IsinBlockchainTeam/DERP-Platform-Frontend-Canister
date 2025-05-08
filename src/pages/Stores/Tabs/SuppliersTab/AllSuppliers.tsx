import { useEffect, useState } from "react";
import { StoreDto } from "../../../../dto/stores/StoreDto";
import { SupplierPrivateDto } from "../../../../dto/stores/StoreList";
import { useTranslation } from "react-i18next";
import { storeService } from "../../../../api/services/Store";
import LoadingSpinner from "../../../../components/Loading/LoadingSpinner";
import GenericTable, { GenericTableColumn, GenericTableAction } from "../../../../components/Table/GenericTable";
import { useParams } from "react-router-dom";

type Props = {
    mySuppliers: SupplierPrivateDto[];
    onClickAddSupplier: (store: StoreDto) => void;
    onClickAddExternalSupplier?: (name: string) => void;
}

const AllSuppliersTable = ({
    mySuppliers,
    onClickAddSupplier,
    onClickAddExternalSupplier
}: Props) => {
    // list of all stores (mySuppliers included) that ARE NOT mine
    const [stores, setStores] = useState<StoreDto[]>([]);
    const [loadingStores, setLoadingStores] = useState<boolean>(true);
    const [showExternalSupplierForm, setShowExternalSupplierForm] = useState<boolean>(false);
    const [externalSupplierName, setExternalSupplierName] = useState<string>('');
    const { merchantId } = useParams<{merchantId: string}>();
    const { t } = useTranslation(undefined, { keyPrefix: 'mySuppliers' });

    useEffect(() => {
        const fetchSuppliers = async () => {
            setLoadingStores(true);
            try {
                const stores = await storeService.list();
                const myStores = await storeService.list(merchantId);

                // filter out my stores and mySuppliers
                const actualStoresToDisplay = stores
                    .filter(store => !myStores.some(myStore => myStore.id === store.id))
                    .filter(store => !mySuppliers.some(mySupplier => 
                        mySupplier.representsStore && mySupplier.representsStore.id === store.id));
                setStores(actualStoresToDisplay);
            } finally {
                setLoadingStores(false);
            }
        }

        fetchSuppliers();
    }, [mySuppliers, merchantId]);

    const handleAddExternalSupplier = () => {
        if (onClickAddExternalSupplier && externalSupplierName.trim()) {
            onClickAddExternalSupplier(externalSupplierName);
            setExternalSupplierName('');
            setShowExternalSupplierForm(false);
        }
    };

    const storeColumns: GenericTableColumn<StoreDto>[] = [
        {
            header: t('logo'),
            accessor: (store) => (
                <div className="avatar">
                    <div className="mask mask-circle h-12 w-12 bg-gray-300 flex items-center justify-center">
                        {store.imageUrl ? (
                            <img 
                                src={store.imageUrl} 
                                alt="logo"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                        ) : (
                            <div className="flex items-center justify-center w-full h-full">
                                <span className="text-gray-500 text-xl font-semibold">
                                    {(store.name || '?').charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )
        },
        {
            header: t('name'),
            accessor: (store) => store.name
        },
        {
            header: t('address'),
            accessor: (store) => store.address
        }
    ];

    const storeActions: GenericTableAction<StoreDto>[] = [
        {
            label: t('addSupplier'),
            onClick: (store) => onClickAddSupplier(store)
        }
    ];

    return (
        <div className="p-4">
            <div className="mb-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold">{t('allSuppliers')}</h3>
                <button 
                    className="btn btn-primary btn-sm" 
                    onClick={() => setShowExternalSupplierForm(true)}
                >
                    {t('addExternalSupplier')}
                </button>
            </div>

            {showExternalSupplierForm ? (
                <div className="card bg-base-200 shadow-md p-4 mb-4">
                    <h4 className="text-md font-medium mb-2">{t('addExternalSupplier')}</h4>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">{t('supplierName')}</span>
                        </label>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                className="input input-bordered flex-grow" 
                                placeholder={t('enterSupplierName')}
                                value={externalSupplierName}
                                onChange={(e) => setExternalSupplierName(e.target.value)}
                            />
                            <button 
                                className="btn btn-primary" 
                                onClick={handleAddExternalSupplier}
                                disabled={!externalSupplierName.trim()}
                            >
                                {t('submit')}
                            </button>
                            <button 
                                className="btn btn-outline" 
                                onClick={() => {
                                    setShowExternalSupplierForm(false);
                                    setExternalSupplierName('');
                                }}
                            >
                                {t('cancel')}
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}

            {loadingStores ? (
                <div className="flex justify-center items-center p-8">
                    <LoadingSpinner />
                </div>
            ) : stores.length === 0 ? (
                <div className="text-center p-4">{t('noSupplier')}</div>
            ) : (
                <div className="flex flex-col">
                    <GenericTable
                        data={stores}
                        columns={storeColumns}
                        actions={storeActions}
                    />
                </div>
            )}
        </div>
    );
};

export default AllSuppliersTable;

import { useEffect, useState } from "react";
import { relationsService } from "../../../../api/services/Relations";
import { StoreDto } from "../../../../dto/stores/StoreDto";
import { MySupplier } from "../../../../dto/stores/StoreList";
import { useTranslation } from "react-i18next";
import { storeService } from "../../../../api/services/Store";
import LoadingSpinner from "../../../../components/Loading/LoadingSpinner";
import { Modal } from "../../../../components/Modal/Modal";
import GenericTable, { GenericTableColumn, GenericTableAction } from "../../../../components/Table/GenericTable";
import { useParams } from "react-router-dom";

type Props = {
    mySuppliers: MySupplier[];
    onClickAddSupplier: (store: StoreDto) => void;
}

const AllSuppliersTable = ({
    mySuppliers,
    onClickAddSupplier
}: Props) => {
    // list of all stores (mySuppliers included) that ARE NOT mine
    const [stores, setStores] = useState<StoreDto[]>([]);
    const [loadingStores, setLoadingStores] = useState<boolean>(true);
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
                    .filter(store => !myStores.some(myStore => myStore.url === store.url))
                    .filter(store => !mySuppliers.some(mySupplier => mySupplier.store.url === store.url));
                setStores(actualStoresToDisplay);
            } finally {
                setLoadingStores(false);
            }
        }

        fetchSuppliers()
    }, [mySuppliers]);


    const storeColumns: GenericTableColumn<StoreDto>[] = [
        {
            header: 'Logo',
            accessor: (store) => <div className="avatar">
                <div className="mask mask-circle h-12 w-12">
                    <img src={store.imageUrl} alt="logo" />
                </div>
            </div>
        },
        {
            header: 'Name',
            accessor: (store) => store.name
        },
        {
            header: 'Address',
            accessor: (store) => store.address
        }
    ]

    const storeActions: GenericTableAction<StoreDto>[] = [
        {
            label: 'Add to suppliers',
            onClick: (store) => onClickAddSupplier(store)
        }
    ]

    return (
        <>
            <div className="">
                {
                    loadingStores ? <div className={'flex flex-row items-center justify-center'}><LoadingSpinner /></div> :
                        stores.length === 0 ?
                            <div className={'flex-row text-center'}>{t('noSupplier')}</div> :
                            <div className='flex flex-col'>
                                <GenericTable
                                    data={stores}
                                    columns={storeColumns}
                                    actions={storeActions}
                                />
                            </div>
                }
            </div>
        </>
    );
}

export default AllSuppliersTable;

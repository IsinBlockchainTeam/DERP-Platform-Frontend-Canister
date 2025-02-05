import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { auth } from "../../api/auth";
import { storeService } from "../../api/services/Store";
import { EyeIcon } from "../../components/Icons/Icons";
import StoreModalRegistration from '../../components/StoreModalRegistration/StoreModalRegistration';
import GenericTable, { GenericTableAction, GenericTableColumn } from "../../components/Table/GenericTable";
import TabTitle from "../../components/Tabs/TabTitle";
import { StoreDto } from "../../dto/stores/StoreDto";

const StoresTab = () => {
    const { t } = useTranslation(undefined, { keyPrefix: 'storeCreation' });
    const [stores, setStores] = useState<StoreDto[]>([]);
    const [isStoreRegistrationModalOpen, setIsStoreRegistrationModalOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const { merchantId } = useParams<{ merchantId: string }>();


    const getSupplierStores = async () => {
        const stores = await storeService.list(merchantId)
        setStores(stores);
    }


    const onClickShowDetails = async (store: StoreDto) => {
        const encodedUrl = encodeURIComponent(store.url);
        navigate(`/merchant/${merchantId}/stores/store?storeUrl=${encodedUrl}`);
    }


    const setupPage = async () => {
        try {
            setLoading(true)
            await auth.checkRefresh()
            if (!auth.isLogged()) {
                navigate('/login');
            } else {
                setLoading(true);
                getSupplierStores();
            }
        } finally {
            setLoading(false);
        }
    }

    const toggleModal = () => {
        setIsStoreRegistrationModalOpen(!isStoreRegistrationModalOpen);
    }

    useEffect(() => {
        setupPage()
    }, []);

    const storeColumns: GenericTableColumn<StoreDto>[] = [
        {
            header: t('name'),
            accessor: (store) => store.name
        },
        {
            header: t('additionalInfo'),
            accessor: (store) => store.additionalInfo
        },
        {
            header: t('address'),
            accessor: (store) => store.address
        },
        {
            header: t('postalCodeAndLocation'),
            accessor: (store) => store.postalCodeAndLocation
        },
        {
            header: t('canton'),
            accessor: (store) => store.canton
        },
        {
            header: t('country'),
            accessor: (store) => store.country
        }
    ];

    const storeActions: GenericTableAction<StoreDto>[] = [
        {
            label: <EyeIcon />,
            onClick: (store) => onClickShowDetails(store)
        },
    ];

    useEffect(() => {
        if (!isStoreRegistrationModalOpen) {
            getSupplierStores().then();
        }
    }, [isStoreRegistrationModalOpen]);

    return <div className="flex flex-col p-6">
        <TabTitle title={t('tabs.stores')}
            rightSlot={
                <button
                    className="btn btn-primary"
                    onClick={toggleModal}
                >
                    {t('createStoreBtn')}
                </button>
            }
        />
        <GenericTable
            data={stores}
            columns={storeColumns}
            actions={storeActions}
        />

        <StoreModalRegistration isOpen={isStoreRegistrationModalOpen} toggleModal={toggleModal} />
    </div>
}

export default StoresTab;

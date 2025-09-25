import { Fragment, useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { StoreDto } from '../../dto/stores/StoreDto';
import { storeService } from '../../api/services/Store';
import { parseSearchParamSafe, useStoreId } from '../../utils';
import { useTranslation } from "react-i18next";
import StoreIndicatorLine from '../../components/StoreIndicator/StoreIndicator';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';
import { Modal } from '../../components/Modal/Modal';
import StoreData from '../../components/StoreData/StoreData';
import AssociatedPosFeatureGuard from '../../components/HOC/AssociatedPosFeatureGuard';
import InvoiceAccessCard from '../../components/Invoices/InvoiceAccessCard';
import FeatureDetailPage from './FeatureDetailPage';
import StoreHeader from './StoreHeader';

export default function StoreManagementPage() {
    const [store, setStore] = useState<StoreDto>();
    const [storeInfoModal, setStoreInfoModal] = useState<boolean>(false);
    const id = useStoreId();
    const { t } = useTranslation(undefined, { keyPrefix: 'storeDetails' });
    const { merchantId } = useParams<{ merchantId: string }>();

    useEffect(() => {
        storeService.list(merchantId).then((stores) => {
            const store = stores.find(s => s.id === id);
            if (store)
                setStore(store);
        })
    }, [id])


    if (merchantId === undefined) {
        throw new Error('Merchant ID is required');
    }

    const merchantIdNumber = parseInt(merchantId);

    return (
        <div className={"container"}>
            <div className="mx-5 pb-5">
                {/* Store indicator line */}
                {store ?
                    <>
                        <StoreHeader store={store}/>
                        <div className={'flex gap-3'}>
                            <InvoiceAccessCard merchantId={merchantIdNumber} storeId={store.id}/>
                        </div>
                    </>
                    : <LoadingSpinner />
                }
            </div>

            <Modal open={storeInfoModal} onChangeOpen={setStoreInfoModal}>
            {
                    store ? <div className="flex flex-col align-center">
                            <StoreData
                                store={store}
                            />
                            <button className="btn btn-accent mt-3 m-auto"
                                    onClick={() => setStoreInfoModal(false)}>{t('closeBtn')}</button>
                        </div>
                        : <LoadingSpinner />
                }
            </Modal>
        </div>
    )
}

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
import MenuAccessCard from '../../components/Card/MenuAccessCard';
import { StoreProvider } from './StoreProvider';

export default function StorePage() {
    const [store, setStore] = useState<StoreDto>();
    const [storeInfoModal, setStoreInfoModal] = useState<boolean>(false);
    // const id = useStoreId();
    const { t } = useTranslation(undefined, { keyPrefix: 'storeDetails' });
    const { merchantId, storeId } = useParams<{ merchantId: string, storeId:string }>();

    useEffect(() => {
        if(storeId){
            storeService.list(merchantId).then((stores) => {
                const store = stores.find(s => s.id === parseInt(storeId));
                if (store)
                    setStore(store);
            })
        }else{
            console.log("Store ID is undefined");
        }
    }, [])


    if (merchantId === undefined || storeId === undefined) {
        throw new Error('Merchant ID is required');
    }

    return (
            <div className="mx-5 pb-5">
                {/* Store indicator line */}
                {storeId ?
                    <StoreProvider storeId={parseInt(storeId)}>
                        <StoreHeader />
                        <Fragment>
                            <Outlet />
                        </Fragment>
                    </StoreProvider>
                    : <LoadingSpinner />
                }
            </div>
    )
}

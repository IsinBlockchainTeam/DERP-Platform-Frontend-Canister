import { Fragment, useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { StoreDto } from '../../dto/stores/StoreDto';
import { storeService } from '../../api/services/Store';
import { parseSearchParamSafe } from '../../utils';
import { useTranslation } from "react-i18next";
import StoreIndicatorLine from '../../components/StoreIndicator/StoreIndicator';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';
import { Modal } from '../../components/Modal/Modal';
import StoreData from '../../components/StoreData/StoreData';

const enum TabNames {
    DATA = 'store-data',
    TABLES = 'tables',
    BLOCKCHAIN = 'blockchain',
    APPEARANCE = 'appearance',
    SUPPLIERS = 'suppliers',
    CUSTOMERS = 'customers',
    INVOICES = 'invoices',
    TRANSACTIONS = 'transactions',
    OFFERS = 'offers',
    PRODUCTS = 'products',
    DATA_SYNC = 'data-sync',
    INTERFACES = 'interfaces',
}

export default function StoreDetails() {
    const [searchParams] = useSearchParams();
    const [store, setStore] = useState<StoreDto>();
    const [storeInfoModal, setStoreInfoModal] = useState<boolean>(false);
    const navigate = useNavigate();
    const url = parseSearchParamSafe(searchParams, 'storeUrl');
    const location = useLocation();
    const { t } = useTranslation(undefined, { keyPrefix: 'storeDetails' });
    const { merchantId } = useParams<{ merchantId: string }>();

    const tabs = [
        {
            name: TabNames.TABLES,
            label: t('tabs.tables'),
            path: `/merchant/${merchantId}/stores/store`
        },
        {
            name: TabNames.OFFERS,
            label: t('tabs.offers'),
            path: `/merchant/${merchantId}/stores/store/offers`
        },
        {
            name: TabNames.PRODUCTS,
            label: t('tabs.products'),
            path: `/merchant/${merchantId}/stores/store/products`
        },
        {
            name: TabNames.SUPPLIERS,
            label: t('tabs.suppliers'),
            path: `/merchant/${merchantId}/stores/store/suppliers`
        },
        {
            name: TabNames.CUSTOMERS,
            label: t('tabs.customers'),
            path: `/merchant/${merchantId}/stores/store/customers`
        },
        {
            name: TabNames.BLOCKCHAIN,
            label: t('tabs.blockchains'),
            path: `/merchant/${merchantId}/stores/store/chains`
        },
        {
            name: TabNames.TRANSACTIONS,
            label: t('tabs.transactions'),
            path: `/merchant/${merchantId}/stores/store/transactions`
        },
        {
            name: TabNames.INVOICES,
            label: t('tabs.invoices'),
            path: `/merchant/${merchantId}/stores/store/invoices`
        },
        {
            name: TabNames.DATA_SYNC,
            label: t('tabs.dataSync'),
            path: `/merchant/${merchantId}/stores/store/data-sync`
        },
        {
            name: TabNames.INTERFACES,
            label: t('tabs.interfaces'),
            path: `/merchant/${merchantId}/stores/store/interfaces`
        },
        {
            name: TabNames.APPEARANCE,
            label: t('tabs.appearance'),
            path: `/merchant/${merchantId}/stores/store/style`
        },
    ]

    const isRouteActive = (tab: string) => {
        // find the current path and then find the route that is the longest substring of the current path
        const currentPath = location.pathname.split('?')[0];
        const activeTab = tabs.reduce((prev, curr) => {
            if (currentPath.includes(curr.path) && curr.path.length > prev.path.length) {
                return curr;
            }
            return prev;
        }, tabs[0]);

        return activeTab.name === tab;
    }

    const onGoBack = () => {
        navigate(`..?storeUrl=${encodeURIComponent(store!.url)}`, { relative: 'path', });
    }

    const onInfo = () => {
        setStoreInfoModal(true);
    }

    useEffect(() => {
        storeService.list(merchantId).then((stores) => {
            const store = stores.find(s => s.url === url);
            if (store)
                setStore(store);
        })
    }, [url])

    return (
        <div>
            <div className="mx-5 pb-5">
                {/* Store indicator line */}
                <div className='flex flex-row items-start'>
                    <label className="btn btn-accent btn-circle btn-sm mt-5 mr-8 text-white" onClick={onGoBack}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                        </svg>
                    </label>
                    {store ?
                        <StoreIndicatorLine store={store} onInfo={onInfo} />
                        :
                        <LoadingSpinner />
                    }
                </div>
                <div className="tabs tabs-lifted mt-3" role="tablist">
                    {tabs.map(t => {
                        const isActive = isRouteActive(t.name);
                        return (
                            <Fragment key={t.path}>
                                <NavLink to={`${t.path}?storeUrl=${encodeURIComponent(store?.url || '')}`}
                                    role="tab" className={'tab' + (isActive ? ' tab-active' : '')}>
                                    {t.label}
                                </NavLink>
                                <div role="tabpanel" key={t.name + 'content'} className='tab-content bg-base-100 border-base-300 rounded-box p-6'>
                                    {isActive &&
                                        <Outlet />
                                    }
                                </div>
                            </Fragment>
                        )
                    })}
                </div>
            </div>

            <Modal open={storeInfoModal} onChangeOpen={setStoreInfoModal}>
                {
                    store ? <div className="flex flex-col align-center">
                        <StoreData
                            store={store}
                        />
                        <button className="btn btn-accent mt-3 m-auto" onClick={() => setStoreInfoModal(false)}>{t('closeBtn')}</button>
                    </div>
                        : <LoadingSpinner />
                }
            </Modal>
        </div>
    )
}

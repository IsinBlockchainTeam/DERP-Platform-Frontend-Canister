import { Fragment, useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams } from "react-router";
import { auth } from "../../api/auth";
import Progress from "../../components/Loading/Progress";
import { useTranslation } from "react-i18next";
import { companyService } from '../../api/services/Company';
import { InfoCompanyDto } from '../../dto/CompanyDto';
import { NavLink } from 'react-router-dom';
import BalanceTabDEMO from './Balance/DEMO/BalanceTabDEMO';

enum TabNames {
    BALANCE = 'balance',
    STORES = 'stores',
    INTERFACES = 'interfaces'
}

function MerchantsPage() {
    const { t } = useTranslation(undefined, { keyPrefix: 'storeCreation' });
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const { merchantId } = useParams<{ merchantId: string }>();
    const [merchantData, setMerchantData] = useState<InfoCompanyDto>();

    const fetchMerchantData = async () => {
        if (merchantId === undefined)
            throw new Error("Reseller ID not given to page")

        const numResellerId = parseInt(merchantId);
        const company = await companyService.getById(numResellerId);
        setMerchantData(company);
    }

    const setupPage = async () => {
        try {
            setLoading(true)
            await auth.checkRefresh()
            if (!auth.isLogged()) {
                navigate('/login');
            } else {
                setLoading(true);
                fetchMerchantData();
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setupPage()
    }, []);


    const isRouteActive = (tab: string): boolean => {
        // find the current path and then find the route that is the longest substring of the current path
        const currentPath = location.pathname.split('?')[0];

        const activeTab = tabs.reduce((acc, t) => {
            if (currentPath.includes(t.path)) {
                return t;
            }

            return acc;
        }, tabs[0]);

        return activeTab.name === tab;
    }

    const tabs = [
        {
            name: TabNames.BALANCE,
            label: t('tabs.balance'),
            path: `/merchant/${merchantId}/balance`,
            content: <Outlet />
        },
        {
            name: TabNames.STORES,
            label: t('tabs.stores'),
            path: `/merchant/${merchantId}/stores`,
            content: <Outlet />
        },
        {
            name: TabNames.INTERFACES,
            label: t('tabs.interfaces'),
            path: `/merchant/${merchantId}/interfaces`,
            content: <Outlet />
        }
    ]

    return (
        <div className="flex w-full flex-col p-8">
            {
                loading || !merchantData ?
                    <Progress marginYClassName="my-72" />
                    :
                    <>
                        <h1 className="text-5xl font-light mb-8">{merchantData.businessName}</h1>
                        <Fragment>
                            <Outlet />
                        </Fragment>
                    </>
            }
        </div>
    );


    // return (
    //     <div className="flex w-full flex-col p-8">
    //         {
    //             loading || !merchantData ?
    //                 <Progress marginYClassName="my-72" />
    //                 :
    //                 <>
    //                     <h1 className="text-5xl font-light mb-8">{merchantData.businessName}</h1>
    //                     <div className="tabs tabs-lifted mt-3" role="tablist">
    //                         {tabs.map(t => {
    //                             const isActive = isRouteActive(t.name);
    //                             return (
    //                                 <Fragment key={t.path}>
    //                                     <NavLink to={`${t.path}`}
    //                                         role="tab" className={'tab' + (isActive ? ' tab-active' : '')}>
    //                                         {t.label}
    //                                     </NavLink>
    //                                     <div role="tabpanel" className='tab-content bg-base-100 border-base-300 rounded-box'>
    //                                         {
    //                                             isActive && t.content
    //                                         }
    //                                     </div>
    //
    //                                 </Fragment>
    //                             )
    //                         })}
    //                     </div>
    //                 </>
    //         }
    //     </div>
    // );
}

export default MerchantsPage;

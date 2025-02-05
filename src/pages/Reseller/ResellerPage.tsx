import { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, Outlet, useParams } from 'react-router-dom';
import { companyService } from '../../api/services/Company';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';
import { InfoCompanyDto } from '../../dto/CompanyDto';

const enum TabNames {
    MERCHANTS = 'merchants'
}

const ResellerPage = () => {
    const { resellerId } = useParams<{ resellerId: string }>();
    const [reseller, setReseller] = useState<InfoCompanyDto | null>();
    const [loading, setLoading] = useState<boolean>(false);
    const { t } = useTranslation(undefined, { keyPrefix: 'reseller' });

    const tabs = [
        {
            name: TabNames.MERCHANTS,
            label: t('tabs.merchants'),
            path: `/reseller/${resellerId}/`
        },
    ]

    const fetchData = async () => {
        try {
            if (!resellerId) {
                throw new Error('No company ID given to page')
            }

            setLoading(true)
            const numCompanyId = parseInt(resellerId)
            const reseller = await companyService.getById(numCompanyId);
            setReseller(reseller);
        } catch (e) {
            throw e;
        } finally {
            setLoading(false)
        }
    }

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

    useEffect(() => {
        fetchData()
    }, []);

    return <>
        <div className="flex w-full flex-col p-8">
            {!loading && reseller ?
                <>
                    <h1 className="text-5xl font-light mb-8">{reseller.businessName}</h1>
                    <div className="tabs tabs-lifted mt-3" role="tablist">
                        {tabs.map(t => {
                            const isActive = isRouteActive(t.name);
                            return (
                                <Fragment key={t.path}>
                                    <NavLink to={`${t.path}}`}
                                        role="tab" className={'tab' + (isActive ? ' tab-active' : '')}>
                                        {t.label}
                                    </NavLink>
                                    <div role="tabpanel" key={t.path + 'content'} className='tab-content bg-base-100 border-base-300 rounded-box p-6'>
                                        <Outlet />
                                    </div>

                                </Fragment>
                            )
                        })}
                    </div>
                </>
                :
                <LoadingSpinner />
            }
        </div>
    </>
}


export default ResellerPage;

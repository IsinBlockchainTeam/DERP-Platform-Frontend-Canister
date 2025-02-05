import { Fragment, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate } from 'react-router';
import { NavLink } from 'react-router-dom';
import { auth } from '../../api/auth';

enum TabNames {
    RESELLER= 'reseller',
    MERCHANT= 'merchant'
}

function AdminDashboard() {
    const navigate = useNavigate();
    const { t } = useTranslation(undefined, { keyPrefix: 'adminDashboard' });

    useEffect(() => {
        // TODO questo controllo non è meglio farlo con un middleware ? cosi crei il compopnente solo se l'utente è loggato
        auth.checkRefresh().then(() => {
            if (!auth.isLogged()) {
                navigate('/login');
            }
        });
    }, []);

    const tabs = [
        {
            name: TabNames.RESELLER,
            label: t('tabs.resellers'),
            path: `/admin/reseller`
        },
        {
            name: TabNames.MERCHANT,
            label: t('tabs.merchants'),
            path: `/admin/merchant`
        },
    ]

    const isRouteActive = (tab: string) => {
        // find the current path and then find the route that is the longest substring of the current path
        const currentPath = location.pathname.split('?')[0] || location.pathname;
        console.log(currentPath)
        const activeTab = tabs.find(t => t.path === currentPath)

        return activeTab?.name === tab;
    }

    // TODO fare tutte le traduzione
    // TODO Modificare tabella merchant con i dati giusti
    return (
        <>
            <div className="flex w-full flex-col p-8">
                <h1 className="text-5xl font-light mb-8">Dashboard</h1>
                <div role="tablist" className="tabs tabs-lifted">
                    {tabs.map(t => {
                        const isActive = isRouteActive(t.name);
                        if(isActive) console.log("Active route:" + t.name)
                        return (
                            <Fragment key={t.path}>
                                <NavLink to={t.path}
                                    role="tab" className={'tab' + (isActive ? ' tab-active' : '')}>
                                    {t.label}
                                </NavLink>
                                <div role="tabpanel" key={t.name + 'content'} className='tab-content bg-base-100 border-base-300 rounded-box p-6'>
                                    <Outlet />
                                </div>
                            </Fragment>
                        )
                    })}
                </div>
            </div>
        </>
    );
}

export default AdminDashboard;

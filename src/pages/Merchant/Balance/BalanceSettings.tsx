import { useTranslation } from "react-i18next";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import BackButton from "../../../components/Button/BackButton";
import TabTitle from "../../../components/Tabs/TabTitle";

const BalanceSettings = () => {
    const { t } = useTranslation(undefined, { keyPrefix: 'merchantBalance.balanceSettings' });
    const { merchantId } = useParams();
    const location = useLocation();
    const navigate = useNavigate()


    const categories = [
        {
            label: t('categories'),
            path: 'balance/settings/categories',
            name: 'categories'
        },
        {
            label: t('items'),
            path: 'balance/settings/items',
            name: 'items'
        }
    ]

    const changeRoute = (name: string) => {
        navigate(`/merchant/${merchantId}/balance/settings/${name}`);
    }

    const activeRoute = categories.find(category => location.pathname.includes(category.path))?.name;
    return <div>
        <div className="flex flex-row col w-full p-6 items-center content-center">
            <BackButton onGoBack={
                () => navigate(`/merchant/${merchantId}/balance`)
            } />
            <TabTitle title={t('title')} />
        </div>
        <div className="flex flex-row p-6">
            <ul className="menu rounded-box bg-base-200 w-56">
                {categories.map((category, index) =>
                    <li key={index}>
                        <a onClick={() => changeRoute(category.name)}
                            className={activeRoute === category.name ? 'active' : ''}>{category.label}</a>
                    </li>
                )}
            </ul>

            <div
                className="ml-4 flex-1"
            ><Outlet /></div>
        </div>
    </div>;
}

export default BalanceSettings;

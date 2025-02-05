import { StatementItemCategory } from "@derp/company-canister";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { statementItemsClient } from "../../../api/icp";
import LoadingSpinner from "../../../components/Loading/LoadingSpinner";
import SmartIntInput from "../../../components/SmartIntInput/SmartIntInput";
import TabTitle from "../../../components/Tabs/TabTitle";

const BalanceTab = () => {
    const { merchantId, year, categoryId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<StatementItemCategory[]>([])
    const { t } = useTranslation(undefined, { keyPrefix: 'merchantBalance' })

    const fetchData = async () => {
        console.log(process.env.REACT_APP_ICP_URL);

        try {
            setLoading(true);
            // Fetch data here
            const categoriesVar = await statementItemsClient.getStatementItemsCategories();
            console.log(categoriesVar);
            setCategories(categoriesVar);

            const activeCategoryId = new Number(categoryId);
            console.log("Active category id: ", activeCategoryId);
            if (isNaN(activeCategoryId.valueOf())) {
                console.log("Navigating to none category");
                navigate('none');
            }

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, [merchantId, categoryId]);


    const onChangeCategory = (newCategoryId: number | string) => {
        const path = '/merchant/' + merchantId + '/balance/' + year + '/categories/' + newCategoryId;

        // Navigate to the updated path
        navigate(path);
    };

    const onChangeYear = (newYear: number) => {
        // Extract the current path
        const currentPath = location.pathname;

        // Replace the "{year}" part after "/balance"
        const updatedPath = currentPath.replace(/balance\/[^/]+/, `balance/${newYear}`);

        // Navigate to the updated path
        navigate(updatedPath);
    }

    const yearNumber = new Number(year).valueOf();

    return <div className="flex flex-col col w-full p-6">
        <TabTitle title={t('title')} rightSlot=<button
            className="btn btn-primary"
            onClick={() => navigate(`/merchant/${merchantId}/balance/settings`)}
        >

            {t('settings')}
        </button> />
        <div
        >
            <label className="form-control mb-4 w-min">
                <SmartIntInput
                    onChange={onChangeYear}
                    value={yearNumber}
                    min={1970}
                    max={new Date().getFullYear() + 100}
                    buttons
                    className="w-36"
                    label={t("balanceSettings.year") + ":"}
                />
            </label>
        </div>
        <div className="tabs tabs-bordered w-full" role="tablist">
            {
                loading ?
                    <LoadingSpinner />
                    :
                    categories.map((category) => {
                        const isActive = categoryId === category.id.toString();
                        return <Fragment key={category.id}>
                            <a
                                onClick={() => onChangeCategory(category.id)}
                                role="tab"
                                className={`tab px-8 ${isActive ? 'tab-active font-semibold' : ''}`}
                                style={{ borderBottom: `4px solid ${isActive ? 'oklch(var(--p))' : '#d5d5d5'}` }}
                            >
                                {category.name}
                            </a>
                            <div role="tabpanel" className="tab-content pt-6">
                                {
                                    isActive && <Outlet />
                                }
                            </div>
                        </Fragment>
                    })
            }
            <>
                <a
                    onClick={() => onChangeCategory('none')}
                    role="tab"
                    className={`tab px-8 ${categoryId === 'none' ? 'tab-active font-semibold' : ''}`}
                    style={{ borderBottom: `4px solid ${categoryId === 'none' ? 'oklch(var(--p))' : '#d5d5d5'}` }}
                >
                    {t('uncategorized')}
                </a>
                <div role="tabpanel" className="tab-content pt-6">
                    {
                        categoryId === 'none' && <Outlet />
                    }
                </div>
            </>
        </div>
    </div>
}


export default BalanceTab;

import { Fragment, useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams } from "react-router";
import { auth } from "../../api/auth";
import Progress from "../../components/Loading/Progress";
import { useTranslation } from "react-i18next";
import { companyService } from '../../api/services/Company';
import { CompanyDto } from '../../dto/CompanyDto';

function MerchantsPage() {
    const { t } = useTranslation(undefined, { keyPrefix: 'storeCreation' });
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const { merchantId } = useParams<{ merchantId: string }>();
    const [merchantData, setMerchantData] = useState<CompanyDto>();

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
}

export default MerchantsPage;

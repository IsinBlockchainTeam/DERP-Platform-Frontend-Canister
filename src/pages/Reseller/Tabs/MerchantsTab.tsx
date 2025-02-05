import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { companyService } from "../../../api/services/Company";
import CompaniesTable from "../../../components/CompaniesTable/CompaniesTable";
import LoadingSpinner from "../../../components/Loading/LoadingSpinner";
import { InfoCompanyDto } from "../../../dto/CompanyDto";

const MerchantsTab = () => {
    const { resellerId } = useParams<{ resellerId: string }>();
    const [merchants, setMerchants] = useState<InfoCompanyDto[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const fetchData = async () => {
        setLoading(true);
        try {
            const myMerchants = await companyService.findAll({
                type: 'MERCHANT',
                reseller: resellerId
            })

            setMerchants(myMerchants);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return <>
        {!loading ?
            <CompaniesTable
                data={merchants}
                onDetails={(row) => navigate(`/merchant/${row.companyId}/stores`)}
            ></CompaniesTable>
            : <LoadingSpinner />
        }
    </>
}


export default MerchantsTab;

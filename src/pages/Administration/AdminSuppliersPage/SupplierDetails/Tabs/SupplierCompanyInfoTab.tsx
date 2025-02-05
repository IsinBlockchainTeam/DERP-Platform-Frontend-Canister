import UpdateCompanyInfo from "../../../../CompanyInfo/UpdateCompanyInfo";
import LoadingSpinner from "../../../../../components/Loading/LoadingSpinner";
import {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {parseSearchParamSafe} from "../../../../../utils";
import {companyInfoService} from "../../../../../api/services/CompanyInfo";
import {CompanyInfoDto} from "../../../../../dto/CompanyInfoDto";

export function SupplierCompanyInfoTab() {
    const [companyInfo, setCompanyInfo] = useState<CompanyInfoDto | undefined>(undefined)
    const [searchParams] = useSearchParams();
    const supplierWebId = parseSearchParamSafe(searchParams, 'supplierWebId');

    const init = async () => {
        try {
            const fetchCompanyInfo = await companyInfoService.getCompanyInfoBySupplierWebId(supplierWebId);
            console.log(fetchCompanyInfo);
            setCompanyInfo(fetchCompanyInfo);
        } catch (error : unknown) {
            if (error instanceof Error)
                console.error(error.message);
        }
    }

    useEffect(() => {
        init().then();
    }, []);

    return (
        <div className="w-full">
            {
                !companyInfo ?
                    <LoadingSpinner/>
                    :
                    <UpdateCompanyInfo companyData={companyInfo} supplierWebId={supplierWebId}/>
            }
        </div>
    );
}
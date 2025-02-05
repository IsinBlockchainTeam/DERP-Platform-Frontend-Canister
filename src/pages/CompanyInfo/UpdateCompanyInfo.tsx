import Header from "../../components/Header/Header";
import React, {useEffect, useState} from "react";
import LoadingSpinner from "../../components/Loading/LoadingSpinner";
import {CompanyInfoDto} from "../../dto/CompanyInfoDto";
import {useTranslation} from "react-i18next";
import {companyInfoService} from "../../api/services/CompanyInfo";
import CompanyInfoForm from "../../components/RegistryFrom/CompanyInfoForm";
import Card from "../../components/Card/Card";

type Props = {
    companyData?: CompanyInfoDto;
    supplierWebId?: string;
}

export default function UpdateCompanyInfo({companyData, supplierWebId}: Props) {
    const [companyInfo, setCompanyInfo] = useState<CompanyInfoDto | undefined>(undefined);
    const {t} = useTranslation(undefined, {keyPrefix: "updateCompanyInfo"});
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [loadingForm, setLoadingForm] = useState<boolean>(false)

    const updateCompanyInfo = async (companyInfo: CompanyInfoDto) => {
        setLoadingForm(true);

        if (!companyInfo?.businessName) {
            showErrorMessage(t('errors.businessName'));
            return;
        }

        if (!companyInfo?.email) {
            showErrorMessage(t('errors.email'));
            return;
        }

        if (!companyInfo?.phone) {
            showErrorMessage(t('errors.phone'));
            return;
        }

        if (!companyInfo?.idi) {
            showErrorMessage(t('errors.idi'));
            return;
        }

        if (!companyInfo?.vat) {
            showErrorMessage(t('errors.vat'));
            return;
        }

        if (!companyInfo?.webSite) {
            showErrorMessage(t('errors.webSite'));
            return;
        }

        if (!companyInfo?.representativeUserEmail) {
            showErrorMessage(t('errors.representative'));
            return;
        }

        companyInfoService.updateCompanyInfo(companyInfo, supplierWebId).then(() => {
            setLoadingForm(false);
        }).catch((error: unknown) => {
            if (error instanceof Error)
                showErrorMessage(error.message);
        }).finally(() => setLoadingForm(false));
    }

    const showErrorMessage = (message: string) => {
        setErrorMessage(message);
        setTimeout(clearErrorMessage, 5000);
    }

    const clearErrorMessage = () => {
        setErrorMessage('');
    }

    const init = async () => {
        try {
            if (companyData){
                console.log("Company data", companyData);
                setCompanyInfo(companyData);
            } else {
                const fetchedCompanyInfo = await companyInfoService.getCompanyInfo();
                setCompanyInfo(fetchedCompanyInfo);
            }
        } catch (error: unknown) {
            if (error instanceof Error)
                showErrorMessage(error.message);
        }
    }

    useEffect(() => {
        init().then();
    }, []);

    return (
        <div>
            {
                companyInfo ?
                    <>
                        {
                            !companyData && <Header />
                        }

                        <div className={!companyData ? "mx-5 py-20" : "mx-5 py-2"}>
                            <div className="text-center flex flex-col justify-center items-center">
                                <Card title={t('title')}>
                                    <CompanyInfoForm companyInfo={companyInfo} onAction={updateCompanyInfo}
                                                     btnText={t('btnUpdate')} errorMessage={errorMessage}
                                                     loadingForm={loadingForm} />
                                </Card>

                            </div>
                        </div>
                    </>
                    :
                    <LoadingSpinner />
            }
        </div>
    )
}

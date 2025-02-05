import Header from "../../components/Header/Header";
import React, {useState} from "react";
import LoadingSpinner from "../../components/Loading/LoadingSpinner";
import {CompanyInfoDto} from "../../dto/CompanyInfoDto";
import {useTranslation} from "react-i18next";
import {companyInfoService} from "../../api/services/CompanyInfo";
import CompanyInfoForm from "../../components/RegistryFrom/CompanyInfoForm";
import {useNavigate} from "react-router-dom";
import Card from "../../components/Card/Card";
import {RegisterUserResponseDto} from "../../dto/auth/RegisterUserDto";

const emptyCompanyInfo: CompanyInfoDto = {
    businessName: '',
    email: '',
    phone: '',
    idi: '',
    vat: '',
    webSite: '',
    representativeUserEmail: ''
};

type Props = {
    supplier?: RegisterUserResponseDto;
    onCompleted?: () => void;
}

export default function SaveCompanyInfo({supplier, onCompleted}: Props) {
    const [companyInfo] = useState<CompanyInfoDto>(emptyCompanyInfo);
    const {t} = useTranslation(undefined, {keyPrefix: "saveCompanyInfo"});
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [loadingForm, setLoadingForm] = useState<boolean>(false)
    const navigate = useNavigate();

    const saveCompanyInfo = async (companyInfo: CompanyInfoDto) => {
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

        companyInfoService.createCompanyInfo(companyInfo, supplier).then(() => {
            if (supplier && onCompleted)
                onCompleted();
            else
                navigate('/supplier/stores');
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

    return (
        <div>
            {
                !supplier && <Header/>
            }

            <div className="mx-5 py-20">
                <div className="text-center flex flex-col justify-center items-center">
                    {
                        companyInfo ?
                            <Card title={t('title')} subtitle={t('subtitle')}>
                                <CompanyInfoForm companyInfo={companyInfo} onAction={saveCompanyInfo} btnText={t('btnSave')} errorMessage={errorMessage} loadingForm={loadingForm} />
                            </Card>
                            :
                            <LoadingSpinner/>
                    }
                </div>
            </div>
        </div>
    )
}

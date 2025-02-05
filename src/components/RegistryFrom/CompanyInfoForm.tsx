import React, { useEffect, useState } from "react";
import { CompanyInfoDto } from "../../dto/CompanyInfoDto";
import FormLoader from "../Loading/FormLoader";
import { useTranslation } from "react-i18next";

type Props = {
    companyInfo: CompanyInfoDto;
    onAction: (companyInfo: CompanyInfoDto) => Promise<void>;
    btnText: string;
    errorMessage: string;
    loadingForm: boolean;
}

export default function CompanyInfoForm({ companyInfo, btnText, onAction, errorMessage, loadingForm }: Props) {
    const { t } = useTranslation(undefined, { keyPrefix: "companyInfoForm" });
    const [disabled, setDisabled] = useState<boolean>(false);

    const action = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        await onAction(companyInfo);
    }

    const areAllFieldsFilled = () => {
        let disabled = false;
        for (const key in companyInfo) {
            if (companyInfo[key as keyof CompanyInfoDto] === '') {
                disabled = true;
            }
        }
        setDisabled(disabled);
    };

    useEffect(() => {
        areAllFieldsFilled();
    }, []);

    return (
        <form className="max-w-4xl mx-auto">
            {errorMessage && (
                <div className="alert alert-error shadow-lg mb-6">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg"
                             className="stroke-current flex-shrink-0 h-6 w-6" fill="none"
                             viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{errorMessage}</span>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="label">
                        <span className="label-text font-bold text-primary">{t('businessName')}:</span>
                    </label>
                    <input
                        type="text"
                        id="businessName"
                        placeholder={t('businessNamePlaceholder')}
                        className="input input-bordered w-full"
                        defaultValue={companyInfo.businessName}
                        onChange={e => {
                            companyInfo.businessName = e.target.value;
                            areAllFieldsFilled();
                        }}
                    />
                </div>

                <div>
                    <label className="label">
                        <span className="label-text font-bold text-primary">{t('email')}:</span>
                    </label>
                    <input
                        type="text"
                        id="email"
                        placeholder={t('emailPlaceholder')}
                        className="input input-bordered w-full"
                        defaultValue={companyInfo.email}
                        onChange={e => {
                            companyInfo.email = e.target.value;
                            areAllFieldsFilled();
                        }}
                    />
                </div>

                <div>
                    <label className="label">
                        <span className="label-text font-bold text-primary">{t('phone')}:</span>
                    </label>
                    <input
                        type="text"
                        id="phone"
                        placeholder={t('phonePlaceholder')}
                        className="input input-bordered w-full"
                        defaultValue={companyInfo.phone}
                        onChange={e => {
                            companyInfo.phone = e.target.value;
                            areAllFieldsFilled();
                        }}
                    />
                </div>

                <div>
                    <label className="label">
                        <span className="label-text font-bold text-primary">{t('idi')}:</span>
                    </label>
                    <input
                        type="text"
                        id="idi"
                        placeholder={t('idiPlaceholder')}
                        className="input input-bordered w-full"
                        defaultValue={companyInfo.idi}
                        onChange={e => {
                            companyInfo.idi = e.target.value;
                            areAllFieldsFilled();
                        }}
                    />
                </div>

                {/* Campo VAT */}
                <div>
                    <label className="label">
                        <span className="label-text font-bold text-primary">{t('vat')}:</span>
                    </label>
                    <input
                        type="text"
                        id="vat"
                        placeholder={t('vatPlaceholder')}
                        className="input input-bordered w-full"
                        defaultValue={companyInfo.vat}
                        onChange={e => {
                            companyInfo.vat = e.target.value;
                            areAllFieldsFilled();
                        }}
                    />
                </div>

                <div>
                    <label className="label">
                        <span className="label-text font-bold text-primary">{t('representative')}:</span>
                    </label>
                    <input
                        type="text"
                        id="representative"
                        placeholder={t('representativePlaceholder')}
                        className="input input-bordered w-full"
                        defaultValue={companyInfo.representativeUserEmail}
                        onChange={e => {
                            companyInfo.representativeUserEmail = e.target.value;
                            areAllFieldsFilled();
                        }}
                    />
                </div>

                {/* Campo Website che si estende su entrambe le colonne */}
                <div className="md:col-span-2">
                    <label className="label">
                        <span className="label-text font-bold text-primary">{t('webSite')}:</span>
                    </label>
                    <input
                        type="text"
                        id="webSite"
                        placeholder={t('webSitePlaceholder')}
                        className="input input-bordered w-full"
                        defaultValue={companyInfo.webSite}
                        onChange={e => {
                            companyInfo.webSite = e.target.value;
                            areAllFieldsFilled();
                        }}
                    />
                </div>
            </div>

            <div className="flex justify-center mt-6">
                <button className="btn btn-primary" onClick={action} disabled={disabled}>
                    {btnText}
                </button>
            </div>

            {loadingForm && <FormLoader />}
        </form>
    );
}

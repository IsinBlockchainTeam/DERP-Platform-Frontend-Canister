import {useTranslation} from "react-i18next";
import React, {useState} from "react";
import Card from "../../../../components/Card/Card";
import SaveCompanyInfo from "../../../CompanyInfo/SaveCompanyInfo";
import {RegisterUserResponseDto} from "../../../../dto/auth/RegisterUserDto";

enum Choice {
    SKIP = 'skip',
    CREATE = 'create'
}

type Props = {
    supplierData: RegisterUserResponseDto | null;
    onCompleted: () => void;
}

export function CreateCompanyInfoStep({supplierData, onCompleted}: Props) {
    // TODO: Probably to remove
    //
    //const {t} = useTranslation(undefined, {keyPrefix: 'companyInfoCreation'});
    //const [choice, setChoice] = useState<undefined | Choice>(undefined);
    //
    //return (
    //    <>
    //        {
    //            choice === undefined ?
    //                <div className="h-screen flex flex-col items-center justify-center">
    //                    <Card title={t('title')} subtitle={t('subtitle')}>
    //                        <div className="w-full">
    //                            <div className={'flex flex-row justify-between'}>
    //                                <button className={'btn flex-1 mx-2'}
    //                                        onClick={() => {
    //                                            setChoice(Choice.SKIP);
    //                                            onCompleted();
    //                                        }
    //                                }>{t('btnSkip')}</button>
    //                                <button className={'btn flex-1 btn-primary mx-2'}
    //                                        onClick={() => setChoice(Choice.CREATE)}>{t('btnContinue')}</button>
    //                            </div>
    //                        </div>
    //
    //                    </Card>
    //                </div>
    //                :
    //                choice === Choice.CREATE &&
    //                <SaveCompanyInfo supplier={supplierData ? supplierData : undefined} onCompleted={onCompleted}/>
    //        }
    //    </>
    //)
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { companyService } from "../../../api/services/Company";
import CompaniesTable from "../../../components/CompaniesTable/CompaniesTable";
import LoadingSpinner from "../../../components/Loading/LoadingSpinner";
import { InfoCompanyDto } from "../../../dto/CompanyDto";
import CompanyEditModal from "../CompanyEditModal";
import CompanyRegistrationModal from "../CompanyRegistrationModal";
import { useTranslation } from 'react-i18next';

const AdminMerchantsTab = () => {
    const [merchants, setMerchants] = useState < InfoCompanyDto[] > ([]);
    const [resellers, setResellers] = useState < InfoCompanyDto[] > ([]);
    const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState < boolean > (false);
    const [companyIdSelected, setCompanyIdSelected] = useState < number > ();
    const [loading, setLoading] = useState < boolean > (false);
    const [isEditModalOpen, setIsEditModalOpen] = useState < boolean > (false);
    const navigate = useNavigate();
    const { t } = useTranslation(undefined, { keyPrefix: 'adminMerchant' });


    const fetchData = async () => {
        setLoading(true);
        try {
            const merchant = await companyService.findAll({
                type: 'MERCHANT',
            })

            const resellers = await companyService.findAll({
                type: 'RESELLER'
            })

            setMerchants(merchant);
            setResellers(resellers);
        } finally {
            setLoading(false);
        }
    }


    const toggleEditModal = () => {
        setIsEditModalOpen(!isEditModalOpen);
    }

    const createNewCompany = () => {
        toggleModal();
    }

    const toggleModal = () => {
        setIsRegistrationModalOpen(!isRegistrationModalOpen);
    }

    useEffect(() => {
        if (!isRegistrationModalOpen || !isEditModalOpen)
            fetchData();
    }, [isEditModalOpen, isRegistrationModalOpen])

    return <>
        {!loading ?
            <div>
                <div className="flex justify-between" style={{ marginBottom: '20px' }}>
                    <h1 className="text-3xl font-light">{t('tabTitle')}</h1>
                    <button onClick={() => createNewCompany()} className="btn btn-primary">
                        {t('btnAdd')}
                    </button>
                </div>
                <CompaniesTable data={merchants}
                    onEdit={(row) => {
                        setCompanyIdSelected(row.companyId)
                        toggleEditModal()
                    }}
                    onDetails={(row) => {
                        navigate(`/merchant/${row.companyId}/stores`)
                    }}
                ></CompaniesTable>

                <CompanyRegistrationModal isOpen={isRegistrationModalOpen}
                    toggleModal={toggleModal}
                    companyType={'MERCHANT'}
                    infoMessage={t('registrationModalMessage')}
                    title={t('registrationModalTitle')}></CompanyRegistrationModal>
                {companyIdSelected
                    &&
                    <CompanyEditModal
                        title={t('editModalTitle')}
                        isMerchant={true}
                        isOpen={isEditModalOpen}
                        toggleModal={toggleEditModal}
                        companyId={companyIdSelected}
                        resellersForMerchant={resellers} />
                }
            </div>
            : <LoadingSpinner />
        }
    </>
}


export default AdminMerchantsTab;

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { companyService } from "../../../api/services/Company";
import CompaniesTable from "../../../components/CompaniesTable/CompaniesTable";
import LoadingSpinner from "../../../components/Loading/LoadingSpinner";
import { InfoCompanyDto } from "../../../dto/CompanyDto";
import CompanyEditModal from "../CompanyEditModal";
import CompanyRegistrationModal from "../CompanyRegistrationModal";
import { useTranslation } from 'react-i18next';
import { GenericFormField } from '../../../components/Form/GenericForm';

const AdminResellerTab = () => {
    const [resellers, setResellers] = useState < InfoCompanyDto[] > ([]);
    const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState < boolean > (false);
    const [companyIdSelected, setCompanyIdSelected] = useState < number > ();
    const [loading, setLoading] = useState < boolean > (false);
    const [isEditModalOpen, setIsEditModalOpen] = useState < boolean > (false);
    const navigate = useNavigate();
    const { t } = useTranslation(undefined, { keyPrefix: 'adminReseller' });


    const fetchData = async () => {
        setLoading(true);
        try {
            const resellers = await companyService.findAll({
                type: 'RESELLER',
            })

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
        if (!isRegistrationModalOpen) {
            fetchData();
        }
    }, [isRegistrationModalOpen, isEditModalOpen]);

    return <>
        {!loading ?
            <div>
                <div className="flex justify-between" style={{ marginBottom: '20px' }}>
                    <h1 className="text-3xl font-light">{t('tabTitle')}</h1>
                    <button onClick={() => createNewCompany()} className="btn btn-primary">
                        {t('btnAdd')}
                    </button>
                </div>
                <CompaniesTable data={resellers}
                    onEdit={(row) => {
                        setCompanyIdSelected(row.companyId)
                        toggleEditModal()
                    }}
                    onDetails={(row) => {
                        navigate(`/reseller/${row.companyId}`)
                    }}
                ></CompaniesTable>

                <CompanyRegistrationModal
                    isOpen={isRegistrationModalOpen}
                    toggleModal={toggleModal}
                    companyType={'RESELLER'}
                    infoMessage={t('registrationModalMessage')}
                    title={t('registrationModalTitle')} />

                {
                    companyIdSelected &&
                        <CompanyEditModal
                            title={t('editModalTitle')}
                            isMerchant={false}
                            isOpen={isEditModalOpen}
                            toggleModal={toggleEditModal}
                            companyId={companyIdSelected}
                        />
                }

            </div>
            : <LoadingSpinner />
        }
    </>
}


export default AdminResellerTab;

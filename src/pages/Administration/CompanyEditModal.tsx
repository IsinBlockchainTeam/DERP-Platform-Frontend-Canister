import { CreatedCompanyDto, CreateRepresentativeDto, InfoCompanyDto, RepresentativeStatus } from '../../dto/CompanyDto';
import React, { Fragment, useEffect, useState } from 'react';
import { companyService } from '../../api/services/Company';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';
import GenericForm, { GenericFormField, GenericFormData } from '../../components/Form/GenericForm';
import { merchantsService } from '../../api/services/Merchants';
import GenericTable from '../../components/Table/GenericTable';
import { RegisterUserDto } from '../../dto/UserDto';
import { userService } from '../../api/services/User';
import { UserRole } from '../../model/UserRole';
import { useTranslation } from 'react-i18next';


type ModalProps = {
    isOpen: boolean,
    toggleModal: () => void
    companyId: number,
    isMerchant: boolean,
    resellersForMerchant?: InfoCompanyDto[]
    infoMessage?: string,
    title?: string
}

enum TabNames {
    COMPANY = 'company',
    USERS = 'users',
}


function CompanyEditModal(props: ModalProps) {
    const [companyUpdated, setCompanyUpdated] = React.useState<CreatedCompanyDto | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<TabNames>(TabNames.COMPANY);
    const [users, setUsers] = useState<GenericFormData[]>([]);
    const { t } = useTranslation(undefined, { keyPrefix: 'companyEditModal' });

    const commonFormFields: GenericFormField[] = [
        {
            labelName: t('company.businessName'),
            name: 'businessName',
            typeNode: { typeNodeName: 'input', type: 'text', placeholder: t('company.labelBusinessName') },
            isRequired: true
        },
        {
            labelName: t('company.additionalInfo'),
            name: 'additionalInfo',
            typeNode: { typeNodeName: 'input', type: 'text', placeholder: t('company.labelAdditionalInfo') },
            isRequired: true
        },
        {
            labelName: t('company.address'),
            name: 'address',
            typeNode: { typeNodeName: 'input', type: 'text', placeholder: t('company.labelAddress')  },
            isRequired: true
        },
        {
            labelName: t('company.postalCodeAndLocation'),
            name: 'postalCodeAndLocation',
            typeNode: { typeNodeName: 'input', type: 'text', placeholder: t('company.labelPostalCodeAndLocation') },
            isRequired: true
        },
        {
            labelName: t('company.canton'),
            name: 'canton',
            typeNode: { typeNodeName: 'input', type: 'text', placeholder: t('company.labelCanton') , maxLength: 2 },
            isRequired: false
        },
        {
            labelName: t('company.country'),
            name: 'country',
            typeNode: { typeNodeName: 'input', type: 'text', placeholder: t('company.labelCountry') , maxLength: 3 },
            isRequired: false
        },
        {
            labelName: t('company.idi'),
            name: 'idi',
            typeNode: { typeNodeName: 'input', type: 'text', placeholder: t('company.labelIdi')  },
            isRequired: false
        },
        {
            labelName: t('company.vat'),
            name: 'vat',
            typeNode: { typeNodeName: 'input', type: 'text', placeholder: t('company.labelVat')  },
            isRequired: false
        },
        {
            labelName: t('company.phone'),
            name: 'phone',
            typeNode: { typeNodeName: 'input', type: 'tel', placeholder: t('company.labelPhone')  },
            isRequired: true
        },
        {
            labelName: t('company.webSite'),
            name: 'webSite',
            typeNode: { typeNodeName: 'input', type: 'url', placeholder: t('company.labelWebSite')  },
            isRequired: true
        },
        {
            labelName: t('company.email'),
            name: 'email',
            typeNode: { typeNodeName: 'input', type: 'email', placeholder: t('company.labelEmail')  },
            isRequired: true
        }
    ];

    const representativeFormFields: GenericFormField[] = [
        {
            labelName: t('user.firstName'),
            name: 'firstName',
            typeNode: { typeNodeName: 'input', type: 'text', placeholder: t('user.labelFirstName')  },
            isRequired: true
        },
        {
            labelName: t('user.lastName'),
            name: 'lastName',
            typeNode: { typeNodeName: 'input', type: 'text', placeholder: t('user.labelLastName') },
            isRequired: true
        },
        {
            labelName: t('user.roleFunction'),
            name: 'roleFunction',
            typeNode: { typeNodeName: 'input', type: 'text', placeholder: t('user.labelRoleFunction') },
            isRequired: true
        },
        {
            labelName: t('user.phone'),
            name: 'phone',
            typeNode: { typeNodeName: 'input', type: 'tel', placeholder: t('user.labelPhone') },
            isRequired: true
        },
        {
            labelName: t('user.email'),
            name: 'email',
            typeNode: { typeNodeName: 'input', type: 'email', placeholder: t('user.labelEmail') },
            isRequired: true
        },
        {
            labelName: t('user.username'),
            name: 'username',
            typeNode: { typeNodeName: 'input', type: 'text', placeholder: t('user.labelUsername') },
            isRequired: true
        },
        {
            labelName: t('user.password'),
            name: 'password',
            typeNode: { typeNodeName: 'input', type: 'password', placeholder: t('user.labelPassword') },
            isRequired: true
        }
    ];

    const [formFields, setFormFields] = useState<GenericFormField[]>(commonFormFields);

    const [initialData, setInitialData] = useState<GenericFormData>({
        businessName: '',
        additionalInfo: '',
        address: '',
        postalCodeAndLocation: '',
        canton: '',
        country: '',
        idi: '',
        vat: '',
        phone: '',
        webSite: '',
        email: '',
        representativeEmail: '',
        type: '',
        resellerId: ''
    });

    const initialRepresentativeFormData: GenericFormData = {
        firstName: '',
        lastName: '',
        roleFunction: '',
        phone: '',
        email: '',
        username: '',
        password: '',
        status: RepresentativeStatus.ACTIVE
    };

    const [newUser, setNewUser] = useState<GenericFormData>(initialRepresentativeFormData);

    const representativeColumns = [
        {
            header: t('user.firstName'),
            accessor: 'firstName'
        },
        {
            header: t('user.lastName'),
            accessor: 'lastName'
        },
        {
            header: t('user.roleFunction'),
            accessor: 'roleFunction'
        },
        {
            header: t('user.phone'),
            accessor: 'phone'
        },
        {
            header: t('user.email'),
            accessor: 'email'
        },
        {
            header: t('user.username'),
            accessor: 'username'
        },
        {
            header: t('user.status'),
            accessor: 'status'
        }
    ];


    const getCompanyTabContent = () => {
        return (
            <div className="flex w-full flex-col justify-center space-y-6">
                {
                    companyUpdated ?
                        <div role="alert" className="flex flex-col alert bg-slate-50">
                            {/*<h1 className="text-xl font-light">{t('updatedCompanyTitle')}</h1>*/}
                            <div className="flex flex-wrap -mx-4">
                                {
                                    commonFormFields.map(field => (
                                    <div key={field.name} className="w-full md:w-1/2 px-4 mb-4">
                                        <label className="block text-gray-700 font-semibold mb-1">
                                            {field.labelName}
                                        </label>
                                        <input
                                            type="text"
                                            value={companyUpdated[field.name as keyof CreatedCompanyDto] || ''}
                                            readOnly
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-600 bg-gray-100 cursor-not-allowed"
                                        />
                                    </div>
                                ))}

                                {
                                    companyUpdated.resellerId !== 0 &&
                                    <div key="resellerId" className="w-full md:w-1/2 px-4 mb-4">
                                        <label className="block text-gray-700 font-semibold mb-1">
                                            {t('company.managedBy')}
                                        </label>
                                        <input
                                            type="text"
                                            value={props.resellersForMerchant?.find(reseller => reseller.companyId === companyUpdated.resellerId)?.businessName || ''}
                                            readOnly
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-600 bg-gray-100 cursor-not-allowed"
                                        />
                                    </div>
                                }
                            </div>
                            <div className={'divider'}></div>
                            <button onClick={() => {
                                props.toggleModal();
                                setCompanyUpdated(undefined);
                            }} className="btn btn-outline mt-4 w-1/3">
                                {t('backToDashboard')}
                            </button>
                        </div>
                        :
                        <>
                            {
                                isSubmitting ?
                                    <div className="flex flex-1 flex-row justify-center">
                                        <LoadingSpinner/>
                                    </div>
                                    :
                                    <GenericForm handleSubmit={handleSubmit}
                                                 initialData={initialData}
                                                 fields={formFields}
                                                 handleCancel={() => {
                                                     props.toggleModal();
                                                     setActiveTab(TabNames.COMPANY);
                                                     setCompanyUpdated(undefined);
                                                 }}
                                                 cancelLabel={t('cancel')}
                                                 submitLabel={t('submit')}
                                    />
                            }
                        </>
                }
            </div>
        );
    };

    const getUsersTabContent = () => {
        return (
            <div className="flex w-full flex-col justify-center space-y-6 my-3">
                <div className="collapse collapse-arrow border-base-300 bg-base-200 border">
                    <input type="checkbox" />
                    <div className="collapse-title text-xl font-medium">
                        <h1 className="text-xl font-light">{t('user.addUserTitle')}</h1>
                    </div>
                    <div className="collapse-content">
                        {
                            isSubmitting ?
                                <div className="flex flex-1 flex-row justify-center">
                                    <LoadingSpinner/>
                                </div>
                                :
                                <GenericForm handleSubmit={handleUserSubmit}
                                             initialData={newUser}
                                             fields={representativeFormFields}
                                             handleCancel={() => {
                                                 props.toggleModal();
                                                 setActiveTab(TabNames.COMPANY);
                                                 setUsers([]);
                                                 setNewUser(initialRepresentativeFormData);
                                                 setCompanyUpdated(undefined);
                                             }}
                                             cancelLabel={t('cancel')}
                                             submitLabel={t('submit')}
                                />
                        }
                    </div>
                </div>
                <div className="collapse collapse-arrow border-base-300 bg-base-200 border">
                <input type="checkbox" />
                    <div className="collapse-title text-xl font-medium">
                        <h1 className="text-xl font-light">{t('user.userListTitle')}</h1>
                    </div>
                    <div className="collapse-content">
                        <GenericTable data={users} columns={representativeColumns} />
                    </div>
                </div>
            </div>
        );
    };

    const getCompanyUsers = async () => {
        const users = await userService.list(props.companyId);
        setUsers(users as unknown as GenericFormData[]);
    }

    useEffect(() => {
        if (props.isMerchant) {
            if (!props.resellersForMerchant) {
                throw new Error('Reseller list is required when editing a merchant');
            }

            setFormFields(old => [...old, {
                labelName: t('company.managedBy'),
                name: 'resellerId',
                typeNode: {
                    typeNodeName: 'select',
                    type: 'select',
                    placeholder: 'Select Reseller',
                    emptyOption: 'Select a Reseller',
                    options: props.resellersForMerchant!.map(reseller =>
                        ({
                            key: `${reseller.companyId}`,
                            value: `${reseller.companyId}`,
                            label: reseller.businessName
                        }))
                },
                isRequired: true
            }]);
        }
    }, []);

    useEffect(() => {
        if (props.isOpen && props.companyId) {
            getCompanyInfo(props.companyId);
            getCompanyUsers().then();
        }
    }, [props.isOpen]);

    const getCompanyInfo = async (companyId: number) => {
        try {
            const companyInfo = await companyService.getById(companyId);
            console.log('Company info: ', companyInfo);
            let initData: GenericFormData = {
                businessName: companyInfo.businessName,
                email: companyInfo.email,
                phone: companyInfo.phone,
                idi: companyInfo.idi || '',
                vat: companyInfo.vat || '',
                webSite: companyInfo.webSite,
                representativeEmail: companyInfo.representativeUserEmail,
                additionalInfo: companyInfo.additionalInfo,
                address: companyInfo.address,
                postalCodeAndLocation: companyInfo.postalCodeAndLocation,
                canton: companyInfo.canton || '',
                country: companyInfo.country || '',
            };

            if (props.isMerchant && companyInfo.resellerId) {
                initData = { ...initData, resellerId: `${companyInfo.resellerId}` || '' };
            }

            setInitialData(initData);
        } catch (e) {
            console.error(e);
        }
    };

    const handleSubmit = async (formData: GenericFormData) => {
        try {
            setIsSubmitting(true);
            const updateCompany = {
                ...formData,
                resellerId: formData.resellerId ? parseInt(formData.resellerId) : undefined
            };
            await merchantsService.updateMerchant(props.companyId, updateCompany);
            await getCompanyInfo(props.companyId);
            setCompanyUpdated({
                ...formData,
                resellerId: formData.resellerId ? parseInt(formData.resellerId) : 0
            } as unknown as CreatedCompanyDto);
        } catch (e) {
            console.error(e);
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleUserSubmit = async (formData: GenericFormData) => {
        try {
            setNewUser(formData);
            setIsSubmitting(true);
            const user = {
                ...(formData as unknown as CreateRepresentativeDto),
                companyId: props.companyId,
                role: props.isMerchant ? UserRole.SUPPLIER : UserRole.RESELLER
            } as RegisterUserDto;
            await userService.register(user);
            setNewUser(initialRepresentativeFormData);
            await getCompanyUsers();
        } catch (e) {
            console.error(e);
        } finally {
            setIsSubmitting(false);
        }
    }

    const tabs = [
        {
            name: TabNames.COMPANY,
            label: t('companyTab'),
            content: getCompanyTabContent()
        },
        {
            name: TabNames.USERS,
            label: t('userTab'),
            content: getUsersTabContent()
        }
    ];

    //TODO create generic success feedback
    //TODO get plain password to show
    //TODO fare traduzione
    return (
        <dialog className={'modal w-full h-full' + (props.isOpen && ' modal-open')}>
            <div className="modal-box w-11/12 max-w-5xl">
                {/*<h1 className="text-3xl font-light p-2">{props.title}</h1>*/}

                <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                            onClick={() => {
                                props.toggleModal();
                                setActiveTab(TabNames.COMPANY);
                                setUsers([]);
                                setNewUser(initialRepresentativeFormData);
                                setCompanyUpdated(undefined);
                            }}>
                        ✕
                    </button>
                </form>

                <div role="tablist" className="tabs tabs-lifted">
                    {
                        tabs.map(tab => (
                            <Fragment key={tab.name}>
                                <a
                                    role="tab"
                                    className={`tab ${activeTab === tab.name ? 'tab-active' : ''}`}
                                    onClick={() => setActiveTab(tab.name)}
                                >
                                    {tab.label}
                                </a>
                                <div role="tabpanel"
                                     className="tab-content bg-base-100 border-base-300 rounded-box p-6">
                                    {tab.content}
                                </div>
                            </Fragment>
                        ))
                    }
                </div>
            </div>
        </dialog>

    );
}

export default CompanyEditModal;

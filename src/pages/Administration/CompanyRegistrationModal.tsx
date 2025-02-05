import {
    CreateCompanyDto,
    CreatedCompanyDto,
    CreateRepresentativeDto,
    InfoCompanyDto,
    RepresentativeStatus
} from '../../dto/CompanyDto';
import React, { Fragment, useState } from 'react';
import { companyService } from '../../api/services/Company';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';
import GenericForm, { GenericFormField, GenericFormData } from '../../components/Form/GenericForm';
import { useTranslation } from 'react-i18next';

enum Steps {
    COMPANY = 0,
    REPRESENTATIVE = 1
}

const initialCompanyFormData: GenericFormData = {
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
    email: ''
};

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


type ModalProps = {
    isOpen: boolean,
    toggleModal: () => void
    companyType: 'RESELLER' | 'MERCHANT' | ''
    infoMessage?: string,
    title?: string
}

function CompanyModalRegistration(props: ModalProps) {
    const [companyCreated, setCompanyCreated] = React.useState<CreatedCompanyDto | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [currentStep, setCurrentStep] = useState<Steps>(Steps.COMPANY);
    const [companyData, setCompanyData] = useState<GenericFormData>(initialCompanyFormData);
    const [representative, setRepresentative] = useState<GenericFormData>(initialRepresentativeFormData);
    const { t } = useTranslation(undefined, { keyPrefix: 'companyModalRegistration' });

    const companyFormFields: GenericFormField[] = [
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


    const handleNextStep = (companySetData: GenericFormData) => {
        setCompanyData(companySetData);
        setCurrentStep(Steps.REPRESENTATIVE);
        steps[currentStep].completed = true;
    };

    const handleBackStep = (representativeSetData?: GenericFormData) => {
        console.log('Back Step', representativeSetData);
        if (representativeSetData)
            setRepresentative(representativeSetData);
        steps[currentStep].completed = false;
        setCurrentStep(Steps.COMPANY);

    };

    const handleSubmit = async (representativeSetData: GenericFormData) => {
        try {
            setRepresentative(representativeSetData);
            setIsSubmitting(true);
            const newCompanyData = {
                representative: representativeSetData,
                company: { ...companyData, type: props.companyType }
            } as unknown as CreateCompanyDto;
            const newInfoCompany = await companyService.createCompanyInfo(newCompanyData);
            console.log('New Company', newInfoCompany);
            setCompanyCreated(newInfoCompany);
        } catch (e) {
            console.error(e);
        } finally {
            setIsSubmitting(false);
        }
    };


    const getCompanyStepContent = () => {
        return (
            <GenericForm handleSubmit={handleNextStep}
                         initialData={companyData}
                         fields={companyFormFields}
                         handleCancel={() => {
                             setCurrentStep(Steps.COMPANY);
                             setRepresentative(initialRepresentativeFormData);
                             setCompanyData(initialCompanyFormData);
                             props.toggleModal();
                         }}
                         cancelLabel={t('cancel')}
                         submitLabel={t('next')}
            />
        );

    };

    const getRepresentativeStepContent = () => {
        return isSubmitting ?
            <div className="flex flex-1 flex-row justify-center">
                <LoadingSpinner/>
            </div>
            :
            <GenericForm handleSubmit={handleSubmit}
                         initialData={representative}
                         fields={representativeFormFields}
                         handleCancel={handleBackStep}
                         cancelLabel={t('back')}
                         submitLabel={t('submit')}
            />;
    };

    const steps = [
        {
            name: Steps.COMPANY,
            label: t('companyStep'),
            completed: currentStep >= Steps.COMPANY,
            content: getCompanyStepContent()
        },
        {
            name: Steps.REPRESENTATIVE,
            label: t('userStep'),
            completed: currentStep >= Steps.REPRESENTATIVE,
            content: getRepresentativeStepContent()
        }
    ];

    //TODO create generic success feedback
    //TODO get plain password to show
    //TODO fare traduzione
    return (
        <dialog className={'modal w-full h-full' + (props.isOpen && ' modal-open')}>
            <div className="modal-box w-11/12 max-w-5xl">
                <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                            onClick={() => {
                                setCurrentStep(Steps.COMPANY);
                                setRepresentative(initialRepresentativeFormData);
                                setCompanyData(initialCompanyFormData);
                                props.toggleModal();
                            }}>
                        ✕
                    </button>
                </form>


                {
                    companyCreated ?
                        <div role="alert" className="flex flex-col alert bg-slate-50">
                            {/*<h1 className="text-xl font-light">{t('companyCreatedTitle')}</h1>*/}
                            <div className="flex flex-wrap -mx-4">
                                {companyFormFields.map(field => (
                                    <div key={field.name} className="w-full md:w-1/2 px-4 mb-4">
                                        <label className="block text-gray-700 font-semibold mb-1">
                                            {field.labelName}
                                        </label>
                                        <input
                                            type="text"
                                            value={companyCreated[field.name as keyof CreatedCompanyDto] || ''}
                                            readOnly
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-600 bg-gray-100 cursor-not-allowed"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className={'divider'}></div>
                            <button onClick={props.toggleModal} className="btn btn-outline mt-4 w-1/3">
                                {t('backToDashboard')}
                            </button>
                        </div>
                        :
                        <Fragment>
                            {/*<h1 className="text-xl font-light">{props.title}</h1>*/}
                            <div className="flex flex-1 justify-center my-2">
                                <ul className="steps flex-grow">
                                    {
                                        steps.map(step => (
                                            <li key={step.name}
                                                className={`step ${step.completed ? 'step-primary' : ''}`}>{step.label}</li>
                                        ))
                                    }
                                </ul>
                            </div>

                            {
                                currentStep !== Steps.COMPANY &&
                                <div role="alert" className="alert justify-start my-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                         className="h-12 w-12">
                                        <path fillRule="evenodd"
                                              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                                              clipRule="evenodd" />
                                    </svg>
                                    <div className="text-sm font-bold text-justify">{props.infoMessage}</div>
                                </div>
                            }


                            <div className="rounded-md border border-gray-300 p-4">
                                {steps[currentStep].content}
                            </div>
                        </Fragment>
                }
            </div>
        </dialog>
    );
}

export default CompanyModalRegistration;
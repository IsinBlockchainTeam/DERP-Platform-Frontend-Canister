import React, { Fragment, useState } from 'react';
import { CreateStoreDto, StoreDto } from '../../dto/stores/StoreDto';
import { useTranslation } from 'react-i18next';
import GenericForm, { GenericFormField, GenericFormData } from '../Form/GenericForm';
import LoadingSpinner from '../Loading/LoadingSpinner';
import { useNavigate, useParams } from 'react-router';
import { Wallet } from 'ethers';
import { storeService } from '../../api/services/Store';
import { log } from 'node:util';

interface ModalProps {
    isOpen: boolean;
    toggleModal: () => void;
}

const initialStoreFormData: GenericFormData = {
    name: '',
    address: '',
    additionalInfo: '',
    postalCodeAndLocation: '',
    canton: '',
    country: '',
    bcPrivateKey: '',
    bcAddress: ''
};

function StoreModalRegistration(props: ModalProps) {
    const [storeCreated, setStoreCreated] = useState<StoreDto | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { merchantId } = useParams<{ merchantId: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation(undefined, { keyPrefix: 'storeModalRegistration' });
    const storeFormField: GenericFormField[] = [
        {
            labelName: t('storeForm.businessName'),
            name: 'name',
            typeNode: { typeNodeName: 'input', type: 'text', placeholder: t('storeForm.placeholderBusinessName') },
            isRequired: true
        },
        {
            labelName: t('storeForm.additionalInfo'),
            name: 'additionalInfo',
            typeNode: { typeNodeName: 'input', type: 'text', placeholder: t('storeForm.placeholderAdditionalInfo') },
            isRequired: true
        },
        {
            labelName: t('storeForm.address'),
            name: 'address',
            typeNode: { typeNodeName: 'input', type: 'text', placeholder: t('storeForm.placeholderAddress')  },
            isRequired: true
        },
        {
            labelName: t('storeForm.postalCodeAndLocation'),
            name: 'postalCodeAndLocation',
            typeNode: { typeNodeName: 'input', type: 'text', placeholder: t('storeForm.placeholderPostalCodeAndLocation') },
            isRequired: true
        },
        {
            labelName: t('storeForm.canton'),
            name: 'canton',
            typeNode: { typeNodeName: 'input', type: 'text', placeholder: t('storeForm.placeholderCanton') , maxLength: 2 },
            isRequired: false
        },
        {
            labelName: t('storeForm.country'),
            name: 'country',
            typeNode: { typeNodeName: 'input', type: 'text', placeholder: t('storeForm.placeholderCountry') , maxLength: 3 },
            isRequired: false
        },
        {
            labelName: t('storeForm.privateKey'),
            name: 'bcPrivateKey',
            typeNode: { typeNodeName: 'input', type: 'text', placeholder: t('storeForm.placeholderPrivateKey') },
            isRequired: true
        },
    ];

    const handleSubmit = (formData: GenericFormData) => {
        setIsSubmitting(true);
        if (!merchantId) {
            console.error('Merchant ID is not available');
            setIsSubmitting(false);
            return;
        }

        const companyIdNum = parseInt(merchantId);
        const bcAddress = new Wallet(formData.bcPrivateKey).address;
        return storeService.createStore({ ...formData, bcAddress } as CreateStoreDto, companyIdNum).then((store: StoreDto) => {
            navigate(`/merchant/${merchantId}/stores`);
            setStoreCreated(store);
        })
            .catch(error => console.error(error))
            .finally(() => setIsSubmitting(false));
    }

    const handleCancel = () => {
        props.toggleModal();
        setStoreCreated(undefined);
    }


    return (
        <dialog className={'modal w-full h-full' + (props.isOpen && ' modal-open')}>
            <div className="modal-box w-11/12 max-w-5xl">
                <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                            onClick={handleCancel}>
                        ✕
                    </button>
                </form>


                {
                    storeCreated ?
                        <div role="alert" className="flex flex-col alert bg-slate-50">
                            <h1 className="text-3xl font-light">{t('storeCreatedTitle')}</h1>
                            <div className="flex flex-wrap -mx-4">
                                {
                                    storeFormField.map(field => {
                                        if (field.name !== 'bcPrivateKey') {
                                            return (
                                                <div key={field.name} className="w-full md:w-1/2 px-4 mb-4">
                                                    <label className="block text-gray-700 font-semibold mb-1">
                                                        {field.labelName}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={storeCreated[field.name as keyof StoreDto] || ''}
                                                        readOnly
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-600 bg-gray-100 cursor-not-allowed"
                                                    />
                                                </div>
                                            );
                                        }
                                    })
                                }
                            </div>
                            <div className={'divider'}></div>
                            <button onClick={handleCancel} className="btn btn-outline mt-4 w-1/3">
                                {t('backToDashboard')}
                            </button>
                        </div>
                        :
                        <Fragment>
                            <h1 className="text-3xl font-light pb-3">{t('storeCreationTitle')}</h1>
                            <div className="rounded-md border border-gray-300 p-4">
                                {
                                    isSubmitting ?
                                        <div className="flex flex-1 flex-row justify-center">
                                            <LoadingSpinner/>
                                        </div>
                                        :
                                        <GenericForm handleSubmit={handleSubmit}
                                                     initialData={initialStoreFormData}
                                                     fields={storeFormField}
                                                     handleCancel={handleCancel}
                                                     cancelLabel={t('cancel')}
                                                     submitLabel={t('submit')}
                                        />
                                }
                            </div>
                        </Fragment>
                }
            </div>
        </dialog>
    );
}

export default StoreModalRegistration;
import { CreateStoreDto } from '../../dto/stores/StoreDto';
import { useTranslation } from 'react-i18next';
import Card from '../Card/Card';
import { useEffect, useState } from 'react';

export type Props = {
    value: CreateStoreDto;
    onChange: (value: CreateStoreDto) => void;
    errorMessage?: string;
    onSubmit: () => void;
}

export function StoreCreationForm({
                                      value,
                                      onChange,
                                      errorMessage,
                                      onSubmit,
                                  }: Props) {
    const { t } = useTranslation(undefined, { keyPrefix: 'storeCreation' });
    const [disabledButton, setDisabledButton] = useState<boolean>(false);


    const _onChange = (value: CreateStoreDto) => {
        onChange(value);
    };

    const checkFillFields = () => {
        console.log(value);
        const fieldsToExclude= ['bcAddress'];

        for (const [key, val] of Object.entries(value)) {
            if (!fieldsToExclude.includes(key) && (val === '' || val === 0)) {
                setDisabledButton(true);
                return;
            }
        }

        setDisabledButton(false);
    };

    useEffect(() => {
        checkFillFields();
    }, [value]);

    return (
        <div className="page-content text-center flex flex-col justify-center items-center">
            <Card title={t('createNewStore')}>
                <form>
                    <div className={errorMessage ? 'alert alert-error shadow-lg' : 'hidden'}>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6"
                                 fill="none"
                                 viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{errorMessage}</span>
                        </div>
                    </div>

                    <label className="label">
                        <span className="label-text font-bold text-primary">{t('name')}:</span>
                    </label>
                    <input
                        type="text" id="name" placeholder={t('namePlaceholder')}
                        className="input input-bordered w-full max-w-xs"
                        value={value.name}
                        onChange={e => _onChange({ ...value, name: e.target.value })} />

                    <label className="label">
                        <span className="label-text font-bold text-primary">{t('additionalInfo')}:</span>
                    </label>
                    <input
                        type="text" id="name" placeholder={t('additionalInfoPlaceholder')}
                        className="input input-bordered w-full max-w-xs"
                        value={value.additionalInfo}
                        onChange={e => _onChange({ ...value, additionalInfo: e.target.value })} />

                    <label className="label">
                        <span className="label-text font-bold text-primary">{t('address')}:</span>
                    </label>
                    <input
                        type="text" id="address" placeholder={t('addressPlaceholder')}
                        className="input input-bordered w-full max-w-xs"
                        value={value.address}
                        onChange={e => _onChange({ ...value, address: e.target.value })} />

                    <label className="label">
                        <span className="label-text font-bold text-primary">{t('postalCodeAndLocation')}:</span>
                    </label>
                    <input
                        type="text" id="postalCodeAndLocation" placeholder={t('postalCodeAndLocationPlaceholder')}
                        className="input input-bordered w-full max-w-xs"
                        value={value.postalCodeAndLocation}
                        onChange={e => _onChange({ ...value, postalCodeAndLocation: e.target.value })} />

                    <label className="label">
                        <span className="label-text font-bold text-primary">{t('canton')}:</span>
                    </label>
                    <input
                        type="text" id="canton" placeholder={t('cantonPlaceholder')}
                        className="input input-bordered w-full max-w-xs"
                        value={value.canton}
                        onChange={e => _onChange({ ...value, canton: e.target.value.toUpperCase() })}
                        maxLength={2}
                    />

                    <label className="label">
                        <span className="label-text font-bold text-primary">{t('country')}:</span>
                    </label>
                    <input
                        type="text" id="country" placeholder={t('countryPlaceholder')}
                        className="input input-bordered w-full max-w-xs"
                        value={value.country}
                        onChange={e => _onChange({ ...value, country: e.target.value.toUpperCase() })}
                        maxLength={3}
                    />

                    <label className="label">
                        <span className="label-text font-bold text-primary">{t('privateKey')}:</span>
                    </label>
                    <input
                        type="password" id="bcPrivateKey" placeholder={t('privateKeyPlaceholder')}
                        className="input input-bordered w-full max-w-xs"
                        value={value.bcPrivateKey}
                        onChange={e => _onChange({ ...value, bcPrivateKey: e.target.value })} />

                    <button className="btn btn-primary mt-6" onClick={e => {
                        e.preventDefault();
                        onSubmit();
                    }}
                            disabled={disabledButton}
                    >{t('createBtn')}</button>
                </form>
            </Card>
        </div>
    );
}
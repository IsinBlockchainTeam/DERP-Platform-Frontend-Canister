import FormLoader from '../Loading/FormLoader';
import { StoreDto } from '../../dto/stores/StoreDto';
import React, { useRef, useState } from 'react';
import { storeService } from '../../api/services/Store';
import {useTranslation} from "react-i18next";
import { useStoreUrl } from '../../utils';

interface Props {
    store: StoreDto;
}

const LOGO_NAME_PLACEHOLDER = 'New logo file name...';

function LogoForm({ store }: Props) {
    const [loadingTabLogo, setLoadingTabLogo] = useState<boolean>(false);
    const [logoName, setLogoName] = useState<string>(LOGO_NAME_PLACEHOLDER);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const inputFileLogo = useRef<HTMLInputElement>(null);
    const {t} = useTranslation(undefined, {keyPrefix: 'supplierAppearance'});
    const storeUrl = useStoreUrl()

    const showErrorMessage = (message: string) => {
        setErrorMessage(message);
    }

    const clearErrorMessage = () => {
        setErrorMessage('');
    }

    const chooseLogo = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        if (inputFileLogo.current) inputFileLogo.current.click();
    }

    const onLogoChange = () => {
        if (inputFileLogo.current && inputFileLogo.current.files && inputFileLogo.current.files.length > 0)
            setLogoName(inputFileLogo.current.files[0].name);
    }

    const onSubmitLogo = async (event: React.FormEvent<HTMLFormElement>) => {
        setLoadingTabLogo(true);
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        storeService.uploadImage(storeUrl, formData)
            .then((res) => {
                store.imageUrl = res.imageUrl;

                if (inputFileLogo.current) {
                    inputFileLogo.current.value = '';
                    setLogoName(LOGO_NAME_PLACEHOLDER);
                }

                clearErrorMessage();
            })
            .catch(errorMessage => {
                console.log(errorMessage.message);
                showErrorMessage('Error during image upload');
            }).finally(() => setLoadingTabLogo(false));
    }

    return (
        <div className="text-center flex flex-col justify-center items-center mb-10">
            <span className="text-xl mb-4 font-bold">{t('logo')}</span>
            <form action="/stores/image" method="POST" onSubmit={onSubmitLogo}>
                <div>
                    <div className={errorMessage ? 'alert alert-error shadow-lg mb-4' : 'hidden'}>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>{errorMessage}</span>
                        </div>
                    </div>
                    <div className="avatar">
                        <div className="w-48 h-48 rounded bg-no-repeat bg-contain bg-center" style={{ backgroundImage: `url(/stores/image?imageUrl=${store.imageUrl})` }} ></div>
                    </div>
                    <label className="label">
                        <span className="label-text font-bold text-primary">{t('chooseLogo')} (max 2mb):</span>
                    </label>
                    <div className="border rounded-lg p-2">
                        <button className="btn btn-primary" onClick={chooseLogo}>{t('chooseBtn')}</button>
                        <span className={inputFileLogo.current && inputFileLogo.current.files && inputFileLogo.current.files.length > 0 ?
                            'pl-2'
                            :
                            'pl-2 text-gray-400'}> {logoName} </span>
                    </div>
                    <input ref={inputFileLogo}
                        type="file"
                        id="image"
                        name="logo"
                        className="hidden"
                        accept="image/png,image/jpeg"
                        onChange={onLogoChange}
                    />
                </div>

                <button type="submit"
                    disabled={!(inputFileLogo.current && inputFileLogo.current.files && inputFileLogo.current.files.length > 0)}
                    className="btn btn-primary mt-6">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <span className="pl-2">{t('updateBtn')}</span>
                </button>

                {loadingTabLogo && <FormLoader />}
            </form>
        </div>

    );
}

export default LogoForm;

import { StoreDto } from '../../dto/stores/StoreDto';
import React, { useEffect, useState } from 'react';
import { ChromePicker } from 'react-color';
import { storeService } from '../../api/services/Store';
import FormLoader from '../Loading/FormLoader';
import { DEFAULT_STORE_COLOR } from '../../constants';
import "./ColorForm.css"
import {useTranslation} from "react-i18next";
import { useStoreUrl } from '../../utils';

interface Props {
    store: StoreDto;
}

function ColorForm({ store }: Props) {
    const [loadingColorTab, setLoadingColorTab] = useState<boolean>(false);
    const [color, setColor] = useState<string>(DEFAULT_STORE_COLOR);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const {t} = useTranslation(undefined, {keyPrefix: 'supplierAppearance'});
    const storeUrl = useStoreUrl();

    const showErrorMessage = (message: string) => {
        setErrorMessage(message);
    }

    const onChangeColor = (color: any) => {
        setColor(color.hex);
    }

    const updateColor = () => {
        setLoadingColorTab(true);
        storeService.updateStoreColor(storeUrl, color)
            .then(() => { store.color = color; })
            .catch(error => { showErrorMessage(error.response.data.message); })
            .finally(() => setLoadingColorTab(false));
    }

    useEffect(() => {
        if (store.color)
            setColor(store.color);
    }, []);

    return (
        <div className="text-center flex flex-col justify-center items-center mb-10">
            {
                !loadingColorTab ?
                    <>
                        <span className="text-xl mb-4 font-bold">{t('color')}</span>
                        <div className={errorMessage ? 'alert alert-error' : 'hidden'}>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>{errorMessage}</span>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            {/* @ts-expect-error since the parameters type are incorrectly mapped */}
                            <ChromePicker color={color} onChange={onChangeColor} disableAlpha={true} width={200} className="shadow-none" />
                        </div>
                        <button className="btn btn-primary mt-6" onClick={updateColor}>{t('updateBtn')}</button>
                    </>
                    :
                    <FormLoader />
            }
        </div>
    );
}

export default ColorForm;

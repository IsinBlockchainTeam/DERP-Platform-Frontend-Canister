import { StoreDto } from '../../dto/stores/StoreDto';
import React, { useEffect, useState } from 'react';
import { storeService } from '../../api/services/Store';
import FormLoader from '../Loading/FormLoader';
import FontCheckbox from '../FontCheckBox/FontCheckbox';
import { DEFAULT_FONT } from '../../constants';
import {useTranslation} from "react-i18next";
import { useStoreUrl } from '../../utils';

interface Props {
    store: StoreDto;
}

function FontForm({ store }: Props) {
    const [loadingFontTab, setLoadingFontTab] = useState<boolean>(false);
    const [font, setFont] = useState<string>(store.font ? store.font : DEFAULT_FONT);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [fonts, setFonts] = useState<string[]>([]);
    const {t} = useTranslation(undefined, {keyPrefix: 'supplierAppearance'});
    const storeUrl = useStoreUrl();

    const showErrorMessage = (message: string) => {
        setErrorMessage(message);
    }

    const updateFont = () => {
        setLoadingFontTab(true);
        storeService.updateStoreFont(storeUrl, font)
            .then(() => { store.font = font; })
            .catch(error => { showErrorMessage(error.response.data.message); })
            .finally(() => setLoadingFontTab(false));
    }

    const getFonts = () => {
        storeService.getFontNames().then(fonts => {
            fonts.push(DEFAULT_FONT);
            setFonts(fonts);
            setLoadingFontTab(false);
        });
    }

    const onSelect = (selected: string) => {
        setFont(selected);
    }

    useEffect(() => {
        setLoadingFontTab(true);
        getFonts();
    }, []);

    return (
        <div className="text-center flex flex-col justify-center items-center mb-10">
            {
                !loadingFontTab ?
                    <>
                        <span className="text-xl mb-8 font-bold">{t('font')}</span>
                        <div className={errorMessage ? 'alert alert-error shadow-lg' : 'hidden'}>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>{errorMessage}</span>
                            </div>
                        </div>
                        <div className="flex flex-col border border-primary rounded-md py-6">
                            {
                                fonts.map((fontName, index) => (
                                    <div key={index}>
                                        <FontCheckbox fontName={fontName} checked={fontName === font} onSelect={onSelect} />
                                        {
                                            index !== (fonts.length - 1) &&
                                            <div className="divider px-4"></div>
                                        }
                                    </div>
                                ))
                            }
                        </div>
                        <button className="btn btn-primary mt-8" onClick={updateFont}>{t('updateBtn')}</button>
                    </>
                    :
                    <FormLoader />
            }
        </div>
    );
}

export default FontForm;

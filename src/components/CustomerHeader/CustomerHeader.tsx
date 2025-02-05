import React, {useEffect, useState} from 'react';
import Header from '../Header/Header';
import {storeService} from '../../api/services/Store';
import {auth} from '../../api/auth';
import {determineTextColor} from '../../utils';
import {STORE_COLOR, STORE_FONT, STORE_NAME} from '../../constants';

function CustomerHeader() {
    const [storeName, setStoreName] = useState('');
    const [storeFont, setStoreFont] = useState('');
    const [storeColor, setStoreColor] = useState('');
    const [textColor, setTextColor] = useState('black');

    const getStoreEssentialInfo = async () => {
        const essentialInfo = await storeService.getStoreEssentialInfo();

        if(essentialInfo.color)
            sessionStorage.setItem(STORE_COLOR, essentialInfo.color);

        if(essentialInfo.name)
            sessionStorage.setItem(STORE_NAME, essentialInfo.name);

        if(essentialInfo.font)
            sessionStorage.setItem(STORE_FONT, essentialInfo.font);

        setStoreColor(essentialInfo.color);
        setStoreName(essentialInfo.name);
        setStoreFont(essentialInfo.font);
    }

    useEffect(() => {
        if (storeColor){
            const textColor = determineTextColor(storeColor);
            setTextColor(textColor);
        }
    }, [storeColor]);

    useEffect(() => {
        const storeColor = sessionStorage.getItem(STORE_COLOR);
        const storeName = sessionStorage.getItem(STORE_NAME);
        const storeFont = sessionStorage.getItem(STORE_FONT);

        if(storeColor)
            setStoreColor(storeColor);

        if (storeName)
            setStoreName(storeName);

        if (storeFont)
            setStoreFont(storeFont);

        if(!storeColor || !storeName || !storeFont)
            auth.onceCustomerLogged(() => { getStoreEssentialInfo(); });
    }, []);

    return (
        <>
            {
                storeName &&
                    <Header color={storeColor} storeName={storeName} textColor={textColor} font={storeFont} homeUrl="/table"></Header>
            }
        </>
    );
}

export default CustomerHeader;

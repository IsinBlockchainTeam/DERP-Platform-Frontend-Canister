import {useEffect} from 'react';
import {useTranslation} from "react-i18next";

function Redirect() {
    const {t} = useTranslation(undefined, {keyPrefix: 'redirect'});

    useEffect(() => {
        setTimeout(() => {
            window.location.replace('dlterp://paymentSuccess');
        }, 3000);
    }, []);

    return <main style={{textAlign: "center"}}>{t('willRedirectIn')}</main>;
}


export default Redirect;
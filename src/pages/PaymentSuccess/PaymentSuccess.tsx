import React from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {CUSTOMER_TOKEN_KEY, DATATRANS_TRX_ID, TRANSACTION_ID} from '../../constants';
import {auth} from "../../api/auth";
import {useTranslation} from "react-i18next";

function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const {t} = useTranslation(undefined, {keyPrefix: 'paymentSuccess'});

    React.useEffect(() => {
        const transactionId = `${searchParams.get(DATATRANS_TRX_ID)}`;
        localStorage.setItem(TRANSACTION_ID, transactionId);
        auth.generateCustomerToken({transactionId}).then(token => {
            console.log("PaymentSuccess", token);
            localStorage.setItem(CUSTOMER_TOKEN_KEY, token);
        });
    }, []);

    return (
        <main>
            <div className="mx-4 2xl:mx-28 xl:mx-28 lg:mx-28 my-16 text-center">
                <p className="font-bold text-green-500">{t('title')}</p>
                <p>{t('message')}</p>
                <button className="btn btn-primary mt-10" onClick={()=>navigate('/report')}>{t('orStayInBrowser')}</button>
            </div>
        </main>
    );
}

export default PaymentSuccess;
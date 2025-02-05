import React, {useState} from 'react';
import {auth} from '../../api/auth';
import {ordersService} from '../../api/services/Orders';
// @ts-expect-error since no types are provided
import Lightbox from 'react-datatrans-light-box';
import {createSearchParams, useNavigate, useSearchParams} from 'react-router-dom';
import Progress from '../../components/Loading/Progress';
import DocumentViewer from '../../components/DocumentViewer/DocumentViewer';
import CustomerHeader from '../../components/CustomerHeader/CustomerHeader';
import {TOKEN_KEY} from '../../constants';
import {CardInfoDto} from '../../dto/CardInfoDto';
import FormLoader from '../../components/Loading/FormLoader';
import {useTranslation} from "react-i18next";

function TemporaryInvoice(){
    const [orderId, setOrderId] = useState('');
    const [invoiceUrl, setInvoiceUrl] = useState<string>('');
    const [pageLoading, setPageLoading] = useState(true);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [payment, setPayment] = useState(false);
    const [cardsInfo, setCardsInfo] = useState(false);
    const [loadDocumentError, setLoadDocumentError] = useState(false);
    const [transactionId, setTransactionId] = useState('');
    const [savePaymentInfo, setSavePaymentInfo] = useState<boolean>(false);
    const [aliases, setAliases] = useState<CardInfoDto[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [params, _] = useSearchParams();
    const {t} = useTranslation(undefined, {keyPrefix: 'temporaryInvoice'});

    const navigate = useNavigate();

    const onLoadError = (error: any) => {
        setPageLoading(false);
        setLoadDocumentError(true);
    }

    const onLoadSuccess = () => {
        setPageLoading(false);
    }

    const onPaymentCancelled = async () => {
        await ordersService.signalPaymentCanceled(transactionId);
        setPayment(false);
    }

    const onPaymentError = async () => {
        await ordersService.signalPaymentFailure(transactionId);
        setPayment(false);
    }

    const showErrorMessage = (message: string) => {
        setErrorMessage(message);
    }

    const clearErrorMessage = () => {
        setErrorMessage('');
    }

    const getAliases = async () => {
        const aliases = await ordersService.getAliases();
        if (aliases.length !== 0){
            showAliasesModal();
            setAliases(aliases);
            setCardsInfo(true);
        } else
            payOrder();
    }

    const payOrder = async (alias?: CardInfoDto) => {
        try {
            hideModal();
            setPaymentLoading(true);
            const transactionId = await ordersService.initPaymentTransaction(orderId, savePaymentInfo, alias);
            setTransactionId(transactionId);
            setPayment(true);
            setPaymentLoading(false);
        }catch (e: any) {
            showErrorMessage(e.response.data.message);
            showErrorModal();
        }
    }

    const getLastOpenOrderId = async () => {
        ordersService.getLastOpenOrderId()
            .then(id => {
                if (id){
                    setOrderId(id);
                } else
                    setPageLoading(false);
            })
            .catch(e => setPageLoading(false));
    }

    const hideModal = () => {
        window.location.hash = '';
    }

    const hideErrorModal = () => {
        hideModal();
        clearErrorMessage();
        setPaymentLoading(false);
    }

    const showAliasesModal = () => {
        window.location.hash = 'aliases-modal';
    }
    const showErrorModal = () => {
        window.location.hash = 'error-modal';
    }

    const onSelectedAlias = async (alias: CardInfoDto) => {
        hideModal();
        payOrder(alias);
    }

    React.useEffect(() => {
        const token = params.get(TOKEN_KEY);
        if(token){
            auth.customerLogin(token);
        }

        if(!auth.isCustomerLogged()) {
            navigate('/login');
        }

        setInvoiceUrl(`${window.location.origin}/api/orders/last/not-payed-invoice?token=${auth.getCustomerToken()}`);
        getLastOpenOrderId();
    }, []);

    return(
        <main className="flex flex-col flex-1">
            <CustomerHeader/>

            {
                (invoiceUrl && orderId) &&
                    <div className={pageLoading || loadDocumentError ? "h-0 invisible" : "w-screen overflow-hidden flex flex-col grow"}>
                        <div className="grow overflow-y-scroll">
                            <DocumentViewer temporary={true} invoiceUrl={invoiceUrl} onLoadError={onLoadError} onLoadSuccess={onLoadSuccess}/>
                        </div>
                        <div className="flex-shrink justify-self-end border-t border-gray-300">
                            <div className="h-4 mt-3 w-screen flex items-center justify-center form-control">
                                <label className="label cursor-pointer">
                                    <input type="checkbox" checked={savePaymentInfo} className="checkbox" onChange={(event) => {setSavePaymentInfo(event.target.checked);}}/>
                                    <span className="label-text ml-3">{t('rememberPaymentCredentials')}</span>
                                </label>
                            </div>
                            <div className="h-16 mt-3 w-screen flex items-center justify-center">
                                <label className="btn btn-primary"  onClick={getAliases}>{t('payBtn')}</label>
                            </div>
                        </div>
                    </div>
            }

            {
                !pageLoading && !orderId &&
                    <>
                        <div className="mt-72">
                            <p className="font-bold text-accent text-center">{t('noOrder')}</p>
                        </div>
                        {/*<div className="flex row justify-center p-8">*/}
                        {/*    <button className='btn btn-primary mt-4' onClick={() => navigate('/offers')}>{t('placeOrderBtn')}</button>*/}
                        {/*</div>*/}
                    </>
            }

            {
                pageLoading &&
                    <div className="mt-72">
                        <p className="font-bold text-accent text-center">{t('loadingInvoice')}</p>
                        <Progress />
                    </div>
            }

            {
                loadDocumentError &&
                    <div className="mt-72">
                        <p className="font-bold text-accent text-center">{t('loadingError')}</p>
                    </div>
            }

            <div>
                {
                    paymentLoading ?
                        <FormLoader/>
                        :
                        <>
                            {
                                payment &&
                                <Lightbox
                                    transactionId={transactionId}
                                    onCancelled={onPaymentCancelled}
                                    onError={onPaymentError}
                                    production={process.env.REACT_APP_ENV === 'prod'}
                                />
                            }
                        </>
                }
            </div>

            <div id="aliases-modal" className="modal">
                <div className="modal-box w-11/12 max-w-5xl">
                    <label className="btn btn-accent btn-sm btn-circle absolute right-2 top-2" onClick={hideModal}>✕</label>
                    {
                        cardsInfo &&
                        <div className="py-6">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr className="text-center">
                                    <th scope="col" className="px-6 py-3">
                                        {t('cardNumber')}
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        {t('expiryDate')}
                                    </th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    aliases.map((alias, index) => (
                                        <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 text-center">
                                            <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                <small>{alias.masked}</small>
                                            </td>
                                            <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {alias.expiryMonth}/{alias.expiryYear}
                                            </td>
                                            <td>
                                                <button className="btn btn-primary" onClick={() => onSelectedAlias(alias)}>{t('useCardBtn')}</button>
                                            </td>
                                        </tr>
                                    ))
                                }
                                </tbody>
                            </table>

                            <button className="btn btn-primary mt-4 float-right" onClick={() => payOrder()}>{t('useAnotherCardBtn')}</button>
                        </div>
                    }
                </div>
            </div>

            <div id="error-modal" className="modal">
                <div className="modal-box w-11/12 max-w-5xl">
                    <label className="btn btn-accent btn-sm btn-circle absolute right-2 top-2" onClick={hideErrorModal}>✕</label>
                    <div className="alert alert-error shadow-lg my-6">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>{errorMessage}</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default TemporaryInvoice;

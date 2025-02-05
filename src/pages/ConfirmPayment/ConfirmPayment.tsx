import React, {useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import CustomerHeader from '../../components/CustomerHeader/CustomerHeader';
import {DATATRANS_TRX_ID, TRANSACTION_ID} from '../../constants';
import {useTranslation} from "react-i18next";
import {ordersService} from "../../api/services/Orders";
import PFC from '../../images/paymentMethods/PFC.jpg';
import CRYPTO from '../../images/paymentMethods/CRYPTO.jpg';
import TWI from '../../images/paymentMethods/TWI.jpg';
import VIS from '../../images/paymentMethods/VIS.jpg';
import ECA from '../../images/paymentMethods/ECA.jpg';
import PAP from '../../images/paymentMethods/PAP.jpg';
import {ERPItemDto} from "../../dto/ERPItemDto";
import {OrderPaymentDto} from "../../dto/OrderPaymentDto";
import {auth} from "../../api/auth";


function ConfirmPayment() {
    const [orderDetails, setOrderDetails] = useState<ERPItemDto[]>();
    const [currentPayment, setCurrentPayment] = useState<OrderPaymentDto>();
    const [loading, setLoading] = useState<boolean>(false)
    const [invoiceUrl, setInvoiceUrl] = useState<string>('');
    const [failed, setFailed] = useState<boolean>(false);
    const [searchParams] = useSearchParams();
    const {t} = useTranslation(undefined, {keyPrefix: 'confirmPayment'});

    const fetchPaymentInfo = async (transactionId: string) => {
        const orderId = await ordersService.getLastOpenOrderId();
        const currentPayment = (await ordersService.getOrderPayments(orderId)).find(p => p.trxId === transactionId);
        if (currentPayment) {
            if (currentPayment.paidItems && currentPayment.paidItems.length) {
                const paidItems = await ordersService.getOrderLinesInfo(currentPayment.paidItems);
                setOrderDetails(paidItems);
            }
            setCurrentPayment(currentPayment);
        } else {
            console.log('No payment found');
        }
    }

    const init = async () => {
        try {
            setLoading(true);
            const transactionId = `${searchParams.get(DATATRANS_TRX_ID)}`;
            localStorage.setItem(TRANSACTION_ID, transactionId);
            setInvoiceUrl(`${window.location.origin}/api/orders/last/payed-invoice?trxId=${transactionId}`);

            const customerToken = await auth.generateCustomerToken({transactionId});
            auth.customerLogin(customerToken);
            await fetchPaymentInfo(transactionId);
            setLoading(false);
        }catch (e) {
            console.log(e);
            setFailed(true);
        }finally {
            setLoading(false);
        }
    }

    const renderPaymentImg = () => {
        let img;
        switch (currentPayment?.paymentType) {
            case 'PFC':
                img = PFC;
                break;
            case 'CRYPTO':
                img = CRYPTO;
                break;
            case 'TWI':
                img = TWI;
                break;
            case 'VIS':
                img = VIS;
                break;
            case 'ECA':
                img = ECA;
                break;
            case 'PAP':
                img = PAP;
                break;
        }

        return (
            <img style={{ objectFit: 'contain', width: '100%', height: '100%' }} src={img} />
        )
    }

    React.useEffect(() => {
      init();
    }, [])

    return (
        <main className={"flex flex-col flex-1"}>
            <CustomerHeader/>

            {
                (!loading && !failed) &&
                <div className="w-screen overflow-hidden flex flex-col grow">
                    <div className="grow overflow-y-scroll">
                        <div className="mx-4 lg:mx-28 xl:mx:28 2xl:mx-28 my-8 space-y-4">
                            {
                                (orderDetails && orderDetails.length) &&
                                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                        <thead
                                            className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-center">
                                                {t('row.id')}
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-center">
                                                {t('row.description')}
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-center">
                                                {t('row.quantity')}
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {orderDetails?.map((ol) => (
                                            <tr
                                                key={ol.id}
                                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                            >
                                                <td className="px-6 py-4 text-center">{ol.id}</td>
                                                <td
                                                    scope="row"
                                                    className="px-6 py-4 text-center"
                                                >
                                                    {ol.description}
                                                </td>
                                                <td className="px-6 py-4 text-center">{ol.quantity}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            }

                            <div className="border shadow-md rounded-md p-4 max-w-sm w-full mx-auto">
                                <p className="font-bold">{t('paymentInfo')}</p>
                                <div className="divider mt-0 h-0" />
                                <div className="animate-pulse flex space-x-4 overflow-x-auto">
                                    <div className="avatar w-20 rounded">
                                        {renderPaymentImg()}
                                    </div>
                                    <div className="flex-1 space-y-2 py-1">
                                        <p className="font-bold text-sm m-0">{t('info.transactionId')}: <p className="inline font-normal text-sm">{currentPayment?.trxId}</p></p>
                                        <p className="font-bold text-sm m-0">{t('info.type')}: <p className="inline font-normal text-sm">{currentPayment?.paymentType}</p></p>
                                        <p className="font-bold text-sm m-0">{t('info.amount')}: <p className="inline font-normal text-sm">CHF. {currentPayment?.paymentAmount.toFixed(2)}</p></p>
                                    </div>
                                </div>
                                <div className="divider"></div>
                            </div>
                        </div>
                    </div>
                    <div className="h-18 p-3 flex items-center justify-center shrink border-t border-gray-300">
                        <a download href={invoiceUrl}>
                            <label className="btn btn-primary">{t('downloadBtn')}</label>
                        </a>
                    </div>
                </div>
            }

            {
                (loading && !failed) &&
                <p className="font-bold text-primary mt-9 text-center">{t('loadingCaption')}</p>
            }

            {
                (failed && !loading) &&
                <div className="flex-grow flex items-center justify-center">
                    <p className="font-bold text-accent text-center p-4">{t('loadingError')}</p>
                </div>
            }
        </main>
    );
}


export default ConfirmPayment;

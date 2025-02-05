import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {ordersService} from '../../api/services/Orders';
import Header from '../../components/Header/Header';
import {OrderLine} from '../../dto/NewOrderDto';
import './Offers.css';
import {offersService} from '../../api/services/Offers';
import Progress from '../../components/Loading/Progress';
import { OfferDto } from '../../dto/OfferDto';
import RowOffer from '../../components/RowOffer/RowOffer';
import CustomerHeader from '../../components/CustomerHeader/CustomerHeader';
import {useTranslation} from "react-i18next";

const quantities = new Map<number, Map<number, { quantity: number, checked: boolean }>>();

function Offers() {
    const [offers, setOffers] = useState<OfferDto[]>([]);
    const [isLoadingOffers, setIsLoadingOffers] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [hasOpenOrder, setHasOpenOrder] = useState(false);
    const navigate = useNavigate();
    const {t} = useTranslation(undefined, {keyPrefix: 'offers'});

    const getOffers = () => {
        setIsLoadingOffers(true);
        offersService.getOffers().then((offerList: OfferDto[]) => {
            setOffers(offerList);
            quantities.clear();
            offerList.forEach(offer => {
                quantities.set(+offer.id, new Map<number, { quantity: number, checked: boolean }>());
                offer.offerLines.forEach(line => {
                    const offerLineQuantities = quantities.get(+offer.id)!;
                    offerLineQuantities.set(+line.id, { quantity: 1, checked: false})
                })
            });
            setIsLoadingOffers(false);
        });
    }

    const sendOrder = async () =>  {
        setIsLoadingOffers(true);
        const orderLines: OrderLine[] = [];
        quantities.forEach((offerQuantity, offerKey) => {
            offerQuantity.forEach((lineQuantity, lineKey) => {
                if (lineQuantity.checked) {
                    for(let i = 0; i < lineQuantity.quantity; i++) {
                        orderLines.push({
                            offerId: '' + offerKey,
                            offerLineId: '' + lineKey
                        });
                    }
                }
            });
        });

        if(orderLines.length === 0) {
            setErrorMessage(t('noEmptyOrderCreation'));
            setIsLoadingOffers(false);
            return;
        }

        ordersService.createOrder({orderLines}).then(() => {
            navigateToTable();
        }).catch(error => {
            console.log('Error during order creation', error)
            setIsLoadingOffers(false);
        });
    }

    const onChangedQuantity = (offerId: number, offerLineId: number, value: number) => {
        if (value && value > 0){
            const offerQuantities = quantities.get(offerId)!;
            const offerLineQuantities = offerQuantities.get(offerLineId)!;
            offerQuantities.set(offerLineId, {
                quantity: value,
                checked: offerLineQuantities.checked
            })
        }
    }

    const onChangedStatus = (offerId: number, offerLineId: number, newStatus: boolean) => {
        const offerQuantities = quantities.get(offerId)!;
        const offerLineQuantities = offerQuantities.get(offerLineId)!;
        offerQuantities.set(offerLineId, {
            quantity: offerLineQuantities.quantity,
            checked: newStatus
        })
    }

    const navigateToTable = () => {
        navigate(`/table`);
    }

    React.useEffect(() => {
        ordersService.getLastOpenOrderId()
            .then(id => {
                if(id) {
                    setIsLoadingOffers(false);
                    setHasOpenOrder(true);
                } else {
                    getOffers();
                }
            })
            .catch(getOffers)
    }, [])

    return (
        <main>
            <CustomerHeader/>

            <div className="mx-4 lg:mx-28 xl:mx:28 2xl:mx-28 my-8">
                {
                    isLoadingOffers &&
                        <Progress marginYClassName="my-72"/>
                }

                {
                    !isLoadingOffers && !hasOpenOrder &&
                        <div className="overflow-x-auto w-full">
                            {
                                offers.map((offer, index) =>
                                    <div key={'offer-' + offer.id} className='mb-4'>
                                        <RowOffer
                                            offer={offer}
                                            onChangedQuantity={(offerLineId, quantity) => onChangedQuantity(+offer.id, +offerLineId, quantity)}
                                            onChangedStatus={(offerLineId, status) => onChangedStatus(+offer.id, +offerLineId, status)}
                                        />
                                    </div>
                                    )
                            }
                            <br/>
                            <div className='flex flex-col items-center'>
                                <div className={errorMessage ? 'alert alert-error shadow-lg w-fit' : 'hidden'}>
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <span>{errorMessage}</span>
                                    </div>
                                </div>
                                <button className="btn btn-primary my-4" onClick={sendOrder}>{t('orderBtn')}</button>
                            </div>
                        </div>
                }

                {
                    hasOpenOrder &&
                        <div className='flex flex-col items-center'>
                            <div className="mt-72">
                                <p className="font-bold text-accent text-center">{t('tableAlreadyOccupied')}</p>
                            </div>
                            <button className="btn btn-primary my-4" onClick={navigateToTable}>{t('viewOpenOrderBtn')}</button>
                        </div>
                }
            </div>
        </main>
    );
}

export default Offers;
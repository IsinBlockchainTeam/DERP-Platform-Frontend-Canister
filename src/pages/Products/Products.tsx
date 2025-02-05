import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {ordersService} from '../../api/services/Orders';
import Header from '../../components/Header/Header';
import {OrderLine} from '../../dto/NewOrderDto';
import './Products.css';
import {offersService} from '../../api/services/Offers';
import Progress from '../../components/Loading/Progress';
import { OfferDto } from '../../dto/OfferDto';
import RowOffer from '../../components/RowOffer/RowOffer';

const quantities = new Map<number, Map<number, { quantity: number, checked: boolean }>>();

function Products() {
    const [offers, setOffers] = useState<OfferDto[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const getOffers = () => {
        setLoading(true);
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
            setLoading(false);
        });
    }

    // TODO l'offerta andrá scelta dall'utente prima dell'ordine
    const sendOrder = async () =>  {
        setLoading(true);
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

        ordersService.createOrder({orderLines}).then(() => {
            navigate(`/table`);
        }).catch(error => {
            console.log('Error during order creation', error);
            setLoading(false);
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

    React.useEffect(() => {
        getOffers();
    }, [])

    return (
        <main>
            <Header/>

            <div className="mx-4 lg:mx-28 xl:mx:28 2xl:mx-28 my-8">
                {
                    loading ?
                        <Progress marginYClassName="my-72"/>
                        :
                        <div className="overflow-x-auto w-full ">
                            {
                                offers.map(offer => 
                                    <div className='mb-4'>
                                        <RowOffer
                                            key={'offer-' + offer.id}
                                            offer={offer}
                                            onChangedQuantity={(offerLineId, quantity) => onChangedQuantity(+offer.id, +offerLineId, quantity)}
                                            onChangedStatus={(offerLineId, status) => onChangedStatus(+offer.id, +offerLineId, status)}
                                        />
                                    </div>
                                    )
                            }
                            <br/>
                            <div className='col flex justify-center'>
                                <button className="btn btn-primary relative bottom-0 right-0 mb-4" onClick={sendOrder}>Order</button>
                            </div>
                        </div>

                }
            </div>
        </main>
    );
}

export default Products;
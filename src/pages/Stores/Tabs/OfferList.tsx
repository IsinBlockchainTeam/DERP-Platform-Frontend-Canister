import { Fragment, useEffect, useState } from 'react';
import { OfferDto } from '../../../dto/OfferDto';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import GenericTable, { GenericTableColumn } from '../../../components/Table/GenericTable';
import { storeService } from '../../../api/services/Store';
import { offersService } from '../../../api/services/Offers';
import LoadingSpinner from '../../../components/Loading/LoadingSpinner';
import TabTitle from '../../../components/Tabs/TabTitle';

export default function OfferList() {
    const [loading, setLoading] = useState<boolean>(false);
    const [offers, setOffers] = useState<OfferDto[]>([]);
    const [storeUrl, setStoreUrl] = useState<string>('');
    const { merchantId } = useParams<{merchantId: string}>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { t } = useTranslation(undefined, { keyPrefix: "merchantOffers" });

    const tableColumns: GenericTableColumn<OfferDto>[] = [
        {
            header: "ID",
            accessor: "id",
        },
        {
            header: t("description"),
            accessor: "description",
        }
    ];

    const actions = [{
        label: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
        ), onClick: (offer: OfferDto) => {
            navigate(`/merchant/${merchantId}/stores/store/offers/${offer.id}?storeUrl=${encodeURIComponent(storeUrl)}`, {
                state: {
                    offerLines: offer.offerLines,
                }
            });
        }
    }]

    const init = async () => {
        setLoading(true);
        const stores = await storeService.list(merchantId);
        const store = stores.find(s => s.url === searchParams.get("storeUrl"));
        if (!store) {
            setLoading(false);
            return;
        }
        setStoreUrl(store.url);
        const offers = await offersService.getOffers(store.url);
        setOffers(offers);
        setLoading(false);
    }

    useEffect(() => {
        init().then();
    }, []);

    return (
        <div className="flex flex-col w-full">
            {
                loading ? (
                    <div className="flex flex-row grow items-center justify-center">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <Fragment>
                        <TabTitle
                            title={t("title")}
                        />
                        <div className="flex w-full flex-col" style={{ padding: '20px' }}>
                            <GenericTable data={offers} columns={tableColumns} actions={actions}/>
                        </div>
                    </Fragment>
                )
            }
        </div>
    );
}
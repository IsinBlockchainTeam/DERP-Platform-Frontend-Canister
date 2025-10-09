import { Fragment, useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { StoreDto } from '../../dto/stores/StoreDto';
import { storeService } from '../../api/services/Store';
import { parseSearchParamSafe, useStoreId } from '../../utils';
import { useTranslation } from "react-i18next";
import StoreIndicatorLine from '../../components/StoreIndicator/StoreIndicator';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';
import { Modal } from '../../components/Modal/Modal';
import StoreData from '../../components/StoreData/StoreData';
import AssociatedPosFeatureGuard from '../../components/HOC/AssociatedPosFeatureGuard';
import InvoiceAccessCard from '../../components/Invoices/InvoiceAccessCard';
import FeatureDetailPage from './FeatureDetailPage';
import StoreHeader from './StoreHeader';
import MenuAccessCard from '../../components/Card/MenuAccessCard';

export default function StoreManagementPage() {
    const [store, setStore] = useState<StoreDto>();
    const [storeInfoModal, setStoreInfoModal] = useState<boolean>(false);
    const id = useStoreId();
    const { t } = useTranslation(undefined, { keyPrefix: 'storeDetails' });
    const { merchantId } = useParams<{ merchantId: string }>();

    useEffect(() => {
        storeService.list(merchantId).then((stores) => {
            const store = stores.find(s => s.id === id);
            if (store)
                setStore(store);
        })
    }, [id])


    if (merchantId === undefined) {
        throw new Error('Merchant ID is required');
    }

    const merchantIdNumber = parseInt(merchantId);

    return (
            <div className="mx-5 pb-5">
                {/* Store indicator line */}
                {store ?
                    <>
                        <StoreHeader store={store}/>
                        <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-10'}>
                            <MenuAccessCard destinationUrl={`/merchant/${merchantIdNumber}/stores/store/invoices?storeId=${store.id}`}
                                            title={"Fatture"}
                                            text={"Gestione delle fatture di vendita"}
                                            buttonText={"Vai alle fatture"}
                                            logoUrl={"/invoice-logo.png"} />
                            <MenuAccessCard destinationUrl={`/merchant/${merchantIdNumber}/stores/store/supplier-invoices?storeId=${store.id}`}
                                            title={"Fatture dei Fornitori"}
                                            text={"Accedi alle fatture ricevute dai fornitori, monitora i pagamenti e gestisci la documentazione."}
                                            buttonText={"Vai alle fatture"}
                                            logoUrl={"/supplier-invoice.png"} />
                            <MenuAccessCard destinationUrl={`/merchant/${merchantIdNumber}/stores/store/suppliers?storeId=${store.id}`}
                                            title={"Gestione fornitori"}
                                            text={"Gestisci l'anagrafica dei tuoi fornitori e genera token di accesso per l'invio automatico delle fatture."}
                                            buttonText={"Vai ai fornitori"}
                                            logoUrl={"/supplier.png"} />
                            <MenuAccessCard destinationUrl={`/merchant/${merchantIdNumber}/stores/store/customers?storeId=${store.id}`}
                                            title={"Anagrafica Clienti"}
                                            text={"Consulta e aggiorna i dati dei tuoi clienti e le condizioni commerciali."}
                                            buttonText={"Vai ai clienti"}
                                            logoUrl={"/customer.png"} />
                            <MenuAccessCard destinationUrl={`/merchant/${merchantIdNumber}/stores/store/data-sync?storeId=${store.id}`}
                                            title={"Sincronizzazione Transazioni\n"}
                                            text={"Sincronizza le transazioni dai tuoi sistemi esterni: banca, cassa e strumenti di pagamento."}
                                            buttonText={"Vai alla sincronizzazione"}
                                            logoUrl={"/data-sync.png"} />
                        </div>
                    </>
                    : <LoadingSpinner />
                }
                <Modal open={storeInfoModal} onChangeOpen={setStoreInfoModal}>
                    {
                        store ? <div className="flex flex-col align-center">
                                <StoreData
                                    store={store}
                                />
                                <button className="btn btn-accent mt-3 m-auto"
                                        onClick={() => setStoreInfoModal(false)}>{t('closeBtn')}</button>
                            </div>
                            : <LoadingSpinner />
                    }
                </Modal>
            </div>
    )
}

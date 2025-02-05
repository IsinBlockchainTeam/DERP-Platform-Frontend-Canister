import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import AddChainForm from "../../components/AddChainForm/AddChainForm";
import LoadingSpinner from "../../components/Loading/LoadingSpinner";
import { Modal } from "../../components/Modal/Modal";
import GenericTable, { GenericTableColumn, GenericTableAction } from "../../components/Table/GenericTable";
import TabTitle from "../../components/Tabs/TabTitle";
import { SupportedChainDTO } from "../../dto/SupportedChainDto";
import { parseSearchParamSafe } from "../../utils";
import { chainService } from "../../api/services/Chains";

export default function ChainList() {
    const [loading, setLoading] = useState<boolean>(false);
    const [chains, setChains] = useState<SupportedChainDTO[]>([]);
    const [storeUrl, setStoreUrl] = useState<string>('');
    const [searchParams] = useSearchParams();
    const [addChainModal, setAddChainModal] = useState<boolean>(false);
    const { t } = useTranslation(undefined, { keyPrefix: "supplierChains" });
    const { merchantId } = useParams<{ merchantId: string }>();
    const navigate = useNavigate();

    const refreshData = (url: string) => {
        setLoading(true);
        chainService.listChains(url).then(chains => {
            setChains(chains);
        }).finally(() => setLoading(false));
    }

    const onDetail = (chainUrl: string) => {
        if(!merchantId) return;
        if(!storeUrl) return;
        navigate(`/merchant/${merchantId}/stores/store/chains/chain?storeUrl=${encodeURIComponent(storeUrl)}&chainUrl=${encodeURIComponent(chainUrl)}`);
    }

    const supportedChainColumns: GenericTableColumn<SupportedChainDTO>[] = [
        {
            header: t('id'),
            accessor: 'chainId'
        },
        {
            header: t('name'),
            accessor: 'name'
        },
        {
            header: t('type'),
            accessor: 'type'
        },
    ]

    const chainActions: GenericTableAction<SupportedChainDTO>[] = [
        {
            label: <div className="flex flex-row items-center">
                { t('details') }
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="pl-2 h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
            </div>,
            onClick: (chain) => onDetail(chain.url)
        }
    ]

    useEffect(() => {
        const storeUrl = parseSearchParamSafe(searchParams, 'storeUrl');
        console.log(storeUrl);
        setStoreUrl(storeUrl);
        refreshData(storeUrl);
    }, []);

    return (
        <div className=''>
            {
                loading ?
                    <LoadingSpinner />
                    :
                    <>
                        <TabTitle
                            title={t('title')}
                            rightSlot={
                                <button className='btn btn-primary' onClick={() => setAddChainModal(true)}>{t('addChainBtn')}</button>
                            }
                        />
                        <div className="flex flex-col w-full self-stretch" style={{ padding: '20px' }}>
                            <GenericTable data={chains} columns={supportedChainColumns} actions={chainActions} />
                        </div>

                        {/* Add chain modal */}
                        <Modal open={addChainModal} onChangeOpen={setAddChainModal} closeButton>
                                <AddChainForm afterSubmit={() => { setAddChainModal(false); refreshData(storeUrl) }} storeUrl={ storeUrl }></AddChainForm>
                        </Modal>
                    </>
            }

        </div>
    )
}

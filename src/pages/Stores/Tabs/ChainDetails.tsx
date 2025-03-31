import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { chainService } from "../../../api/services/Chains";
import AddCryptoForm from "../../../components/AddCryptoForm/AddCryptoForm";
import LoadingSpinner from "../../../components/Loading/LoadingSpinner";
import { Modal } from "../../../components/Modal/Modal";
import GenericTable, { GenericTableColumn } from "../../../components/Table/GenericTable";
import TabTitle from "../../../components/Tabs/TabTitle";
import { SupportedChainDTO } from "../../../dto/SupportedChainDto";
import { SupportedCryptoDTO } from "../../../dto/SupportedCryptoDto";
import { useStoreId } from "../../../utils";

export default function ChainDetails() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [chain, setChain] = useState<SupportedChainDTO>();
  const [cryptos, setCryptos] = useState<SupportedCryptoDTO[]>([]);
  const [canAddCrypto, setCanAddCrypto] = useState<boolean>(false);
  const [addCryptoModal, setAddCryptoModal] = useState<boolean>(false);
  const { t } = useTranslation(undefined, { keyPrefix: "supplierChains" });

  const storeId = useStoreId();
  const chainId = searchParams.get("chainId");

  if (!chainId) throw new Error("No chainUrl supplied in query params");
  const chainIdNum = parseInt(chainId);
  if(isNaN(chainIdNum)) {
      throw new Error('chainID must be integer');
  }

  if (!storeId) throw new Error("No storeUrl supplied in query params");

  const cryptoColumns: GenericTableColumn<SupportedCryptoDTO>[] = [
    {
      header: t('logo'),
      accessor: (crypto) => <div className="avatar">
        <div className="mask mask-circle h-12 w-12">
          <img src={crypto.iconUrl} alt="logo" />
        </div>
      </div>
    },
    {
      header: t('id'),
      accessor: 'id'
    },
    {
      header: t('name'),
      accessor: 'name'
    },
    {
      header: t('type'),
      accessor: (r) => r.isNative ? t('nativeCoin') : t('tokenCoin')
    },
    {
      header: t('exchangeRate'),
      accessor: 'toSwissFrancs'
    },
  ]

  const fetchData = () => {
    setLoading(true);

    Promise.all([
      chainService.listChains(storeId).then((chains) => {
        const chain = chains.find((c) => c.id === chainIdNum);
        if (chain) setChain(chain);
      }),
      chainService.listSupportedCrypto(storeId).then((cryptos) => {
        const thisChainCryptos = cryptos.filter(
          (c) => c.chainId === chainIdNum,
        );
        setCryptos(thisChainCryptos);
      }),
    ]).finally(() => setLoading(false));
  };

  const hideModal = () => {
    setAddCryptoModal(false);
  };

  const showAddModal = () => {
    setAddCryptoModal(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (
      cryptos &&
      cryptos.length > 0 &&
      chain &&
      chain.type.startsWith("BITCOIN")
    )
      setCanAddCrypto(false);
    else setCanAddCrypto(true);
  }, [chainId, cryptos, loading, searchParams, chain]);

  return (
    <div className='flex flex-col w-full'>
      <TabTitle title={t('supportedCurrencies')} rightSlot={
        <button onClick={showAddModal} className="btn btn-primary">
          {t('addCryptoBtn')}
        </button>
      } />
      {loading ?
        <LoadingSpinner /> :
        <div className="flex flex-col w-full">
          <GenericTable data={cryptos} columns={cryptoColumns} />
        </div>
      }

      {/* Add crypto modal */}
      <Modal open={addCryptoModal} onChangeOpen={setAddCryptoModal}>
        <AddCryptoForm
          storeId={storeId}
          chainId={chainIdNum}
          onDone={() => {
            hideModal();
            fetchData();
          }}
        ></AddCryptoForm>
      </Modal>
    </div>
  );
}

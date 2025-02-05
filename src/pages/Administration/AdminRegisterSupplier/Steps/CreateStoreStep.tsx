import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {CreateStoreDto} from "../../../../dto/stores/StoreDto";
import {WondType} from "../../../../model/WondType";
import {storeService} from "../../../../api/services/Store";
import {Wallet} from "ethers";
import FormLoader from "../../../../components/Loading/FormLoader";
import {StoreCreationForm} from "../../../../components/StoreCreationForm/StoreCreationForm";
import Card from "../../../../components/Card/Card";

export type Props = {
  onCompleted: () => void;
  supplierData: {webId: string}
}

export function CreateStoreStep({onCompleted, supplierData}: Props) {
  // TODO: Probably to remove
  //
  //const {t} = useTranslation(undefined, {keyPrefix: 'storeCreation'});
  //const [choice, setChoice] = useState<undefined | 'skip' | 'create'>(undefined);
  //const [loading, setLoading] = useState<boolean>(false);
  //const [errorMessage, setErrorMessage] = useState<string>('');
  //const [erpTypes, setErpTypes] = useState<string[]>([]);
  //
  //const [storeDto, setStoreDto] = useState<CreateStoreDto>({
  //  name: '',
  //  address: '',
  //  city: '',
  //  cap: 0,
  //  erpType: ErpType.NONE,
  //  erpUrl: '',
  //  erpCredentials: {
  //    username: '',
  //    password: '',
  //    shopId: 0
  //  },
  //  bcPrivateKey: '',
  //  bcAddress: '',
  //});
  //
  //useEffect(() => {
  //  if (choice === 'skip')
  //    onCompleted();
  //}, [choice]);
  //
  //useEffect(() => {
  //  setLoading(true);
  //  storeService.getErpTypes().then((t) => {
  //    setErpTypes(t);
  //  }).finally(() => setLoading(false));
  //}, []);
  //
  //const onCreateStore = () => {
  //  setLoading(true);
  //  setErrorMessage('');
  //
  //  if (!storeDto.name) {
  //    setErrorMessage(t('errors.name'));
  //    return;
  //  }
  //
  //  if (!storeDto.address) {
  //    setErrorMessage(t('errors.address'));
  //    return;
  //  }
  //
  //  if (!storeDto.city) {
  //    setErrorMessage(t('errors.city'));
  //    return;
  //  }
  //
  //  if (!storeDto.cap) {
  //    setErrorMessage(t('errors.cap'));
  //    return;
  //  }
  //
  //  if (storeDto.erpType !== ErpType.NONE) {
  //    if (!storeDto.erpUrl) {
  //      setErrorMessage(t('errors.erpUrl'));
  //      return;
  //    }
  //
  //    if (!storeDto.erpCredentials.username) {
  //      setErrorMessage(t('errors.erpUsername'));
  //      return;
  //    }
  //
  //    if (!storeDto.erpCredentials.password) {
  //      setErrorMessage(t('errors.erpPassword'));
  //      return;
  //    }
  //
  //    if (!storeDto.erpCredentials.shopId) {
  //      setErrorMessage(t('errors.erpShopId'));
  //      return;
  //    }
  //  }
  //
  //  if (!storeDto.bcPrivateKey) {
  //    setErrorMessage(t('errors.privateKey'));
  //    return;
  //  }
  //
  //  const bcAddress = new Wallet(storeDto.bcPrivateKey).address;
  //  return storeService.createStore({...storeDto, bcAddress}, supplierData.webId).then(() => {
  //    onCompleted();
  //  }).catch(error => {
  //    setLoading(false);
  //    setErrorMessage(error.response.data.message);
  //  })
  //}
  //
  //return (
  //  <main>
  //    {
  //      loading ? <FormLoader/> :
  //        choice === undefined ?
  //          <div className="h-screen flex flex-col items-center justify-center">
  //            <Card title={t('createNewStore')} subtitle={t('admin.fastRegisterStoreDescription')}>
  //              <div className="w-full">
  //                <div className={'flex flex-row justify-between'}>
  //                  <button className={'btn flex-1 mx-2'}
  //                          onClick={() => setChoice('skip')}>{t('admin.finishRegistration')}</button>
  //                  <button className={'btn flex-1 btn-primary mx-2'}
  //                          onClick={() => setChoice('create')}>{t('admin.createStore')}</button>
  //                </div>
  //              </div>
  //
  //            </Card>
  //          </div>
  //            :
  //            choice === 'create' &&
  //            <StoreCreationForm
  //                value={storeDto}
  //                onChange={s => setStoreDto(s)}
  //                erpTypes={erpTypes}
  //                onSubmit={onCreateStore}
  //                errorMessage={errorMessage}
  //            />
  //    }
  //  </main>
  //);
}

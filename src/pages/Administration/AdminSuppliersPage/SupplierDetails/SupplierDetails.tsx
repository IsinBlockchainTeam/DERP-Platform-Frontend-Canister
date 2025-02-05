import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { copyToClipboard, parseSearchParamSafe } from '../../../../utils';
import LoadingSpinner from '../../../../components/Loading/LoadingSpinner';
import { storeService } from '../../../../api/services/Store';
import StoreCard from '../../../../components/StoreCard/StoreCard';
import { StoreCreationForm } from '../../../../components/StoreCreationForm/StoreCreationForm';
import { WondType } from '../../../../model/WondType';
import { CreateStoreDto, StoreDto } from '../../../../dto/stores/StoreDto';
import { Wallet } from 'ethers';
import FormLoader from '../../../../components/Loading/FormLoader';
import store from '../../../../store/store';
import { supplierService } from '../../../../api/services/Supplier';
import UpdateCompanyInfo from '../../../CompanyInfo/UpdateCompanyInfo';
import { CompanyInfoDto } from '../../../../dto/CompanyInfoDto';
import { companyInfoService } from '../../../../api/services/CompanyInfo';

const addStoreModalId = 'add-store-modal';
const manageKeysModalId = 'manage-keys-modal';

export default function StoreDetails() {
    // TODO: Probably to remove
    //const [loading, setLoading] = useState(false);
    //const [loadingModal, setLoadingModal] = useState(false);
    //const [stores, setStores] = useState<StoreDto[]>();
    //const [erpTypes, setErpTypes] = useState<string[]>([]);
    //const [errorMessage, setErrorMessage] = useState<string>('');
    //const [key, setKey] = useState<string>('');
    //const [selectedStore, setSelectedStore] = useState<StoreDto>();
    //const [companyInfo, setCompanyInfo] = useState<CompanyInfoDto | undefined>(undefined)
    //const [newStoreDto, setNewStoreDto] = useState<CreateStoreDto>({
    //    name: '',
    //    address: '',
    //    city: '',
    //    cap: 0,
    //    erpType: ErpType.NONE,
    //    erpUrl: '',
    //    erpCredentials: {
    //        username: '',
    //        password: '',
    //        shopId: 0
    //    },
    //    bcPrivateKey: '',
    //    bcAddress: ''
    //});
    //
    //
    //const { t } = useTranslation(undefined, { keyPrefix: 'adminDashboard.supplierDetails' });
    //const { t: storeCreationT } = useTranslation(undefined, { keyPrefix: 'storeCreation' });
    //
    //const [searchParams] = useSearchParams();
    //const supplierWebId = parseSearchParamSafe(searchParams, 'supplierWebId');
    //const navigate = useNavigate();
    //
    //const onGoBack = () => {
    //    navigate('..', { relative: 'path' });
    //};
    //
    //const onAddStore = () => {
    //    showModal(addStoreModalId);
    //};
    //
    //const onAddApiKey = () => {
    //    showModal(manageKeysModalId);
    //};
    //
    //const generateKey = () => {
    //    if (!selectedStore) return;
    //
    //    setLoadingModal(true);
    //    supplierService.generateApiKey(selectedStore.url).then((key) => {
    //        setKey(key);
    //    }).finally(() => setLoadingModal(false));
    //};
    //
    //useEffect(() => {
    //    fetchData();
    //}, [supplierWebId]);
    //
    //const fetchData = () => {
    //    setLoading(true);
    //
    //    Promise.all([
    //        storeService.getErpTypes().then((t) => {
    //            setErpTypes(t);
    //        }),
    //        storeService.list(supplierWebId).then((stores) => {
    //            setStores(stores);
    //        }),
    //        companyInfoService.getCompanyInfoBySupplierWebId(supplierWebId).then((companyInfo) => {
    //            setCompanyInfo(companyInfo);
    //        })
    //    ]).finally(() => setLoading(false));
    //};
    //
    //const submitCreateStore = () => {
    //    setLoadingModal(true);
    //    setErrorMessage('');
    //
    //    if (!newStoreDto.name) {
    //        setErrorMessage(storeCreationT('errors.name'));
    //        return;
    //    }
    //
    //    if (!newStoreDto.address) {
    //        setErrorMessage(storeCreationT('errors.address'));
    //        return;
    //    }
    //
    //    if (!newStoreDto.city) {
    //        setErrorMessage(storeCreationT('errors.city'));
    //        return;
    //    }
    //
    //    if (!newStoreDto.cap) {
    //        setErrorMessage(storeCreationT('errors.cap'));
    //        return;
    //    }
    //
    //    if (newStoreDto.erpType !== ErpType.NONE) {
    //        if (!newStoreDto.erpUrl) {
    //            setErrorMessage(storeCreationT('errors.erpUrl'));
    //            return;
    //        }
    //
    //        if (!newStoreDto.erpCredentials.username) {
    //            setErrorMessage(storeCreationT('errors.erpUsername'));
    //            return;
    //        }
    //
    //        if (!newStoreDto.erpCredentials.password) {
    //            setErrorMessage(storeCreationT('errors.erpPassword'));
    //            return;
    //        }
    //
    //        if (!newStoreDto.erpCredentials.shopId) {
    //            setErrorMessage(storeCreationT('errors.erpShopId'));
    //            return;
    //        }
    //    }
    //
    //    if (!newStoreDto.bcPrivateKey) {
    //        setErrorMessage(storeCreationT('errors.privateKey'));
    //        return;
    //    }
    //
    //    const bcAddress = new Wallet(newStoreDto.bcPrivateKey).address;
    //    return storeService.createStore({ ...newStoreDto, bcAddress }, supplierWebId).then(() => {
    //        hideModal();
    //        fetchData();
    //    }).catch(error => {
    //        setErrorMessage(error.response.data.message);
    //    }).finally(() => setLoadingModal(false));
    //};
    //
    //const onManageStoreKeys = (store: StoreDto) => {
    //    setSelectedStore(store);
    //    showModal(manageKeysModalId);
    //};
    //
    //const hideModal = () => {
    //    window.location.hash = '';
    //};
    //
    //const showModal = (id: string) => {
    //    window.location.hash = id;
    //};
    //
    //return (
    //    <div>
    //        <div className="mx-10 pb-5 flex flex-col items-start">
    //            {loading ? <LoadingSpinner /> :
    //                <>
    //                    {/*<label className="btn btn-accent btn-circle mt-5 mr-5" onClick={onGoBack}>*/}
    //                    {/*    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}*/}
    //                    {/*         stroke="currentColor" className="w-6 h-6">*/}
    //                    {/*        <path strokeLinecap="round" strokeLinejoin="round"*/}
    //                    {/*              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />*/}
    //                    {/*    </svg>*/}
    //                    {/*</label>*/}
    //
    //                    <div className="flex self-stretch justify-center mt-3">
    //                        <UpdateCompanyInfo companyData={companyInfo} supplierWebId={supplierWebId} />
    //                    </div>
    //
    //                    <div className={'divider'} />
    //
    //                    <h1 className="text-xl font-bold text-center my-3">{t('stores')}</h1>
    //                    <div className="flex flex-wrap  justify-around">
    //                        {
    //                            stores && stores.map(store =>
    //                                <StoreCard
    //                                    key={store.url}
    //                                    store={store}
    //                                    actions={() => <div className={'flex flex-row-reverse'}>
    //                                        <button className={'btn btn-circle btn-primary'} type={'button'}
    //                                                onClick={() => onManageStoreKeys(store)}>
    //                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
    //                                                 strokeWidth={1.5}
    //                                                 stroke="currentColor" className="w-6 h-6">
    //                                                <path strokeLinecap="round" strokeLinejoin="round"
    //                                                      d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
    //                                            </svg>
    //                                        </button>
    //                                    </div>}
    //                                />
    //                            )
    //                        }
    //                    </div>
    //                </>
    //            }
    //
    //            {/* Add store modal */}
    //            <div id={addStoreModalId} className="modal">
    //                <div className="modal-box w-11/12 max-w-5xl h-full relative">
    //                    <form method="dialog">
    //                        {/* if there is a button in form, it will close the modal */}
    //                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
    //                                onClick={hideModal}>✕
    //                        </button>
    //                    </form>
    //                    {loadingModal ? <FormLoader /> : <StoreCreationForm
    //                        value={newStoreDto}
    //                        onChange={s => setNewStoreDto(s)}
    //                        erpTypes={erpTypes}
    //                        errorMessage={errorMessage}
    //                        onSubmit={() => {
    //                            submitCreateStore();
    //                        }}
    //                    />}
    //                </div>
    //            </div>
    //
    //            {/* Manage API Keys modal */}
    //            <div id={manageKeysModalId} className="modal">
    //                <div className="modal-box relative">
    //                    <form method="dialog">
    //                        {/* if there is a button in form, it will close the modal */}
    //                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
    //                                onClick={hideModal}>✕
    //                        </button>
    //                    </form>
    //                    {loadingModal ? <FormLoader /> : <div className={'flex flex-col items-center'}>
    //                        <h2 className={'text-xl mb-6'}>{t('addApiKeys')}</h2>
    //                        <button className={'btn btn-primary'} onClick={generateKey}>{t('generateKey')}</button>
    //                        <div className={`mt-3 ${key ? '' : 'hidden'} flex flex-row`}>
    //                            <label className="input input-bordered flex items-center gap-2 mb-5">
    //                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
    //                                     strokeWidth={1.5}
    //                                     stroke="currentColor" className="w-6 h-6">
    //                                    <path strokeLinecap="round" strokeLinejoin="round"
    //                                          d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
    //                                </svg>
    //                                <input type="text" className={`grow overflow-ellipsis`} placeholder="Key" readOnly
    //                                       value={key} />
    //                            </label>
    //                            <a
    //                                onClick={() => copyToClipboard(null, key, 'API Key')}
    //                                className="btn btn-ghost btn-circle">
    //                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
    //                                     strokeWidth={1.5}
    //                                     stroke="currentColor" className="w-6 h-6">
    //                                    <path strokeLinecap={'round'} strokeLinejoin={'round'}
    //                                          d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
    //                                </svg>
    //                            </a>
    //                        </div>
    //                    </div>
    //                    }
    //                </div>
    //            </div>
    //
    //            {/* FAB to add store */}
    //            <div className="fixed bottom-5 right-5">
    //                <button className="btn btn-primary" onClick={onAddStore}>{t('addStoreBtn')}</button>
    //            </div>
    //        </div>
    //    </div>
    //);
}

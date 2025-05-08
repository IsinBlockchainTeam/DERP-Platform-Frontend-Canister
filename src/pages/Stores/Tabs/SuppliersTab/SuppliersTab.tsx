import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { relationsService } from "../../../../api/services/Relations";
import LoadingSpinner from "../../../../components/Loading/LoadingSpinner";
import ConfirmationModal from "../../../../components/Modal/ConfirmationModal";
import { Modal } from "../../../../components/Modal/Modal";
import GenericTable, { GenericTableColumn, GenericTableAction } from "../../../../components/Table/GenericTable";
import TabTitle from "../../../../components/Tabs/TabTitle";
import { StoreDto } from "../../../../dto/stores/StoreDto";
import { useStoreId } from "../../../../utils";
import AllSuppliersTable from "./AllSuppliers";
import { SupplierPrivateDto } from "../../../../dto/stores/StoreList";

// Token display component with toggle functionality
const TokenDisplay = ({ token }: { token: string }) => {
    const [showToken, setShowToken] = useState(false);
    const [copied, setCopied] = useState(false);
    const { t } = useTranslation(undefined, { keyPrefix: 'mySuppliers' });
    
    const toggleVisibility = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowToken(!showToken);
    };
    
    const copyToClipboard = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(token);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy token to clipboard', err);
        }
    };
    
    return (
        <div className="flex items-center gap-2">
            <div className="font-mono flex">
                {showToken ? (
                    <span className="max-w-32 truncate">{token}</span>
                ) : (
                    <div className="w-32">
                        <input 
                            type="password" 
                            value="••••••••••••" 
                            readOnly 
                            disabled
                            className="font-medium text-base bg-transparent border-none p-0 w-full outline-none cursor-default select-none disabled:opacity-100" 
                        />
                    </div>
                )}
            </div>
            
            <div className="flex gap-1">
                <button 
                    className="btn btn-sm btn-ghost p-1" 
                    onClick={toggleVisibility}
                    title={showToken ? t('hideToken') : t('showToken')}
                >
                    {showToken ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                    )}
                </button>
                <button 
                    className={`btn btn-sm btn-ghost p-1 ${copied ? 'text-success' : ''}`}
                    onClick={copyToClipboard}
                    title={t('copyToken')}
                >
                    {copied ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                        </svg>
                    )}
                </button>
            </div>
        </div>
    );
};

export default function SuppliersTab() {
    const [loading, setLoading] = useState<boolean>(false);
    const [suppliers, setSuppliers] = useState<SupplierPrivateDto[]>([]);
    const [supplierToRemove, setSupplierToRemove] = useState<SupplierPrivateDto>();
    const [confirmRemoveModalOpen, setConfirmRemoveModalOpen] = useState<boolean>(false);
    const [showAllSuppliers, setShowAllSuppliers] = useState<boolean>(false);
    const [isRemoving, setIsRemoving] = useState<boolean>(false);
    const storeId = useStoreId();

    const { t } = useTranslation(undefined, { keyPrefix: 'mySuppliers' });

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await relationsService.getMySuppliers(storeId);
            setSuppliers(response);
        } finally {
            setLoading(false);
        }
    };

    const supplierColumns: GenericTableColumn<SupplierPrivateDto>[] = [
        {
            header: 'Logo',
            accessor: (supplier) => (
                <div className="avatar">
                    <div className="mask mask-circle h-12 w-12 bg-gray-300 flex items-center justify-center">
                        {supplier.representsStore?.imageUrl ? (
                            <img 
                                src={supplier.representsStore.imageUrl} 
                                alt="logo"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                        ) : (
                            <div className="flex items-center justify-center w-full h-full">
                                <span className="text-gray-500 text-xl font-semibold">
                                    {(supplier.representsStore?.name || supplier.name || '?').charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )
        },
        {
            header: t('name'),
            accessor: (supplier) => supplier.representsStore?.name || supplier.name || '-'
        },
        {
            header: t('address'),
            accessor: (supplier) => supplier.representsStore?.address || '-'
        },
        {
            header: t('token'),
            accessor: (supplier) => <TokenDisplay token={supplier.token} />
        }
    ];

    const supplierActions: GenericTableAction<SupplierPrivateDto>[] = [
        {
            label: isRemoving ? (
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    <span>{t('removing')}</span>
                </div>
            ) : t('removeSupplier'),
            onClick: (supplier) => {
                setSupplierToRemove(supplier);
                setConfirmRemoveModalOpen(true);
            },
            disable: isRemoving
        }
    ];

    const onConfirmRemoveSupplier = async () => {
        if (!supplierToRemove) {
            throw new Error(t('noSupplierToRemove'));
        }

        try {
            setIsRemoving(true);
            await relationsService.removeSupplier(supplierToRemove.id, storeId);
            setSuppliers(suppliers.filter(s => s.id !== supplierToRemove.id));
        } catch (error) {
            console.error(t('failedToRemove'), error);
        } finally {
            setIsRemoving(false);
            setSupplierToRemove(undefined);
            setConfirmRemoveModalOpen(false);
        }
    };

    const handleAddSupplier = async (store: StoreDto) => {
        await relationsService.addSupplier(store.id, store.name, storeId);
        await fetchData(); // Refetch data to get the updated list
        setShowAllSuppliers(false);
    };

    const handleAddExternalSupplier = async (name: string) => {
        await relationsService.addSupplier(undefined, name, storeId);
        await fetchData(); // Refetch data to get the updated list
        setShowAllSuppliers(false);
    };
    
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="flex flex-col w-full">
            <TabTitle title={t('title')} rightSlot={
                <button className="btn btn-primary" onClick={() => setShowAllSuppliers(true)}>{t('addSupplier')}</button>
            } />
            
            {loading ? (
                <div className="flex flex-row grow items-center justify-center">
                    <LoadingSpinner />
                </div>
            ) : (
                <>
                    {suppliers.length > 0 ? (
                        <div className="flex w-full flex-col" style={{ padding: '20px' }}>
                            <GenericTable data={suppliers} columns={supplierColumns} actions={supplierActions} />
                        </div>
                    ) : (
                        <div className="text-center w-full p-4">
                            {t('noFavSuppliers')}
                        </div>
                    )}
                </>
            )}

            <Modal open={showAllSuppliers} onChangeOpen={setShowAllSuppliers}>
                <AllSuppliersTable 
                    mySuppliers={suppliers} 
                    onClickAddSupplier={handleAddSupplier}
                    onClickAddExternalSupplier={handleAddExternalSupplier}
                />
            </Modal>
            
            <ConfirmationModal 
                title={t('removeSupplier')}
                message={t('removeSupplierDangerMessage')}
                open={confirmRemoveModalOpen}
                onChangeOpen={setConfirmRemoveModalOpen}
                onConfirm={onConfirmRemoveSupplier}
            />
        </div>
    );
}

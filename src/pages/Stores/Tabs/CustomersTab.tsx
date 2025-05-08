import React, { useEffect, useState } from "react";
import { relationsService } from "../../../api/services/Relations";
import { SupplierPublicDto } from "../../../dto/stores/StoreList";
import LoadingSpinner from "../../../components/Loading/LoadingSpinner";
import { useTranslation } from "react-i18next";
import GenericTable, { GenericTableColumn } from "../../../components/Table/GenericTable";
import TabTitle from "../../../components/Tabs/TabTitle";
import { useStoreId } from "../../../utils";

export default function CustomersTab() {
    const [loading, setLoading] = useState<boolean>(true);
    const [customers, setCustomers] = useState<SupplierPublicDto[]>([]);
    const { t } = useTranslation(undefined, { keyPrefix: "myCustomers" });
    const storeId = useStoreId();

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const customers = await relationsService.getCustomers(storeId);
            setCustomers(customers);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const customersColumns: GenericTableColumn<SupplierPublicDto>[] = [
        {
            header: t('logo'),
            accessor: (customer) => (
                <div className="avatar">
                    <div className="mask mask-circle h-12 w-12 bg-gray-300 flex items-center justify-center">
                        {customer.representsStore?.imageUrl ? (
                            <img 
                                src={customer.representsStore.imageUrl} 
                                alt="logo"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                        ) : (
                            <div className="flex items-center justify-center w-full h-full">
                                <span className="text-gray-500 text-xl font-semibold">
                                    {(customer.representsStore?.name || customer.name || '?').charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )
        },
        {
            header: t('name'),
            accessor: (customer) => customer.representsStore?.name || customer.name || '-'
        },
        {
            header: t('address'),
            accessor: (customer) => customer.representsStore?.address || '-'
        }
    ];

    return (
        <div className="flex flex-col w-full">
            <TabTitle title={t("title")} />
            {loading ? (
                <div className="flex flex-row grow items-center justify-center">
                    <LoadingSpinner />
                </div>
            ) : (
                <>
                    {customers?.length ? (
                        <div className="flex w-full flex-col" style={{ padding: '20px' }}>
                            <GenericTable data={customers} columns={customersColumns} />
                        </div>
                    ) : (
                        <div className="text-center w-full p-4">
                            {t("noCustomersFound")}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

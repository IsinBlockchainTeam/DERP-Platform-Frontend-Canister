import React, { useEffect, useState } from "react";
import { MyCustomer, relationsService } from "../../../api/services/Relations";
import LoadingSpinner from "../../../components/Loading/LoadingSpinner";
import CustomerCard from "../../../components/CustomerCard/CustomerCard";
import { useTranslation } from "react-i18next";
import GenericTable, { GenericTableColumn } from "../../../components/Table/GenericTable";
import TabTitle from "../../../components/Tabs/TabTitle";
import { useSearchParams } from "react-router-dom";
import { parseSearchParamSafe } from "../../../utils";

export default function CustomersTab() {
    const [loading, setLoading] = useState<boolean>(true);
    const [customers, setCustomers] = useState<MyCustomer[]>([]);
    const { t } = useTranslation(undefined, { keyPrefix: "myCustomers" });
    const [searchParams] = useSearchParams();

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const storeUrl = parseSearchParamSafe(searchParams, 'storeUrl')
            const customers = await relationsService.getCustomers(storeUrl);
            setCustomers(customers);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const customersColumns: GenericTableColumn<MyCustomer>[] = [
        {
            header: 'Logo',
            accessor: (supplier) => <div className="avatar">
                <div className="mask mask-circle h-12 w-12">
                    <img src={supplier.store.imageUrl} alt="logo" />
                </div>
            </div>
        },
        {
            header: 'Name',
            accessor: (supplier) => supplier.store.name
        },
        {
            header: 'Address',
            accessor: (supplier) => supplier.store.address
        }
    ]

    return (
        <div>
            <TabTitle title={t("title")} />
            {loading ? (
                <LoadingSpinner />
            ) : (
                <>
                    {customers?.length ? (
                        <div className="flex flex-col w-full">
                            <GenericTable data={customers} columns={customersColumns} />
                        </div>
                    ) : (
                        <div className={"text-center w-full p-4"}>
                            {t("noCustomersFound")}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

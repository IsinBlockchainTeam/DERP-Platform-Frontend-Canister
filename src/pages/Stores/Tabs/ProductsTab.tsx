import LoadingSpinner from '../../../components/Loading/LoadingSpinner';
import { Fragment, useEffect, useState } from 'react';
import TabTitle from '../../../components/Tabs/TabTitle';
import GenericTable, { GenericTableColumn } from '../../../components/Table/GenericTable';
import { useTranslation } from 'react-i18next';
import { storeService } from '../../../api/services/Store';
import { useParams, useSearchParams } from 'react-router-dom';
import { productsService } from '../../../api/services/Products';
import { ProductDto } from '../../../dto/ProductDto';
import { useStoreId } from '../../../utils';

export default function ProductsTab() {
    const storeId = useStoreId();
    const [loading, setLoading] = useState<boolean>(false);
    const [products, setProducts] = useState<ProductDto[]>([]);
    const { merchantId } = useParams<{merchantId: string}>();
    const [searchParams] = useSearchParams();
    const { t } = useTranslation(undefined, { keyPrefix: "merchantProducts" });
    const tableColumns: GenericTableColumn<ProductDto>[] = [
        {
            header: "ID",
            accessor: "id",
        },
        {
            header: t("description"),
            accessor: "description",
        }
    ];

    const init = async () => {
        setLoading(true);
        const stores = await storeService.list(merchantId);
        const store = stores.find(s => s.id === storeId);
        if (!store) {
            setLoading(false);
            return;
        }
        const products = await productsService.getProducts(store.id);
        setProducts(products);
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
                            <GenericTable data={products} columns={tableColumns} />
                        </div>
                    </Fragment>
                )
            }
        </div>
    );
}
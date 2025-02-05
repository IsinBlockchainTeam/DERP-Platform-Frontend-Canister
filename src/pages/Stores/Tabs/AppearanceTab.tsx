import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';
import { storeService } from '../../../api/services/Store';
import ColorForm from '../../../components/AppearanceForms/ColorForm';
import FontForm from '../../../components/AppearanceForms/FontForm';
import LogoForm from '../../../components/AppearanceForms/LogoForm';
import LoadingSpinner from '../../../components/Loading/LoadingSpinner';
import TabTitle from '../../../components/Tabs/TabTitle';
import { StoreDto } from '../../../dto/stores/StoreDto';
import { parseSearchParamSafe } from '../../../utils';


export default function AppearanceTab() {
    const [searchParams] = useSearchParams();
    const [store, setStore] = useState<StoreDto>();
    const { t } = useTranslation(undefined, { keyPrefix: 'supplierAppearance' });
    const { merchantId } = useParams<{merchantId: string}>();

    useEffect(() => {
        const storeUrl = parseSearchParamSafe(searchParams, 'storeUrl');
        storeService.list(merchantId).then(stores => {
            const store = stores.find(s => s.url === storeUrl);
            if (store)
                setStore(store);
        });
    }, []);

    return (
        <div className='flex flex-col'>
            <TabTitle title={t('title')} />

            <div className='flex flex-row flex-wrap gap-8 items-start justify-center'>
                {store ? <>
                    <div className='card shadow-xl border px-2 pt-2'>
                        <LogoForm store={store} />
                    </div>
                    <div className='card shadow-xl border px-2 pt-2'>
                        <ColorForm store={store} />
                    </div>
                    <div className='card shadow-xl border px-2 pt-2'>
                        <FontForm store={store} />
                    </div>
                </>
                    :
                    <LoadingSpinner />
                }

            </div>
        </div>
    )
}

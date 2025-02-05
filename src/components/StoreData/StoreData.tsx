import { useTranslation } from 'react-i18next';
import { chainService } from '../../api/services/Chains';
import { StoreDto } from '../../dto/stores/StoreDto';
import LoadingSpinner from '../Loading/LoadingSpinner';

interface Props {
    store: StoreDto;
}

function StoreData({
    store,
}: Props) {
    const { t } = useTranslation(undefined, { keyPrefix: "storeData" });

    return (
        <>
            {store ? <div className="flex flex-col justify-start">
                <div className="flex flex-row items-center justify-start text-6xl font-light mb-8">
                    <div className="avatar">
                        <div className="w-20 rounded-full mr-5">
                            <img src={chainService.cryptoImageUrl(store.imageUrl)}/>
                        </div>
                    </div>
                    {store.name}
                </div>

                <div className="mb-2 flex flex-row">
                    <p className="font-bold mr-2">ID: </p>
                    {store.id}
                </div>
                <div className="mb-2 flex flex-row">
                    <p className="font-bold mr-2">{t('address')}: </p>
                    {store.address}
                </div>
                <div className="mb-2 flex flex-row">
                    <p className="font-bold mr-2">{t('additionalInfo')}:</p>
                    {store.additionalInfo}
                </div>
                <div className="mb-2 flex flex-row">
                    <p className="font-bold mr-2">{t('postalCodeAndLocation')}: </p>
                    {store.postalCodeAndLocation}
                </div>
                <div className="mb-2 flex flex-row">
                    <p className="font-bold mr-2">{t('canton')}: </p>
                    {store.canton}
                </div>
                <div className="mb-2 flex flex-row">
                    <p className="font-bold mr-2">{t('country')}: </p>
                    {store.country}
                </div>
            </div>
                :
                <LoadingSpinner />
            }
        </>
    );
}

export default StoreData;

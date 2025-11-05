import StoreIndicatorLine from '../../components/StoreIndicator/StoreIndicator';
import { useEffect, useState } from 'react';
import { StoreDto } from '../../dto/stores/StoreDto';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../../components/Modal/Modal';
import StoreData from '../../components/StoreData/StoreData';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';
import { useTranslation } from 'react-i18next';
import { useStore } from './StoreProvider';

// type StoreHeaderProps = {
//     store: StoreDto;
// }


export const StoreHeader = () => {
    const navigate = useNavigate();
    const {store} = useStore();
    const [storeInfoModal, setStoreInfoModal] = useState<boolean>(false);
    const { t } = useTranslation(undefined, { keyPrefix: 'storeDetails' });

    const onGoBack = () => {
        navigate(`..`, { relative: 'path', });
    }

    const onInfo = () => {
        setStoreInfoModal(true);
    }


    return (
        <>
        {
            store ?
                <>
                <div className='flex flex-row items-start'>
                    <label className="btn btn-accent btn-circle btn-sm mt-5 mr-8 text-white" onClick={onGoBack}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                             strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                        </svg>
                    </label>
                    <StoreIndicatorLine store={store} onInfo={onInfo} />
                </div>
                <Modal open={storeInfoModal} onChangeOpen={setStoreInfoModal}>
                    <div className="flex flex-col align-center">
                                <StoreData
                                    store={store}
                                />
                                <button className="btn btn-accent mt-3 m-auto"
                                        onClick={() => setStoreInfoModal(false)}>{t('closeBtn')}</button>
                    </div>
                </Modal>
            </>  : <LoadingSpinner />
        }
        </>
    );
}

export default StoreHeader;
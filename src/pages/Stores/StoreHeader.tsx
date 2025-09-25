import StoreIndicatorLine from '../../components/StoreIndicator/StoreIndicator';
import { useEffect, useState } from 'react';
import { StoreDto } from '../../dto/stores/StoreDto';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../../components/Modal/Modal';
import StoreData from '../../components/StoreData/StoreData';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';
import { useTranslation } from 'react-i18next';

type StoreHeaderProps = {
    store: StoreDto;
}


export const StoreHeader = (props:StoreHeaderProps) => {
    const navigate = useNavigate();
    const [storeInfoModal, setStoreInfoModal] = useState<boolean>(false);
    const { t } = useTranslation(undefined, { keyPrefix: 'storeDetails' });

    const onGoBack = () => {
        navigate(`..?storeId=${encodeURIComponent(props.store.id)}`, { relative: 'path', });
    }

    const onInfo = () => {
        setStoreInfoModal(true);
    }


    return (
        <>
        <div className='flex flex-row items-start'>
            <label className="btn btn-accent btn-circle btn-sm mt-5 mr-8 text-white" onClick={onGoBack}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                     strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
            </label>
            <StoreIndicatorLine store={props.store} onInfo={onInfo} />
        </div>
            <Modal open={storeInfoModal} onChangeOpen={setStoreInfoModal}>
                {
                    props.store ? <div className="flex flex-col align-center">
                            <StoreData
                                store={props.store}
                            />
                            <button className="btn btn-accent mt-3 m-auto"
                                    onClick={() => setStoreInfoModal(false)}>{t('closeBtn')}</button>
                        </div>
                        : <LoadingSpinner />
                }
            </Modal>
            </>

    );
}

export default StoreHeader;
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { storeService } from '../../api/services/Store';
import Progress from '../../components/Loading/Progress';
import { Wallet } from 'ethers';
import { useTranslation } from 'react-i18next';
import { StoreCreationForm } from '../../components/StoreCreationForm/StoreCreationForm';
import { CreateStoreDto } from '../../dto/stores/StoreDto';

function StoreCreator() {
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const { t } = useTranslation(undefined, { keyPrefix: 'storeCreation' });
    const { merchantId } = useParams<{ merchantId: string }>();
    const [storeDto, setStoreDto] = useState<CreateStoreDto>({
        name: '',
        address: '',
        additionalInfo: '',
        postalCodeAndLocation: '',
        canton: '',
        country: '',
        bcPrivateKey: '',
        bcAddress: ''
    });

    const navigate = useNavigate();

    const createStore = () => {
        setLoading(true);
        clearErrorMessage();

        if (!storeDto.name) {
            showErrorMessage(t('errors.name'));
            return;
        }

        if (!storeDto.additionalInfo) {
            showErrorMessage(t('errors.additionalInfo'));
            return;
        }

        if (!storeDto.address) {
            showErrorMessage(t('errors.address'));
            return;
        }

        if (!storeDto.postalCodeAndLocation) {
            showErrorMessage(t('errors.postalCodeAndLocation'));
            return;
        }

        if (!storeDto.canton) {
            showErrorMessage(t('errors.canton'));
            return;
        }

        if (!storeDto.country) {
            showErrorMessage(t('errors.country'));
            return;
        }

        if (!storeDto.bcPrivateKey) {
            showErrorMessage(t('errors.privateKey'));
            return;
        }

        if (!merchantId) {
            showErrorMessage(t('errors.generalError'));
            return;
        }

        const companyIdNum = parseInt(merchantId)

        const bcAddress = new Wallet(storeDto.bcPrivateKey).address;
        return storeService.createStore({ ...storeDto, bcAddress }, companyIdNum).then(() => {
            navigate(`/merchant/${merchantId}/stores`);
        }).catch(error => {
            setLoading(false);
            showErrorMessage(error.response.data.message);
        });
    };

    const showErrorMessage = (message: string) => {
        setErrorMessage(message);
        setLoading(false);
    };

    const clearErrorMessage = () => {
        setErrorMessage('');
    };

    return (
        !loading ?
            <StoreCreationForm
                value={storeDto}
                onChange={setStoreDto}
                onSubmit={createStore}
            />
            :
            <>
                <p className="font-bold text-center mt-96">{t('loadingCreate')} {storeDto.name} ...</p>
                <Progress />
            </>
    );
}

export default StoreCreator;

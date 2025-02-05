import { UpdateMerchantDto } from '../../dto/merchants/UpdateMerchantDto';
import api from '../api';
import { auth } from '../auth';

export const merchantsService = {
    updateMerchant: async (
        merchantId: number,
        updateMerchantDto: UpdateMerchantDto,
    ) => {
        await api.patch(`/merchants/${merchantId}`, updateMerchantDto, {
            headers: await auth.authenticatedHeaders()
        });
    },
};

import api from "../api";
import {auth} from "../auth";
import {OfferDto} from "../../dto/OfferDto";
import { StoreDto } from '../../dto/stores/StoreDto';

export const offersService = {
    getOffers: async (storeId?: number): Promise<OfferDto[]> => {
        const res = await api.get(`/api/offers`,{
            headers: await auth.authenticatedHeaders(),
            params: {storeId}
        });
        return res.data;
    },

    getOffer: async(id: number): Promise<OfferDto> => {
        const res = await api.get<OfferDto>(`/api/offers/${id}`, {headers: await auth.authenticatedHeaders()});
        return res.data;
    }
};

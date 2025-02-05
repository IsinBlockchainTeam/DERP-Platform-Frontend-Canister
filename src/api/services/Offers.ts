import api from "../api";
import {auth} from "../auth";
import {OfferDto} from "../../dto/OfferDto";
import { StoreDto } from '../../dto/stores/StoreDto';

export const offersService = {
    getOffers: async (storeUrl?: string): Promise<OfferDto[]> => {
        const res = await api.get(`/api/offers`,{
            headers: await auth.authenticatedHeaders(),
            params: {storeUrl}
        });
        return res.data;
    },

    getOffer: async(id: string): Promise<OfferDto> => {
        const res = await api.get<OfferDto>(`/api/offers/${id}`, {headers: await auth.authenticatedHeaders()});
        return res.data;
    }
};

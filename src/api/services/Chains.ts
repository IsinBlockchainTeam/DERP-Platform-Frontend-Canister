import { AddSupportedChainDTO } from "../../dto/AddSupportedChainDto";
import { SupportedChainDTO } from "../../dto/SupportedChainDto";
import { AddSupportedCryptoDTO, SupportedCryptoDTO } from "../../dto/SupportedCryptoDto";
import api from "../api"
import { auth } from "../auth";

export const chainService = {
    async listChains(storeUrl: string): Promise<SupportedChainDTO[]> {
        const res = await api.get<{ chains: SupportedChainDTO[] }>(`/stores/chains`, { headers: await auth.authenticatedHeaders(), params: { storeUrl } });
        return res.data.chains;
    },

    async addChain(storeUrl: string, chain: AddSupportedChainDTO): Promise<SupportedChainDTO> {
        const res = await api.post<SupportedChainDTO>(`/stores/chains`, chain, { headers: await auth.authenticatedHeaders(), params: { storeUrl } });
        if (res.status != 201) throw new Error("Error adding chain");
        return res.data;
    },

    async getChainTypes(): Promise<string[]> {
        const res = await api.get<{ chainTypes: string[] }>(`/stores/chains/types`, { headers: await auth.authenticatedHeaders() });
        return res.data.chainTypes;
    },

    async listSupportedCrypto(storeUrl: string): Promise<SupportedCryptoDTO[]> {
        const res = await api.get<{ crypto: SupportedCryptoDTO[] }>(`/stores/crypto`, { headers: await auth.authenticatedHeaders(), params: { storeUrl } });
        return res.data.crypto;
    },

    async addSupportedCrypto(storeUrl: string, crypto: AddSupportedCryptoDTO): Promise<SupportedCryptoDTO> {
        const res = await api.post<SupportedCryptoDTO>(`/stores/crypto`, crypto, { headers: await auth.authenticatedHeaders(), params: { storeUrl } });
        return res.data;
    },

    async setCryptoImage(storeUrl: string, formData: FormData, cryptoId: string): Promise<SupportedCryptoDTO> {
        const res = await api.post<SupportedCryptoDTO>(`/stores/crypto/image`, formData, {
            headers: {
                ... await auth.authenticatedHeaders(),
                'Content-Type': 'multipart/form-data'
            },
            params: { storeUrl, cryptoId }
        });

        return res.data;
    },

    cryptoImageUrl(imageUrl: string | undefined) {
        if (!imageUrl) return undefined;
        const iUrl = encodeURIComponent(imageUrl);
        return `${window.location.origin}/stores/image?imageUrl=${iUrl}`;
    }
}

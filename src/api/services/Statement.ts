import api from "../api";
import { auth } from "../auth";

export const statementService = {
    async setupDefaultCategories(merchantId: string) {
        const resp = await api.post(`balance-statement/${merchantId}/default`, {
            headers: await auth.authenticatedHeaders(),
        });

        if (resp.status !== 201) {
            console.error(resp);
            throw new Error('Failed to setup default categories');
        }
        
        return;
    }
}
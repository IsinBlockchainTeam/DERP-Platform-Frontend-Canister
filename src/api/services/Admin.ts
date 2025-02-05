import api from '../api';
import {auth} from '../auth';

export const adminService = {
    getRegisterToken: async (): Promise<string> => {
        const res = await api.post<{token: string}>(`/auth/get-register-token`, {}, {
            headers: await auth.authenticatedHeaders()
        });

        return res.data.token;
    }
};
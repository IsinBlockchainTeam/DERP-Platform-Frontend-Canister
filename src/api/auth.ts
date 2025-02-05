import { AxiosError, AxiosResponse } from 'axios';
import jwtDecode from 'jwt-decode';
import {
    CUSTOMER_TOKEN_KEY,
    EXPIRES_AT_KEY,
    REFRESH_TOKEN_EXPIRES_AT,
    REFRESH_TOKEN_KEY,
    ROLE_KEY,
    STORE_COLOR,
    STORE_NAME,
    TOKEN_KEY,
    WEBID_KEY,
} from '../constants';
import {
    CustomerLoginDto,
    CustomerLoginWithTrxIdDto,
} from '../dto/auth/CustomerLoginDto';
import { LoginResponseDto } from '../dto/auth/LoginResponseDto';
import { AccessTokenPayload, UserData } from '../model/AuthModel';
import api, { ApiError } from './api';
import { UserRole } from '../model/UserRole';
import { UserInfoDto } from '../dto/UserInfoDto';

let onceCustomerLoggedCallbacks: (() => void)[] = [];

export const auth = {
    login: async (email: string, password: string) => {
        try {
            clearCustomerAuthData();
            const issueTime = Math.floor(Date.now() / 1000);
            const res = await api.post<LoginResponseDto>('/auth/login', {
                email,
                password,
            });

            saveSupplierAuthData(res, issueTime);
        } catch (e) {
            if (e instanceof AxiosError) {
                if (e.response?.status === 401) {
                    throw new ApiError('Invalid credentials', 401);
                }
            }

            throw e;
        }
    },

    getMe: async (): Promise<UserInfoDto> => {
        const res = await api.get<UserInfoDto>('/auth/me', {
            headers: await auth.authenticatedHeaders(),
        });

        return res.data;
    },

    storeLogin: async (storeUrl: string): Promise<UserData> => {
        try {
            clearCustomerAuthData();
            const issueTime = Math.floor(Date.now() / 1000);
            const res = await api.post<LoginResponseDto>(
                '/auth/store-login',
                undefined,
                {
                    headers: await supplierAuthHeaders(),
                    params: {
                        storeUrl,
                    },
                },
            );

            return saveSupplierAuthData(res, issueTime);
        } catch (e) {
            if (e instanceof AxiosError) {
                if (e.response?.status === 401) {
                    throw new ApiError('Invalid credentials', 401);
                }
            }

            throw e;
        }
    },

    generateCustomerToken: async (
        data: CustomerLoginDto | CustomerLoginWithTrxIdDto,
    ): Promise<string> => {
        const res = await api.post<{ accessToken: string }>(
            '/auth/get-customer-token',
            data,
        );

        return res.data.accessToken;
    },

    isLogged: () => {
        return !!localStorage.getItem(TOKEN_KEY);
    },

    isCustomerLogged: () => {
        return !!localStorage.getItem(CUSTOMER_TOKEN_KEY);
    },

    authenticatedHeaders: async () => {
        if (auth.isCustomerLogged()) return customerAuthHeaders();
        else if (auth.isLogged()) return supplierAuthHeaders();
        else
            throw new Error(
                'Requested authenticated headers, but no user is logged in',
            );
    },

    accessToken: () => {
        return localStorage.getItem(TOKEN_KEY);
    },

    customerToken: () => {
        return localStorage.getItem(CUSTOMER_TOKEN_KEY);
    },

    logout: async () => {
        clearSupplierAuthData();
    },

    checkRefresh: async () => {
        // read refreshTokenExpiresAt from localStorage and convert to seconds;
        const refreshTokenExpiresAt = parseInt(
            localStorage.getItem(REFRESH_TOKEN_EXPIRES_AT) || '0',
            10,
        );

        // read expiresAt from localStorage and convert to seconds
        const expiresAt = parseInt(
            localStorage.getItem(EXPIRES_AT_KEY) || '0',
            10,
        );

        const now = Math.floor(Date.now() / 1000);

        if (refreshTokenExpiresAt - now < 60) {
            // if refresh token is about to expire, logout
            await auth.logout();
        } else if (!expiresAt || expiresAt - now < 60) {
            // if access token is about to expire, refresh it
            await refreshToken();
        }
    },

    getSupplierData: (): UserData => {
        const role = localStorage.getItem(ROLE_KEY);
        const webId = localStorage.getItem(WEBID_KEY);

        if (!role || !webId) throw new Error('Inconsistent state reached');

        // check that role is in UserRole enum
        if (!Object.values(UserRole).includes(role as UserRole)) {
            throw new Error(`Invalid user role: ${role}`);
        }

        return {
            role: role as UserRole,
            webId,
        };
    },

    customerLogin: (token: string) => {
        clearSupplierAuthData();
        localStorage.setItem(CUSTOMER_TOKEN_KEY, token);
        onceCustomerLoggedCallbacks.forEach((callback) => callback());
        onceCustomerLoggedCallbacks = [];
    },


    getCustomerToken: () => {
        return localStorage.getItem(CUSTOMER_TOKEN_KEY);
    },

    onceCustomerLogged(callback: () => void) {
        if (this.isCustomerLogged()) {
            callback();
        } else {
            onceCustomerLoggedCallbacks.push(callback);
        }
    },

    shorten: async (url: string) => {
        const res = await api.post<{ id: string }>(
            '/api/shortUrl/shorten',
            undefined,
            {
                params: {
                    url,
                },
                headers: await auth.authenticatedHeaders(),
            },
        );

        return `${window.location.origin}/api/shortUrl/${res.data.id}`;
    },
};

async function supplierAuthHeaders() {
    await auth.checkRefresh();
    return { Authorization: 'Bearer ' + localStorage.getItem(TOKEN_KEY) };
}

function supplierRefreshAuthHeader() {
    return {
        Authorization: 'Bearer ' + localStorage.getItem(REFRESH_TOKEN_KEY),
    };
}

function customerAuthHeaders() {
    return {
        Authorization: 'Bearer ' + localStorage.getItem(CUSTOMER_TOKEN_KEY),
    };
}

async function refreshToken() {
    const issueTime = Math.floor(Date.now() / 1000);
    const oldAccessToken = localStorage.getItem(TOKEN_KEY);
    const oldRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    try {
        const res = await api.post<LoginResponseDto>(
            '/auth/refresh',
            {
                refreshToken: oldRefreshToken,
                oldAccessToken,
            },
            {
                headers: supplierRefreshAuthHeader(),
            },
        );

        saveSupplierAuthData(res, issueTime);

        console.log('Token refreshed');
    } catch (e) {
        if (e instanceof AxiosError) {
            throw new ApiError(
                "Can't refresh token",
                e.response?.status ?? -1,
                e.response,
            );
        }

        throw e;
    }
}

function saveSupplierAuthData(
    res: AxiosResponse<LoginResponseDto>,
    issueTime: number,
): UserData {
    const {
        accessToken,
        refreshToken,
        accessTokenExpiresIn,
        refreshTokenExpiresIn,
    } = res.data;

    const expiresAt = issueTime + accessTokenExpiresIn;
    const refreshTokenExpiresAt = issueTime + refreshTokenExpiresIn;
    const tokenData = jwtDecode<AccessTokenPayload>(accessToken);
    console.log(tokenData);

    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(EXPIRES_AT_KEY, expiresAt.toString());
    localStorage.setItem(
        REFRESH_TOKEN_EXPIRES_AT,
        refreshTokenExpiresAt.toString(),
    );
    localStorage.setItem(ROLE_KEY, tokenData.role);
    localStorage.setItem(WEBID_KEY, tokenData.webId);

    // check that role is in UserRole enum
    if (!Object.values(UserRole).includes(tokenData.role as UserRole)) {
        throw new Error(`Invalid user role: ${tokenData.role}`);
    }

    return {
        role: tokenData.role as UserRole,
        webId: tokenData.webId,
    };
}

function clearCustomerAuthData() {
    localStorage.removeItem(CUSTOMER_TOKEN_KEY);
    sessionStorage.removeItem(STORE_COLOR);
    sessionStorage.removeItem(STORE_NAME);
}

function clearSupplierAuthData() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(EXPIRES_AT_KEY);
    localStorage.removeItem(REFRESH_TOKEN_EXPIRES_AT);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(WEBID_KEY);
}

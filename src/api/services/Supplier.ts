import api from '../api';
import {auth} from "../auth";
import {UserRole} from "../../model/UserRole";
import {RegisterUserResponseDto} from "../../dto/auth/RegisterUserDto";
import {Supplier} from "../../dto/stores/StoreList";
import { RegisterUserDto } from '../../dto/UserDto';

export const supplierService = {
  register: async (email: string, password?: string, registerToken?: string): Promise<RegisterUserResponseDto | undefined> => {
    let headers = {};
    if (!password && !registerToken) {
      headers = await auth.authenticatedHeaders()
    }

    const res = await api.post<RegisterUserResponseDto>(`/auth/register`, {
      email,
      password,
      registerToken,
      role: UserRole.SUPPLIER
    }, {
      headers
    });

    const json = res.data;
    return json;
  },

  list: async () => {
    const res = await api.get<Supplier[]>(`/auth/users`, {
      headers: await auth.authenticatedHeaders(),
      params: {role: UserRole.SUPPLIER}
    });

    return res.data;
  },

  generateApiKey: async (storeUrl?: string, supplierWebId?: string) => {
    const params: Record<string, string> = storeUrl ? {storeUrl} : {};
    if (supplierWebId) {
      params.supplierWebId = supplierWebId;
    }

    const res = await api.post<{apiKey: string}>(`/auth/apiKey`, {}, {
      headers: await auth.authenticatedHeaders(),
      params
    });


    return res.data.apiKey;
  }
};
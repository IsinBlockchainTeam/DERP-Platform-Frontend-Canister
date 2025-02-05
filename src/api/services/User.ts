import { RegisterUserDto, ResponseUserDto } from '../../dto/UserDto';
import { auth } from '../auth';
import api from '../api';
import { RegisterUserResponseDto } from '../../dto/auth/RegisterUserDto';

export const userService = {
    register: async (newUser: RegisterUserDto) => {
        const res = await api.post<RegisterUserResponseDto>(`/auth/register`, newUser, {
            headers: await auth.authenticatedHeaders()
        });

        return res.data;
    },

    list: async (companyId?: number): Promise<ResponseUserDto[]> => {
        const res = await api.get(`/users`, {
            params: { companyId },
            headers: await auth.authenticatedHeaders()
        });

        return res.data;
    }
};
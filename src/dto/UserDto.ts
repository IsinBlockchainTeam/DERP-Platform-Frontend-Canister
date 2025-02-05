import { CreateRepresentativeDto, RepresentativeStatus } from './CompanyDto';
import { UserRole } from '../model/UserRole';

export interface UserDto {
    id: number,
    token: string
}

export interface RegisterUserDto extends Omit<CreateRepresentativeDto, 'password'> {
    companyId: number;
    password?: string;
    registerToken?: string;
    role: UserRole;
}

export interface ResponseUserDto {
    firstName: string;
    lastName: string;
    roleFunction: string;
    phone: string;
    email: string;
    username: string;
    password: string;
    status: RepresentativeStatus;
}
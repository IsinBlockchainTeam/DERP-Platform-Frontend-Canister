import { UserRole } from './UserRole';

export enum JwtGrantType {
    REGISTER = 'REGISTER',
    ACCESS = 'ACCESS',
    REFRESH = 'REFRESH',
}

export interface TokenPayload {
    grant_type?: JwtGrantType;
    sub: string;
    iat: number;
    exp: number;
}

export interface AccessTokenPayload extends TokenPayload {
    webId: string;
    storageBase?: string;
    role: string;
}

export interface UserData {
    webId: string;
    role: UserRole;
}

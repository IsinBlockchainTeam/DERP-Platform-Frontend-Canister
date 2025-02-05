import { UserRole } from '../model/UserRole';

export interface UserInfoDto {
    email: string;
    role: UserRole;
    webId: string | null;
    storageBase: string | null;
    companyId: number;
}

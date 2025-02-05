import {WondType} from '../../model/WondType';
import {UserRole} from "../../model/UserRole";

export interface RegisterUserResponseDto {
  email: string;
  readablePassword: string;
  webId: string;
  role: UserRole;
}
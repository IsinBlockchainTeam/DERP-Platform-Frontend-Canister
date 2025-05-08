import { UserRole } from "../../model/UserRole";

export interface MenuProps {
    role: UserRole;
}

export type ResourceType = 'admin' | 'merchant' | 'reseller';

export type MenuRouteConfig = {
    name: string;
    url: string | ((id?: string) => string);
    icon: React.ReactNode;
    show?: (role: UserRole, resourceType: ResourceType) => boolean;
    resourceTypes: Array<ResourceType | 'common'>;
};

export interface GenericMenuProps {
    role?: UserRole;
    resourceType: ResourceType;
}
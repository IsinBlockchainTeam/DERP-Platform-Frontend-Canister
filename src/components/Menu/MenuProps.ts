import { UserRole } from "../../model/UserRole";

export interface MenuProps {
    role: UserRole;
}

export type ResourceType = 'admin' | 'merchant' | 'reseller';

export type MenuRouteCategory = {
    id: string;
    name: string;
    icon: React.ReactNode;
    routes: MenuRouteConfig[];
    roles: UserRole[];
    resourceTypes: Array<ResourceType | 'common'>;
}

export type MenuRouteConfig = {
    name: string;
    url: string | ((id?: string) => string);
    icon: React.ReactNode;
    roles: UserRole[];
    resourceTypes: Array<ResourceType | 'common'>;
};

export interface GenericMenuProps {
    role?: UserRole;
    resourceType: ResourceType;
    behaviorAfterClick?: () => void;
}
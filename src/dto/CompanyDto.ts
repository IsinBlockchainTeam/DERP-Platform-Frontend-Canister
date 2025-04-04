
export interface CreateCompanyDto {
    representative: CreateRepresentativeDto;
    company: CreateCompanyDataDto;
}

export interface CreateCompanyDataDto {
    businessName: string;
    additionalInfo: string;
    address: string;
    postalCodeAndLocation: string;
    canton: string;
    country: string;
    idi: string;
    vat: string;
    phone: string;
    webSite: string;
    email: string;
    type: CompanyType;
}

export enum RepresentativeStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE'
}

export interface CreateRepresentativeDto {
    firstName: string;
    lastName: string;
    roleFunction: string;
    phone: string;
    email: string;
    username: string;
    password: string;
    status: RepresentativeStatus;
}


export type UpdateCompanyDto = Partial<CreateCompanyDto>;

export interface CompanyDto {
    id: number;
    type: CompanyType;
    businessName: string;
    additionalInfo: string;
    address: string;
    postalCodeAndLocation: string;
    canton?: string;
    country?: string;
    idi?: string;
    vat?: string;
    phone: string;
    webSite: string;
    email: string;
    representativeUserEmail: string;
    resellerId?: number;
}

export interface CreatedCompanyDto {
    id: number;
    type: CompanyType;
    businessName: string;
    additionalInfo: string;
    address: string;
    postalCodeAndLocation: string;
    canton?: string;
    country?: string;
    idi?: string;
    vat?: string;
    phone: string;
    webSite: string;
    email: string;
    representativeUserEmail: string;
    resellerId?: number;
    defaultPassword: string;
}

export enum CompanyType {
    RESELLER = 'RESELLER',
    MERCHANT = 'MERCHANT',
}

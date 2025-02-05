import { UpdateCompanyDto } from '../CompanyDto';

export type UpdateMerchantDto = Partial<UpdateCompanyDto> & {
    resellerId?: number;
};

import {ERPItemDto} from './ERPItemDto';

export interface LastOrderDetailsDto {
    id: string,
    orderLines: ERPItemDto[]
}
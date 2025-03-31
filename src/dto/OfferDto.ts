import {OfferLineDto} from "./OfferLine";

export interface OfferDto {
  id: number;
  description: string;
  offerLines: OfferLineDto[];
}
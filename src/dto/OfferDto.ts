import {OfferLine} from "./OfferLine";

export interface OfferDto {
  id: string;
  description: string;
  offerLines: OfferLine[];
}
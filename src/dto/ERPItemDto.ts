export interface ERPItemDto {
  id: number;
  quantity: number;
  price: number;
  description: string;
  partialQuantity: number;
  groups: string[];
  trxHashes: string[];
}

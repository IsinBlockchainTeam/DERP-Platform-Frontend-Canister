
export interface OfferLineDto {
    id: number;
    description: string;
    price: number;
    quantity: number;
    productId: number;
    offerId: number;
}

export type Unique<T> = T & { repeat: number; };

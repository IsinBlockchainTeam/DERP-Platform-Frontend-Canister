export interface NewOrderDto {
    orderLines: OrderLine[];
}

export interface OrderLine {
    offerId: string;
    offerLineId: string;
}

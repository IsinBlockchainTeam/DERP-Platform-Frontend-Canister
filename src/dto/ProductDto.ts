export interface ProductDto {
    id: number;
    description: string;
    vatGroupId: number;
    productGroupId: number;
    shortDescription?: string;
    longDescription?: string;
    imageUrl?: string;
}

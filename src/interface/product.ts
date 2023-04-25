/**
 * Product Item
 * merematt@udel.edu
 * 4/8/2023
 */

export type ProductVariantSelection = {
    [key: string]: string;
};

export type ProductVariants = {
    [key: string]: string[];
};

export interface Product {
    name: string;
    category: string;
    description: string;
    price: number;
    stock: number;
    variants: ProductVariants;
    image: string;
}

export function productEquals(product1: Product, product2: Product): boolean {
    if (
        product1.name !== product2.name ||
        product1.category !== product2.category ||
        product1.price !== product2.price
    )
        return false;

    for (const key in product1.variants) {
        if (!(key in product2.variants)) return false;
        if (
            !product1.variants[key].every((variant) =>
                product2.variants[key].some((other) => variant === other)
            )
        )
            return false;
    }

    return true;
}

interface ProductUrlInfo {
    slug: string;
    id: string;
}

export const buildProductUrl = (slug: string, productId: string): string => {
    return `/products/${slug}-i.${productId}`;
};

export const parseProductUrl = (
    value: string | null,
): ProductUrlInfo | null => {
    if (!value) return null;

    const match = value.match(/^(.*)-i\.([a-zA-Z0-9-]+)$/);
    if (!match) return null;

    return {
        slug: match[1],
        id: match[2],
    };
};

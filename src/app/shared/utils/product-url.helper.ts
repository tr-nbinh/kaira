// src/app/shared/utils/url-helper.ts
export const generateProductUrl = (slug: string, productId: string): string => {
    return `/products/${slug}-i.${productId}`;
};

export const praseProductIdFromSlug = (slug: string | null): string | null => {
    if (!slug) return null;

    const match = slug.match(/-i\.([a-zA-Z0-9-]+)$/);
    return match ? match[1] : null;
};

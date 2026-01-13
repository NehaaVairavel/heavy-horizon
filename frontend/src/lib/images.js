/**
 * Utility to normalize various image data formats into a consistent array of URLs.
 */
export const normalizeImages = (images) => {
    if (!images) return [];

    const imagesArray = Array.isArray(images) ? images : [images];

    return imagesArray
        .map(img => {
            if (!img) return null;

            // If it's a string, it's either a URL, a blob:, or it might be [object Object] (error case)
            if (typeof img === 'string') {
                if (img === '[object Object]') return null;
                return img;
            }

            // If it's an object, try to find a URL property
            if (typeof img === 'object') {
                const url = img.url || img.secure_url || img.blobUrl || null;
                if (typeof url === 'string') return url;
            }

            return null;
        })
        .filter(url => typeof url === 'string' && url.length > 0);
};

/**
 * Returns the first valid image URL from any format.
 * If fallback is explicitly null, it returns null instead of a placeholder if no images exist.
 */
export const getFirstImageUrl = (images, fallback = 'https://via.placeholder.com/800x600?text=No+Image') => {
    const normalized = normalizeImages(images);
    if (normalized.length > 0) return normalized[0];
    return fallback;
};

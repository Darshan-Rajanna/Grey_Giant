/**
 * Asset Utility
 * 
 * Provides dynamic loading of images from the assets directory.
 * This ensures that if image names or directory structures change 
 * slightly in the future, the site remains functional.
 */

// We use import.meta.glob to scan the assets directory at build time.
const allAssets = import.meta.glob("@assets/**/*.{jpg,jpeg,png,webp,svg,pdf}", {
    eager: true,
    import: "default",
});

/**
 * Get all images belonging to a specific subdirectory.
 * @param subDir The name of the subdirectory (case-sensitive)
 * @returns Array of image source URLs
 */
export function getImagesFromDir(subDir: string): string[] {
    // Normalize path separators for consistency and ensure we match the folder precisely
    const searchPattern = subDir.replace(/\\/g, '/');

    return Object.entries(allAssets)
        .filter(([path]) => path.includes(`/${searchPattern}/`))
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([, src]) => src as string);
}

/**
 * Get the first available image from a subdirectory.
 * Useful for hero images or main service icons.
 * @param subDir The name of the subdirectory
 * @returns Image source URL or empty string if not found
 */
export function getFirstImageInDir(subDir: string): string {
    const images = getImagesFromDir(subDir);
    return images.length > 0 ? images[0] : "";
}

/**
 * Get a background image by its filename.
 * @param fileName The filename stored in siteContent.json
 * @returns Resolved image source URL
 */
export function getBackground(fileName: string): string {
    if (!fileName) return "";

    // Search for the file in the backgrounds directory
    const match = Object.entries(allAssets).find(([path]) =>
        path.includes(`/backgrounds/${fileName}`)
    );

    return match ? (match[1] as string) : "";
}

/**
 * Resolve a full asset path (e.g. "Welcome/img.jpg" or "bg.jpg") to a build-time URL.
 * @param path The relative path from within assets/gallery or assets/backgrounds
 */
export function resolveAsset(path: string): string {
    if (!path) return "";

    // Normalize path for matching (standardize separators)
    const normalizedSearch = path.replace(/\\/g, '/');

    // We attempt to match the path suffix. 
    // We decode the asset keys just in case Vite encoded them, 
    // though usually they are plain strings in the glob.
    const match = Object.entries(allAssets).find(([assetPath]) => {
        // Double check against encoded and decoded versions for safety with special chars
        const decodedPath = decodeURIComponent(assetPath);
        return assetPath.endsWith(`/${normalizedSearch}`) || decodedPath.endsWith(`/${normalizedSearch}`);
    });

    return match ? (match[1] as string) : "";
}

/**
 * Returns all assets as a record.
 */
export function getAllAssets() {
    return allAssets;
}

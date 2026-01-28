/**
 * Asset Utility
 * 
 * Provides dynamic loading of images from the assets directory.
 * This ensures that if image names or directory structures change 
 * slightly in the future, the site remains functional.
 */

// We use import.meta.glob to scan the assets directory at build time.
const allAssets = import.meta.glob("@assets/**/*.{jpg,jpeg,png,webp,svg}", {
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
 * Returns all assets as a record.
 */
export function getAllAssets() {
    return allAssets;
}

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

    // If a data URL or full remote URL is provided (e.g., staged preview or external image), return as-is
    if (path.startsWith("data:") || path.startsWith("http://") || path.startsWith("https://")) return path;

    // Normalize path for matching (standardize separators)
    const normalizedSearch = path.replace(/\\/g, '/');

    // We attempt to match the path suffix. 
    const match = Object.entries(allAssets).find(([assetPath]) => {
        const decodedPath = decodeURIComponent(assetPath);
        return assetPath.endsWith(`/${normalizedSearch}`) || decodedPath.endsWith(`/${normalizedSearch}`);
    });

    if (match) return match[1] as string;

    // --- FALLBACK LOGIC ---
    // If the asset is not in the build (newly uploaded via Admin), 
    // fallback to loading from GitHub raw content directly.
    try {
        const owner = "darshan-rajanna";
        const repo = "Grey_Giant";

        const isSpecial = (normalizedSearch.startsWith('About/') || normalizedSearch.startsWith('OurStory/') || normalizedSearch.startsWith('Welcome/') || normalizedSearch.startsWith('Brochure/'));
        const isBg = !normalizedSearch.includes('/');

        // Resolve relative path based on directory location
        const repoPath = isBg ? `backgrounds/${normalizedSearch}` : (isSpecial ? normalizedSearch : `gallery/${normalizedSearch}`);
        return `https://raw.githubusercontent.com/${owner}/${repo}/main/client/src/assets/${repoPath}`;
    } catch (e) {
        return "";
    }
}

/**
 * Returns all assets as a record.
 */
export function getAllAssets() {
    return allAssets;
}

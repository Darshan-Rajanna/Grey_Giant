import content from "./siteContent.json";

export interface SiteContent extends Omit<typeof content, "galleryPage"> {
    galleryPage: Omit<typeof content["galleryPage"], "galleryItems"> & {
        galleryItems: string[];
    };
}

/**
 * Site Content
 * 
 * This file now acts as a proxy for siteContent.json.
 * In a production environment on GitHub Pages, the Admin Panel 
 * will update the JSON file directly via the GitHub API.
 */
export const siteContent = content as any as SiteContent;

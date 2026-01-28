import content from "./siteContent.json";

export type SiteContent = typeof content;

/**
 * Site Content
 * 
 * This file now acts as a proxy for siteContent.json.
 * In a production environment on GitHub Pages, the Admin Panel 
 * will update the JSON file directly via the GitHub API.
 */
export const siteContent: SiteContent = content;

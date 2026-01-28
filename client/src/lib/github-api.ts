import { Octokit } from "octokit";

export interface GitHubConfig {
    owner: string;
    repo: string;
    token: string;
}

/**
 * Update a file in the GitHub repository.
 * This is the mechanism we use to "save" changes without a database.
 */
export async function updateGitHubFile(
    config: GitHubConfig,
    path: string,
    content: string,
    message: string
) {
    const octokit = new Octokit({ auth: config.token });

    try {
        // 1. Get the current file's SHA (required for updating)
        const { data: fileData } = await octokit.rest.repos.getContent({
            owner: config.owner,
            repo: config.repo,
            path,
        });

        if (Array.isArray(fileData)) {
            throw new Error("Target path is a directory, not a file.");
        }

        // 2. Push the update
        await octokit.rest.repos.createOrUpdateFileContents({
            owner: config.owner,
            repo: config.repo,
            path,
            message,
            content: btoa(unescape(encodeURIComponent(content))), // Correctly handle Unicode for Base64
            sha: fileData.sha,
        });

        return { success: true };
    } catch (error: any) {
        console.error("GitHub API Error:", error);
        return { success: false, message: error.message };
    }
}

/**
 * Upload an image to a specific directory in GitHub.
 */
export async function uploadGitHubImage(
    config: GitHubConfig,
    dir: string,
    fileName: string,
    fileBase64: string,
    message: string
) {
    const octokit = new Octokit({ auth: config.token });
    const path = `client/src/assets/gallery/${dir}/${fileName}`;

    try {
        // Check if file exists to get SHA if overwrite is needed
        let sha: string | undefined;
        try {
            const { data: existingFile } = await octokit.rest.repos.getContent({
                owner: config.owner,
                repo: config.repo,
                path,
            });
            if (!Array.isArray(existingFile)) {
                sha = existingFile.sha;
            }
        } catch {
            // File doesn't exist, which is fine
        }

        await octokit.rest.repos.createOrUpdateFileContents({
            owner: config.owner,
            repo: config.repo,
            path,
            message,
            content: fileBase64,
            sha,
        });

        return { success: true };
    } catch (error: any) {
        console.error("GitHub API Error:", error);
        return { success: false, message: error.message };
    }
}

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
    const path = dir === "backgrounds" ? `client/src/assets/backgrounds/${fileName}` : `client/src/assets/gallery/${dir}/${fileName}`;

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

/**
 * List files in a specific directory in GitHub.
 */
export async function listGitHubFiles(
    config: GitHubConfig,
    path: string
) {
    const octokit = new Octokit({ auth: config.token });

    try {
        const { data } = await octokit.rest.repos.getContent({
            owner: config.owner,
            repo: config.repo,
            path,
        });

        if (Array.isArray(data)) {
            return {
                success: true,
                files: data
                    .filter(item => item.type === "file")
                    .map(item => item.name)
            };
        }
        return { success: false, message: "Path is not a directory." };
    } catch (error: any) {
        console.error("GitHub API Error:", error);
        return { success: false, message: error.message };
    }
}
/**
 * Delete a file from the GitHub repository.
 */
export async function deleteGitHubFile(
    config: GitHubConfig,
    path: string,
    message: string
) {
    const octokit = new Octokit({ auth: config.token });

    try {
        // 1. Get the current file's SHA (required for deleting)
        const { data: fileData } = await octokit.rest.repos.getContent({
            owner: config.owner,
            repo: config.repo,
            path,
        });

        if (Array.isArray(fileData)) {
            throw new Error("Target path is a directory, not a file.");
        }

        // 2. Delete the file
        await octokit.rest.repos.deleteFile({
            owner: config.owner,
            repo: config.repo,
            path,
            message,
            sha: (fileData as any).sha,
        });

        return { success: true };
    } catch (error: any) {
        console.error("GitHub API Error:", error);
        return { success: false, message: error.message };
    }
}

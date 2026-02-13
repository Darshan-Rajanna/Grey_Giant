/**
 * GitHub API Client - Refactored to use backend proxy
 * All operations now go through authenticated backend endpoints
 * JWT is managed via HttpOnly cookies - no manual token handling needed
 */

// Use environment variable for backend URL (supports both local and deployed backends)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://grey-giant.onrender.com';

/**
 * Handle API responses and redirect on authentication failure
 */
async function handleResponse(response: Response) {
    if (response.status === 401) {
        // Token expired or invalid - redirect to login
        // Use BASE_URL to ensure it works on GitHub Pages subfolders
        const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
        window.location.href = `${basePath}/admin`;
        throw new Error('Session expired. Please log in again.');
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'API request failed');
    }

    return data;
}

/**
 * Update a file in the GitHub repository
 */
export async function updateGitHubFile(
    path: string,
    content: string,
    message: string
) {
    const response = await fetch(`${API_BASE_URL}/github/update-file`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', // Send HttpOnly cookies
        body: JSON.stringify({ path, content, message }),
    });

    return handleResponse(response);
}

/**
 * Upload an image to a specific directory in GitHub
 */
export async function uploadGitHubImage(
    dir: string,
    fileName: string,
    fileBase64: string,
    message: string
) {
    const response = await fetch(`${API_BASE_URL}/github/upload-image`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ dir, fileName, fileBase64, message }),
    });

    return handleResponse(response);
}

/**
 * List files in a specific directory in GitHub
 */
export async function listGitHubFiles(path: string) {
    const response = await fetch(`${API_BASE_URL}/github/list-files`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ path }),
    });

    return handleResponse(response);
}

/**
 * Delete a file from the GitHub repository
 */
export async function deleteGitHubFile(path: string, message: string) {
    const response = await fetch(`${API_BASE_URL}/github/delete-file`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ path, message }),
    });

    return handleResponse(response);
}

/**
 * Get repository information
 */
export async function getRepoInfo() {
    const response = await fetch(`${API_BASE_URL}/github/repo-info`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    return handleResponse(response);
}

/**
 * Verify if user is authenticated
 */
export async function verifyAuth(): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/verify`, {
            method: 'GET',
            credentials: 'include',
        });

        const data = await response.json();
        return data.authenticated === true;
    } catch (error) {
        return false;
    }
}

/**
 * Login with OTP
 */
export async function login(otp: string) {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ otp }),
    });

    return handleResponse(response);
}

/**
 * Logout and clear session
 */
export async function logout() {
    const response = await fetch(`${API_BASE_URL}/admin/logout`, {
        method: 'POST',
        credentials: 'include',
    });

    return handleResponse(response);
}

// Legacy GitHubConfig interface - kept for compatibility but no longer used
export interface GitHubConfig {
    owner?: string;
    repo?: string;
    token?: string;
}

import { verifyToken } from '../utils/jwt.js';

/**
 * Authentication middleware to protect routes
 * Extracts JWT from HttpOnly cookie, verifies it, and attaches user to request
 */
export function authMiddleware(req, res, next) {
    try {
        // Extract token from HttpOnly cookie
        const token = req.cookies.admin_token;

        if (!token) {
            return res.status(401).json({
                error: 'No token provided',
                message: 'Authentication required'
            });
        }

        // Verify token
        const decoded = verifyToken(token);

        // Attach user info to request
        req.user = decoded;

        next();
    } catch (error) {
        // Clear invalid cookie
        res.clearCookie('admin_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
        });

        return res.status(401).json({
            error: 'Invalid token',
            message: 'Session expired or invalid. Please log in again.'
        });
    }
}

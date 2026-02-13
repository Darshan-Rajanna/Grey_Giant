import express from 'express';
import rateLimit from 'express-rate-limit';
import speakeasy from 'speakeasy';
import { generateToken } from '../utils/jwt.js';

const router = express.Router();

// Rate limiter: 5 login attempts per 15 minutes per IP
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: { error: 'Too many login attempts. Please try again after 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * POST /admin/login
 * Verify OTP and issue JWT in HttpOnly cookie
 */
router.post('/login', loginLimiter, (req, res) => {
    try {
        const { otp } = req.body;

        // Validate OTP format: must be exactly 6digits, numeric only
        if (!otp || typeof otp !== 'string') {
            return res.status(400).json({
                error: 'Invalid request',
                message: 'OTP is required'
            });
        }

        // Validate OTP is 6 digits
        const otpRegex = /^\d{6}$/;
        if (!otpRegex.test(otp)) {
            return res.status(400).json({
                error: 'Invalid OTP format',
                message: 'OTP must be exactly 6 digits'
            });
        }

        // Verify OTP using TOTP
        const verified = speakeasy.totp.verify({
            secret: process.env.OTP_SECRET,
            encoding: 'base32',
            token: otp,
            window: 1 // Allow 1 step before/after for clock drift
        });

        if (!verified) {
            return res.status(401).json({
                error: 'Invalid OTP',
                message: 'The OTP code is incorrect or expired'
            });
        }

        // Generate JWT
        const token = generateToken({ role: 'admin' });

        // Set HttpOnly cookie with production-ready security flags
        res.cookie('admin_token', token, {
            httpOnly: true, // Prevents JavaScript access (XSS protection)
            secure: process.env.NODE_ENV === 'production', // HTTPS only in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' for cross-origin (GitHub Pages ↔ Render)
            maxAge: 4 * 60 * 60 * 1000 // 4 hours
        });

        res.json({
            success: true,
            expiresIn: 3600,
            message: 'Login successful'
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            error: 'Server error',
            message: 'An error occurred during login'
        });
    }
});

/**
 * POST /admin/logout
 * Clear the HttpOnly cookie
 */
router.post('/logout', (req, res) => {
    res.clearCookie('admin_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });

    res.json({
        success: true,
        message: 'Logged out successfully'
    });
});

/**
 * GET /admin/verify
 * Check if user is authenticated (used for frontend session validation)
 */
router.get('/verify', (req, res) => {
    const token = req.cookies.admin_token;

    if (!token) {
        return res.status(401).json({
            authenticated: false,
            message: 'No active session'
        });
    }

    // Import verifyToken here to avoid circular dependency
    import('../utils/jwt.js').then(({ verifyToken }) => {
        try {
            verifyToken(token);
            res.json({
                authenticated: true,
                message: 'Session valid'
            });
        } catch (error) {
            res.clearCookie('admin_token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
            });
            res.status(401).json({
                authenticated: false,
                message: 'Session expired'
            });
        }
    });
});

export default router;

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import githubRoutes from './routes/github.js';

// Load environment variables
dotenv.config();

// Validate required environment variables on startup
const requiredEnvVars = [
    'GITHUB_TOKEN',
    'GITHUB_OWNER',
    'GITHUB_REPO',
    'OTP_SECRET',
    'JWT_SECRET'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
    console.error('❌ FATAL ERROR: Missing required environment variables:');
    missingEnvVars.forEach(varName => {
        console.error(`   - ${varName}`);
    });
    console.error('\n💡 Please check your .env file and ensure all required variables are set.');
    console.error('   See .env.example for reference.\n');
    process.exit(1);
}

// Validate GitHub token format (should be fine-grained token)
if (!process.env.GITHUB_TOKEN.startsWith('github_pat_') && !process.env.GITHUB_TOKEN.startsWith('ghp_')) {
    console.warn('⚠️  WARNING: GitHub token does not appear to be a valid format.');
    console.warn('   Expected format: github_pat_... (fine-grained) or ghp_... (classic)');
    console.warn('   Recommend using fine-grained tokens with minimal permissions.\n');
}

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Security: Helmet adds various HTTP headers for protection
app.use(helmet());

// CORS configuration with credentials support
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true, // Allow cookies to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Explicit OPTIONS preflight handling to prevent CORS issues
app.options('*', cors());

// Body parsing middleware
app.use(express.json({ limit: '50mb' })); // Increased limit for base64 images
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Cookie parser middleware
app.use(cookieParser());

// Request logging (development only)
if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
    });
}

// Health check endpoint - MUST be before authentication
// This is public and used by Render monitoring, uptime tools, and manual verification
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Mount routes
app.use('/admin', authRoutes);
app.use('/github', githubRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not found',
        message: `Route ${req.method} ${req.path} does not exist`
    });
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err);

    // Don't leak error details in production
    const message = process.env.NODE_ENV === 'production'
        ? 'An internal server error occurred'
        : err.message;

    res.status(err.status || 500).json({
        error: 'Server error',
        message
    });
});

// Start server
app.listen(PORT, () => {
    console.log('\n✅ Grey Gaint Admin Backend');
    console.log(`   🚀 Server running on http://localhost:${PORT}`);
    console.log(`   🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   🔐 Authentication: TOTP + JWT (HttpOnly cookies)`);
    console.log(`   📁 GitHub Repo: ${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}`);
    console.log(`   🎯 CORS Origin: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
    console.log('\n   Press Ctrl+C to stop\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('\n⏹️  SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\n⏹️  SIGINT received. Shutting down gracefully...');
    process.exit(0);
});

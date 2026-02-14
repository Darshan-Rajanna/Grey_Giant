# Grey Giant Admin Backend

Secure backend server for the Grey Giant Admin Panel, providing authenticated API endpoints for content management.

## Features

- ✅ Secure TOTP authentication
- ✅ JWT session management
- ✅ GitHub API integration for content storage
- ✅ Rate limiting for security
- ✅ CORS configuration for cross-origin requests
- ✅ Production-ready security headers

## Prerequisites

- Node.js (v18+)
- GitHub account with repository access
- TOTP authenticator app

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Required environment variables:
- `GITHUB_TOKEN` - GitHub personal access token
- `GITHUB_OWNER` - Repository owner username
- `GITHUB_REPO` - Repository name
- `OTP_SECRET` - TOTP secret for authentication
- `JWT_SECRET` - Secret for JWT signing
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend application URL

See `.env.example` for detailed setup instructions.

### 3. Generate Secrets

Refer to `.env.example` for commands to generate required secrets.

## Running the Server

### Development

```bash
npm run dev
```

Server starts on `http://localhost:3001`

### Production

```bash
NODE_ENV=production npm start
```

## API Endpoints

### Authentication
- `POST /admin/login` - Authenticate with OTP
- `POST /admin/logout` - End session
- `GET /admin/verify` - Verify authentication status

### Content Management (Protected)
- `POST /github/update-file` - Update file content
- `POST /github/upload-image` - Upload image
- `POST /github/list-files` - List directory files
- `POST /github/delete-file` - Delete file
- `GET /github/repo-info` - Get repository information

### Health Check
- `GET /health` - Server health status

## Security Features

1. **HttpOnly Cookies** - Secure session storage
2. **TOTP Authentication** - Two-factor security
3. **Rate Limiting** - Protection against brute force
4. **Helmet Security Headers** - XSS and clickjacking protection
5. **CORS Configuration** - Restricted cross-origin access
6. **Environment Validation** - Required variables checked at startup

## Troubleshooting

### Server Won't Start
- Verify all required environment variables are set in `.env`
- Check Node.js version is 18 or higher

### Authentication Issues
- Ensure system time is synchronized (TOTP is time-based)
- Verify OTP secret matches your authenticator app
- Check that OTP code is exactly 6 digits

### API Errors
- Verify GitHub token has required permissions
- Check that repository owner and name are correct
- Ensure token hasn't expired

## License

All Rights Reserved © 2026 Grey Giant

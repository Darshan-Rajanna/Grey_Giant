# Backend Deployment Guide

To use the admin panel on GitHub Pages, you must deploy the backend to a public server.

## ⚠️ IMPORTANT
The admin panel **cannot work without a deployed backend** because:
- GitHub Pages is static hosting only (no server-side code)
- The backend handles authentication and GitHub API operations
- Localhost (`http://localhost:3001`) is not accessible from the internet

---

## Option 1: Render.com (Recommended - FREE)

### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account

### Step 2: Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository: `Amulyaaar/grey_gaint`
3. Configure the service:
   - **Name**: `grey-gaint-backend` (or any name)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

### Step 3: Add Environment Variables
In the Render dashboard, add these environment variables:

```
GITHUB_TOKEN=<your-github-token-here>
GITHUB_OWNER=Amulyaaar
GITHUB_REPO=grey_gaint
OTP_SECRET=<copy from backend/.env>
JWT_SECRET=<copy from backend/.env>
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://amulyaaar.github.io
```

### Step 4: Deploy
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. You'll get a URL like: `https://grey-gaint-backend.onrender.com`

### Step 5: Update Frontend
1. Open `client/.env`
2. Update the backend URL:
   ```
   VITE_API_BASE_URL=https://grey-gaint-backend.onrender.com
   ```
3. Rebuild and redeploy to GitHub Pages:
   ```bash
   cd client
   npm run build
   git add .
   git commit -m "feat: connect to deployed backend"
   git push origin main
   ```

---

## Option 2: Railway.app (FREE $5 credit/month)

### Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub

### Step 2: Deploy from GitHub
1. Click "New Project" → "Deploy from GitHub repo"
2. Select `Amulyaaar/grey_gaint`
3. Click "Deploy"

### Step 3: Configure
1. Go to "Variables" tab
2. Add all environment variables (same as Render above)
3. Update `FRONTEND_URL=https://amulyaaar.github.io`

### Step 4: Get Public URL
1. Go to "Settings" → "Networking"
2. Click "Generate Domain"
3. Copy the URL (e.g., `https://your-app.up.railway.app`)

### Step 5: Update Frontend
Same as Render Option 1, Step 5

---

## Option 3: Fly.io (FREE tier available)

### Step 1: Install Fly CLI
```bash
curl -L https://fly.io/install.sh | sh
```

### Step 2: Login and Initialize
```bash
cd backend
fly launch
```

### Step 3: Set Environment Variables
```bash
fly secrets set GITHUB_TOKEN=<your-token>
fly secrets set GITHUB_OWNER=Amulyaaar
fly secrets set GITHUB_REPO=grey_gaint
fly secrets set OTP_SECRET=<copy-from-env>
fly secrets set JWT_SECRET=<copy-from-env>
fly secrets set FRONTEND_URL=https://amulyaaar.github.io
fly secrets set NODE_ENV=production
```

### Step 4: Deploy
```bash
fly deploy
```

### Step 5: Update Frontend
Same as Render Option 1, Step 5

---

## Testing After Deployment

1. **Test Backend Health**:
   ```
   https://your-backend-url.com/health
   ```
   Should return: `{"status":"healthy",...}`

2. **Test Admin Login**:
   - Go to `https://amulyaaar.github.io/Grey_gaint/admin`
   - Generate OTP by running on your local machine:
     ```bash
     cd backend
     node -e "const speakeasy = require('speakeasy'); console.log(speakeasy.totp({secret: process.env.OTP_SECRET, encoding: 'base32'}));"
     ```
   - Enter the 6-digit code

3. **Verify GitHub Operations**:
   - Try uploading an image
   - Check if it commits to GitHub

---

## Troubleshooting

### CORS Errors
If you see CORS errors, verify:
1. Backend `FRONTEND_URL` matches your GitHub Pages URL exactly
2. No trailing slash in the URL
3. Restart the backend after env var changes

### 401 Unauthorized
- Generate a fresh OTP code
- Check backend logs for errors

### Connection Refused
- Verify backend is running (check Render/Railway dashboard)
- Check the backend URL is correct in `client/.env`

---

## Cost Summary

| Service | Free Tier | Limitations |
|---------|-----------|-------------|
| **Render.com** | ✅ Free forever | Sleeps after 15 min inactivity, cold starts |
| **Railway.app** | ✅ $5/month credit | ~500 hours/month runtime |
| **Fly.io** | ✅ Free tier | 3 shared-cpu VMs, 256MB RAM each |

**Recommendation**: Start with **Render.com** - it's the easiest and truly free.

---

## Next Steps After Deployment

1. ✅ Deploy backend to Render/Railway/Fly
2. ✅ Update `client/.env` with deployed backend URL
3. ✅ Rebuild frontend: `npm run build`
4. ✅ Push to GitHub: `git push origin main`
5. ✅ Test admin at: `https://amulyaaar.github.io/Grey_gaint/admin`

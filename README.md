<<<<<<< HEAD
# Grey Gaint - Event Services Platform

## 🎯 Production Architecture

This repository implements a modern JAMstack architecture with a static frontend on GitHub Pages and a secure backend API on Render.com.

### Live URLs

- **Website**: https://amulyaaar.github.io/Grey_gaint
- **Admin Panel**: https://amulyaaar.github.io/Grey_gaint/admin
- **Backend API**: https://grey-gaint-backend.onrender.com

---

## 🏗️ Architecture Overview

```
┌─────────────────────┐         ┌──────────────────────┐
│   GitHub Pages      │         │   Render.com         │
│   (Static Frontend) │ ←────→  │   (Node.js Backend)  │
│                     │  HTTPS  │                      │
└─────────────────────┘         └──────────────────────┘
                                          │
                                          ↓
                                ┌──────────────────────┐
                                │  GitHub Repository   │
                                │  (Data Storage/CMS)  │
                                └──────────────────────┘
```

**Key Features:**
- ✅ **Zero Database**: GitHub repository acts as CMS
- ✅ **Secure Authentication**: TOTP + JWT with HttpOnly cookies
- ✅ **Production-Ready**: Environment-based configuration, no hardcoded URLs
- ✅ **Free Hosting**: GitHub Pages + Render free tier

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- GitHub account with repository access
- Render.com account (free)

### Local Development

```bash
# 1. Clone repository
git clone https://github.com/Amulyaaar/grey_gaint.git
cd grey_gaint

# 2. Setup backend
cd backend
npm install
cp .env.example .env
# Edit .env with your secrets (see deployment guide)
npm run dev

# 3. Setup frontend (in new terminal)
cd client
npm install
npm run dev
```

Visit: `http://localhost:5173` for the website, `http://localhost:5173/admin` for admin panel.

---

## 📚 Documentation

- **[PRODUCTION_DEPLOYMENT.md](file:///C:/Users/darsh/.gemini/antigravity/brain/96e63d6b-470b-4a6a-89d3-a70adc7f076d/implementation_plan.md)** - Complete deployment guide
- **[DEPLOY_BACKEND_NOW.md](file:///C:/Users/darsh/OneDrive/Desktop/Amulya%20Project/Grey_gaintv1/grey_gaint_remote/DEPLOY_BACKEND_NOW.md)** - Quick backend deployment reference
- **[BACKEND_DEPLOYMENT.md](file:///C:/Users/darsh/OneDrive/Desktop/Amulya%20Project/Grey_gaintv1/grey_gaint_remote/BACKEND_DEPLOYMENT.md)** - Alternative hosting options

---

## 🔒 Security

### Authentication Flow

1. User enters 6-digit TOTP code (generated using `speakeasy`)
2. Backend validates OTP and issues JWT token
3. JWT stored in **HttpOnly cookie** (cannot be accessed by JavaScript)
4. All admin operations require valid JWT
5. Session expires after 4 hours

### Environment Variables

**Never commit secrets!** All sensitive data is in `.env` files which are gitignored.

Required secrets:
- `GITHUB_TOKEN` - Repository access
- `OTP_SECRET` - TOTP authentication
- `JWT_SECRET` - Session encryption

See [`.env.example`](file:///C:/Users/darsh/OneDrive/Desktop/Amulya%20Project/Grey_gaintv1/grey_gaint_remote/backend/.env.example) for generation commands.

---

## 📁 Project Structure

```
├── client/                 # Vite + React frontend
│   ├── src/
│   │   ├── pages/
│   │   │   └── Admin.tsx  # Admin panel
│   │   ├── lib/
│   │   │   └── github-api.ts  # Backend API client
│   │   └── assets/        # Images (tracked in Git as CMS)
│   ├── .env.development   # Local backend URL
│   └── .env.production    # Production backend URL
│
├── backend/               # Express API server
│   ├── routes/
│   │   ├── auth.js       # Login, verify, logout
│   │   └── github.js     # Repository operations
│   ├── middleware/
│   │   └── auth.js       # JWT validation
│   ├── services/
│   │   └── github.service.js  # GitHub API integration
│   └── server.js         # Main entry point
│
└── .github/workflows/
    └── deploy.yml        # GitHub Pages deployment
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Framer Motion** - Animations
- **Tailwind CSS** - Styling

### Backend
- **Node.js + Express** - API server
- **Octokit** - GitHub API client
- **jsonwebtoken** - JWT sessions
- **speakeasy** - TOTP authentication
- **helmet** - Security headers
- **cors** - Cross-origin support

---

## 🌐 Deployment

### Production Deployment Steps

1. **Deploy Backend to Render** (see [deployment guide](file:///C:/Users/darsh/.gemini/antigravity/brain/96e63d6b-470b-4a6a-89d3-a70adc7f076d/implementation_plan.md))
2. **Configure GitHub Secrets** with backend URL
3. **Push to main branch** - GitHub Actions auto-deploys frontend

### Deployment Checklist

- [ ] Backend deployed to Render with all environment variables
- [ ] GitHub Actions secret `VITE_API_BASE_URL` configured
- [ ] OTP secret saved securely for login code generation  
- [ ] Admin login tested successfully
- [ ] Image upload verified (commits to GitHub)

---

## 📊 Features

### Public Website
- ✨ Premium event services showcase
- 📸 Dynamic gallery with lazy loading
- 💬 Client testimonials
- 📞 Contact form integration

### Admin Panel
- 🔐 Secure TOTP authentication
- 🖼️ Drag-and-drop image management
- 📝 Content editing with live preview
- 🚀 One-click deployment to GitHub
- 📊 Asset usage tracking

---

## 🐛 Troubleshooting

### Common Issues

**Problem**: "CORS Error" in browser console  
**Solution**: Verify `FRONTEND_URL` in Render has no trailing slash

**Problem**: Admin login fails  
**Solution**: 
1. Check backend is awake (Render free tier sleeps after 15 min)
2. Visit `/health` endpoint to wake it
3. Generate fresh OTP code

**Problem**: Images not uploading  
**Solution**: Verify GitHub token has "Contents: Read & Write" permission

See [full troubleshooting guide](file:///C:/Users/darsh/.gemini/antigravity/brain/96e63d6b-470b-4a6a-89d3-a70adc7f076d/implementation_plan.md#-troubleshooting) for more.

---

## 📄 License

MIT

---

## 👨‍💻 Development

### Available Scripts

**Frontend:**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

**Backend:**
```bash
npm start            # Start production server
npm run dev          # Start development server (with auto-reload)
```

---

## 🎯 Roadmap

- [ ] Email notifications for contact form
- [ ] Automated image optimization pipeline  
- [ ] Multi-admin support with roles
- [ ] Content versioning \u0026 rollback
- [ ] Analytics integration

---

**For deployment assistance, see the [Production Deployment Guide](file:///C:/Users/darsh/.gemini/antigravity/brain/96e63d6b-470b-4a6a-89d3-a70adc7f076d/implementation_plan.md)**
=======
# Grey_Giant
GREY GIANT | Events &amp; Services - Crafting Unforgettable Experience
>>>>>>> 5987fade6cb2cd9f89c6a977b1ca870769fe6d81

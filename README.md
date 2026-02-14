# Grey Giant - Event Services Platform

A premium event management and services platform showcasing luxury event planning, execution, and management services.

## 🎯 Overview

Grey Giant specializes in creating unforgettable experiences through professional event services. This platform serves as both a showcase for our services and an admin management system for content updates.

### Live Site

Visit our website to explore our premium event services and portfolio.

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- GitHub account
- npm or yarn package manager

### Local Development

```bash
# 1. Clone repository
git clone https://github.com/Darshan-Rajanna/Grey_Giant.git
cd Grey_Giant

# 2. Install dependencies
npm install

# 3. Setup environment (see .env.example files)
# Create .env files in backend/ and client/ directories

# 4. Start development server
npm run dev
```

Visit `http://localhost:5173` to view the website locally.

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Framer Motion** - Smooth animations
- **Tailwind CSS** - Utility-first styling
- **Wouter** - Lightweight routing

### Backend
- **Node.js + Express** - API server
- **JWT** - Secure authentication
- **TOTP** - Two-factor authentication
- **GitHub API** - Content management
- **Helmet** - Security headers

---

## 📁 Project Structure

```
├── client/              # Frontend React application
│   ├── src/
│   │   ├── pages/      # Page components
│   │   ├── components/ # Reusable UI components
│   │   ├── assets/     # Images and static files
│   │   └── lib/        # Utilities and helpers
│   └── public/         # Public assets
│
├── backend/            # Backend API server
│   ├── routes/        # API routes
│   ├── middleware/    # Express middleware
│   └── services/      # Business logic
│
└── .github/           # GitHub workflows
```

---

## ✨ Features

### Public Website
- Premium event services showcase
- Dynamic image gallery
- Client testimonials and reviews
- Responsive design for all devices
- Contact and inquiry forms

### Admin Panel
- Secure authentication
- Content management
- Image upload and organization
- Service management
- Review management

---

## 🔒 Security

- Environment variables for sensitive configuration
- TOTP-based authentication for admin access
- JWT session management
- HTTPS-only cookies in production
- Rate limiting on authentication endpoints

---

## 📄 License

All Rights Reserved © 2026 Grey Giant

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
npm run dev          # Start with auto-reload
```

---

## 📧 Contact

For inquiries about our event services or platform development, please visit our contact page on the website.

---

**Developed with Precision by [Gowtrix Hub](https://github.com/the-gowda-s-hub/)**

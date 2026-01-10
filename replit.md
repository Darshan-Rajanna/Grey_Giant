# Grey Giant Events - Premium Event Management Platform

## Overview

Grey Giant is a luxury event management website built as a full-stack TypeScript application. The platform showcases premium corporate events, bespoke weddings, and exclusive social gatherings with a sophisticated dark-themed design. Core features include a service catalogue, photo gallery, client reviews system, and contact/inquiry forms.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with a custom dark luxury theme (blacks, greys, whites)
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **State Management**: TanStack React Query for server state and caching
- **Forms**: React Hook Form with Zod schema validation via @hookform/resolvers
- **Animations**: Framer Motion for fade-in and slide-up luxury animations

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful endpoints defined in `shared/routes.ts` with Zod schemas for type-safe request/response validation
- **Build Process**: Custom build script using esbuild for server and Vite for client

### Data Storage
- **Database**: PostgreSQL via node-postgres (pg) driver
- **ORM**: Drizzle ORM with drizzle-zod for schema-to-validation integration
- **Schema Location**: `shared/schema.ts` defines tables for inquiries and reviews
- **Migrations**: Drizzle Kit for schema push (`npm run db:push`)

### Project Structure
```
client/           # React frontend
  src/
    components/   # Reusable UI components
    pages/        # Route pages (Home, About, Services, Gallery, Reviews, Contact)
    hooks/        # Custom React hooks for data fetching
    lib/          # Utilities and query client setup
server/           # Express backend
  index.ts        # Server entry point
  routes.ts       # API route handlers
  storage.ts      # Database operations layer
  db.ts           # Database connection
shared/           # Shared code between client and server
  schema.ts       # Drizzle database schema
  routes.ts       # API route definitions with Zod schemas
```

### Key Design Patterns
- **Type Safety**: Shared Zod schemas between frontend and backend ensure consistent validation
- **Storage Abstraction**: `IStorage` interface in `server/storage.ts` abstracts database operations
- **Path Aliases**: TypeScript paths configured for `@/` (client), `@shared/` (shared), `@assets/` (attached assets)

## External Dependencies

### Database
- PostgreSQL database (connection via `DATABASE_URL` environment variable)
- connect-pg-simple for session storage capability

### Frontend Libraries
- Radix UI primitives for accessible component foundations
- Embla Carousel for reviews carousel
- Lucide React for icons
- date-fns for date formatting

### Build & Development
- Vite with React plugin
- Replit-specific plugins for development (cartographer, dev-banner, runtime-error-modal)
- esbuild for production server bundling
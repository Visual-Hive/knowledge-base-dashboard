# Knowledge Base Management System

## Overview

This is a full-stack Knowledge Base Management System built with React, Express, and PostgreSQL. The application allows users to organize, search, and manage documentation across multiple knowledge bases. It features a modern, professional interface inspired by productivity tools like Notion and Linear, with a focus on clarity and efficiency.

The system provides functionality for creating and managing knowledge bases, uploading and organizing documents, searching across content, and managing user settings. The application uses a monorepo structure with shared types and schemas between frontend and backend.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18+ with TypeScript for type safety
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- React Query (@tanstack/react-query) for server state management and caching

**UI Component System:**
- Shadcn/ui components with Radix UI primitives for accessibility
- TailwindCSS for styling with custom design tokens
- Class Variance Authority (CVA) for component variant management
- Custom design system defined in `design_guidelines.md` emphasizing professional aesthetics and clear information hierarchy

**State Management:**
- React Context API for authentication state (`AuthContext`)
- React Query for server state with configurable cache behavior
- Local storage for session persistence

**Key Design Patterns:**
- Protected routes using `ProtectedRoute` wrapper component
- Shared layout component (`AppLayout`) with responsive sidebar navigation
- Reusable modal and dialog components for user interactions
- Toast notifications for user feedback
- Custom hooks for mobile detection and toast management

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript for the API server
- HTTP server created via Node.js `http` module
- Custom middleware for request logging and JSON parsing with raw body capture

**Development Setup:**
- Vite integration for HMR (Hot Module Replacement) in development
- SSR-ready architecture with custom Vite middleware mode
- Replit-specific plugins for development tools (@replit/vite-plugin-runtime-error-modal, cartographer, dev-banner)

**Storage Layer:**
- In-memory storage implementation (`MemStorage`) as a placeholder
- Interface-based design (`IStorage`) allowing for easy swap to database implementation
- Designed for future PostgreSQL integration via Drizzle ORM

**API Structure:**
- Routes registered through `registerRoutes` function
- All application routes prefixed with `/api`
- Centralized storage interface for CRUD operations

### Data Storage Solutions

**Database Configuration:**
- PostgreSQL via Neon (@neondatabase/serverless) for serverless deployment
- Drizzle ORM for type-safe database queries and migrations
- Drizzle-Zod integration for runtime schema validation
- Connection pooling via connect-pg-simple for session management

**Schema Design:**
- Defined in `shared/schema.ts` for code sharing between client and server
- User table with UUID primary keys, unique usernames, and hashed passwords
- Zod schemas derived from Drizzle tables for validation
- Migration files stored in `/migrations` directory

**Current Implementation Note:**
- The application currently uses in-memory storage (`MemStorage` class)
- Database schema and configuration are prepared but not yet connected to routes
- Storage interface pattern allows seamless transition to database-backed storage

### Authentication & Authorization

**Current Implementation:**
- Client-side authentication using React Context
- Session persistence via localStorage
- Mock authentication flow (no actual password verification)
- Protected routes enforcing authentication state

**Prepared for Implementation:**
- User schema defined with password field for future bcrypt/argon2 hashing
- Session management infrastructure via connect-pg-simple ready for integration
- Unique username constraints at database level

### External Dependencies

**Third-Party UI Libraries:**
- Radix UI component primitives (accordion, dialog, dropdown-menu, popover, tabs, toast, etc.)
- Embla Carousel for carousel functionality
- Lucide React for consistent icon system
- CMDK for command palette functionality
- React Hook Form with Zod resolvers for form validation

**Development Tools:**
- TypeScript for static type checking
- ESBuild for production bundling
- Drizzle Kit for database migrations
- Date-fns for date formatting and manipulation

**Database & Session:**
- @neondatabase/serverless for PostgreSQL connection
- connect-pg-simple for PostgreSQL session store
- Drizzle ORM with PostgreSQL dialect

**Styling:**
- TailwindCSS with PostCSS and Autoprefixer
- Custom CSS variables for theme management
- Google Fonts (Inter, Geist Mono, DM Sans, Fira Code, Architects Daughter)

**State Management:**
- TanStack React Query for server state with custom query client configuration
- Custom fetch wrapper (`apiRequest`) with credential inclusion
- Configurable unauthorized behavior (401 handling)
# Overview

JobGuard is a full-stack job search platform focused on helping users identify and avoid fake job postings. The application features job listings with trust scores, company verification, and community-driven reporting to create a safer job hunting experience. Built with React on the frontend and Express on the backend, it includes features for saving jobs, reporting suspicious postings, and accessing educational courses.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Radix UI primitives with shadcn/ui components for consistent design
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture  
- **Runtime**: Node.js with Express.js web framework
- **Language**: TypeScript with ES modules for modern JavaScript features
- **Database ORM**: Drizzle ORM for type-safe database operations
- **API Design**: RESTful endpoints with JSON responses
- **Error Handling**: Centralized error middleware with structured error responses
- **Development**: Hot module replacement and live reloading via Vite integration

## Database Design
- **Primary Database**: PostgreSQL configured through Drizzle
- **Schema**: Includes tables for users, companies, jobs, saved jobs, job reports, and courses
- **Relationships**: Foreign key constraints between jobs and companies, saved jobs and users
- **Trust System**: Company trust scores and job verification status tracking
- **Migrations**: Drizzle migrations for schema versioning

## Data Flow
- **Job Filtering**: Dynamic filtering by location, job type, experience level, company size, and trust score
- **Trust Scoring**: Companies have trust scores that influence job credibility
- **Reporting System**: Users can report suspicious jobs with categorized reasons
- **Save Functionality**: Users can bookmark jobs for later review

# External Dependencies

## Database
- **@neondatabase/serverless**: Neon PostgreSQL serverless driver for database connectivity
- **drizzle-orm**: Type-safe ORM for database operations and query building
- **drizzle-kit**: Database migration and schema management toolkit

## UI and Styling
- **@radix-ui/***: Comprehensive set of accessible UI primitives (dialogs, dropdowns, forms, etc.)
- **tailwindcss**: Utility-first CSS framework for responsive design
- **class-variance-authority**: Component variant management for consistent UI patterns
- **lucide-react**: Modern icon library for UI elements

## Data Management
- **@tanstack/react-query**: Server state management with caching and synchronization
- **react-hook-form**: Form handling with validation and error management
- **@hookform/resolvers**: Form validation resolvers for schema integration
- **zod**: Runtime type validation for API requests and responses

## Development Tools
- **vite**: Build tool and development server with HMR support
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay for debugging
- **typescript**: Static type checking for both frontend and backend code
- **wouter**: Lightweight routing library for navigation
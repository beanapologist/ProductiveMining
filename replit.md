# Productive Mining Platform

## Overview

This is a revolutionary blockchain platform that replaces traditional wasteful proof-of-work mining (like Bitcoin's SHA-256) with productive mathematical computation. Instead of wasting computational power on arbitrary hash calculations, miners solve real mathematical problems like the Riemann Hypothesis, prime number patterns, and quantum field theory validations while maintaining blockchain security.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state, React hooks for local state
- **Real-time Updates**: WebSocket connection for live mining data
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite with custom configuration for development and production

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Real-time Communication**: WebSocket server for broadcasting mining updates
- **Data Storage**: In-memory storage with interface for database integration
- **Development**: Hot module replacement with Vite integration

### Database Design
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema Location**: Shared between client and server (`shared/schema.ts`)
- **Migration Strategy**: Drizzle Kit for schema migrations
- **Connection**: Neon Database serverless PostgreSQL

## Key Components

### 1. Mathematical Work Engine
- **Riemann Zero Mining**: Computes zeros of the Riemann zeta function
- **Prime Pattern Discovery**: Finds twin primes, cousin primes, and prime constellations
- **QDT Validation**: Quantum field theory constraint validation
- **Scientific Value Calculation**: Assigns monetary value to mathematical discoveries

### 2. Productive Block Structure
- Contains multiple mathematical work results instead of arbitrary hashes
- Tracks scientific value, energy efficiency, and knowledge creation metrics
- Links blocks to mathematical discoveries through junction tables

### 3. Mining Operations System
- Real-time tracking of active mining operations
- Progress monitoring with estimated completion times
- Support for different mathematical work types with varying difficulties

### 4. Network Metrics Dashboard
- Energy efficiency tracking (compared to Bitcoin)
- Scientific value generation monitoring
- Real-time hashrate and active miner statistics
- Knowledge creation and breakthrough tracking

## Data Flow

1. **Mining Initiation**: Miners start mathematical computations based on difficulty and work type
2. **Progress Updates**: WebSocket broadcasts real-time mining progress to all connected clients
3. **Work Completion**: Mathematical results are validated and stored with verification data
4. **Block Creation**: Completed work is aggregated into productive blocks
5. **Network Updates**: Metrics are updated and broadcast to reflect new scientific value created

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM
- **express**: Web server framework
- **ws**: WebSocket implementation
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework

### Development Tools
- **vite**: Fast build tool and development server
- **tsx**: TypeScript execution for Node.js
- **esbuild**: JavaScript bundler for production
- **drizzle-kit**: Database migration tool

## Deployment Strategy

### Development
- Uses Vite dev server with HMR for frontend
- Express server with hot reload via tsx
- In-memory storage for rapid development
- WebSocket connection for real-time updates

### Production Build
- Vite builds optimized React bundle to `dist/public`
- esbuild bundles Node.js server to `dist/index.js`
- Static files served by Express in production
- Database migrations applied via `drizzle-kit push`

### Environment Configuration
- `NODE_ENV` determines development vs production mode
- `DATABASE_URL` required for PostgreSQL connection
- Replit-specific plugins for development environment

## Changelog
```
Changelog:
- July 02, 2025. Initial setup
- July 02, 2025. Implemented cryptographic safety engine using mathematical discoveries
- July 02, 2025. Fixed block creation logic - blocks now generate properly from completed operations
- July 02, 2025. Added comprehensive memory and storage cleanup mechanisms
- July 02, 2025. Created discovery console logging with detailed mathematical breakthrough tracking
- July 02, 2025. Integrated post-quantum cryptography using Riemann zeros and prime patterns
```

## User Preferences
```
Preferred communication style: Simple, everyday language.
```
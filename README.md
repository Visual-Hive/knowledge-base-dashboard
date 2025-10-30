# Knowledge Base Management System

A full-stack Knowledge Base Management System built with React, Express, TypeScript, and PostgreSQL. The application allows users to organize, search, and manage documentation across multiple knowledge bases with a modern, professional interface.

## Features

- **Knowledge Base Management** - Create and organize multiple knowledge bases
- **Document Management** - Upload, organize, and manage documents
- **Advanced Search** - Search across all content with highlighting
- **User Authentication** - Secure login and session management
- **Modern UI** - Professional interface built with shadcn/ui and TailwindCSS
- **Responsive Design** - Works seamlessly on desktop and mobile devices

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Fast build tool and development server
- **Wouter** - Lightweight client-side routing
- **TanStack Query** - Server state management and caching
- **shadcn/ui** - Component library built on Radix UI
- **TailwindCSS** - Utility-first CSS framework
- **Lucide React** - Icon library

### Backend
- **Express.js** - Web application framework
- **TypeScript** - Type-safe server code
- **PostgreSQL** - Database (via Neon serverless)
- **Drizzle ORM** - Type-safe database queries
- **Session Management** - Express-session with PostgreSQL store

### Development Tools
- **tsx** - TypeScript execution for development
- **esbuild** - Fast bundler for production
- **Drizzle Kit** - Database migrations

## Project Structure

```
├── client/                # Frontend React application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── contexts/     # React contexts (Auth, etc.)
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # Utilities and helpers
│   └── index.html        # HTML entry point
├── server/               # Backend Express application
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Storage interface
│   └── vite.ts           # Vite integration
├── shared/               # Shared code between client and server
│   └── schema.ts         # Database schema and types
└── dist/                 # Production build output
```

## Prerequisites

- **Node.js** 20+ (recommended)
- **npm** or **yarn**
- **PostgreSQL** database (or Neon account for serverless PostgreSQL)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd InfoBaseManager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/dbname
   PORT=5000
   NODE_ENV=development
   ```

4. **Set up the database**
   
   Run database migrations:
   ```bash
   npm run db:push
   ```

## Development

Start the development server with hot module replacement:

```bash
npm run dev
```

The application will be available at `http://localhost:5000`

### Development Features
- Hot Module Replacement (HMR) for instant updates
- TypeScript type checking
- Automatic server restart on file changes
- Vite-powered fast refresh

## Production Build

1. **Build the application**
   ```bash
   npm run build
   ```
   
   This will:
   - Build the React frontend with Vite
   - Bundle the Express backend with esbuild
   - Output everything to the `dist/` directory

2. **Start the production server**
   ```bash
   npm start
   ```

## Available Scripts

- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run check` - Run TypeScript type checking
- `npm run db:push` - Push database schema changes

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment mode | development |

## Database Setup

This project uses PostgreSQL with Drizzle ORM. The schema is defined in `shared/schema.ts`.

### Local PostgreSQL Setup

1. Install PostgreSQL on your system
2. Create a database:
   ```sql
   CREATE DATABASE knowledge_base;
   ```
3. Update `DATABASE_URL` in your `.env` file
4. Run migrations:
   ```bash
   npm run db:push
   ```

### Using Neon (Serverless PostgreSQL)

1. Create a free account at [neon.tech](https://neon.tech)
2. Create a new project and database
3. Copy the connection string to your `.env` file as `DATABASE_URL`
4. Run migrations:
   ```bash
   npm run db:push
   ```

## Architecture Notes

### Current Implementation
- The application currently uses an in-memory storage implementation (`MemStorage` class in `server/storage.ts`)
- This is a placeholder for development and testing
- The database schema and ORM configuration are prepared but not yet connected to the routes

### Database Migration
- To switch to PostgreSQL-backed storage, update the routes in `server/routes.ts` to use a Drizzle-based storage implementation
- The schema is already defined and ready in `shared/schema.ts`
- Session management is configured to use PostgreSQL via `connect-pg-simple`

### Authentication
- Currently implements a basic authentication flow
- User passwords should be hashed using bcrypt or argon2 before production use
- Session persistence is handled via localStorage on the client and PostgreSQL on the server

## Design System

The application follows a professional design system with:
- Consistent spacing and typography
- Clear information hierarchy
- Accessible components from Radix UI
- Custom design guidelines in `design_guidelines.md`

## Deployment

This application can be deployed to any Node.js hosting platform:

### Docker Deployment
1. Create a `Dockerfile` in the root:
   ```dockerfile
   FROM node:20-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build
   EXPOSE 5000
   CMD ["npm", "start"]
   ```

2. Build and run:
   ```bash
   docker build -t knowledge-base .
   docker run -p 5000:5000 --env-file .env knowledge-base
   ```

### Cloud Platforms
- **Heroku**: Supports Node.js apps with PostgreSQL add-on
- **Railway**: Easy deployment with PostgreSQL
- **Render**: Supports Node.js with managed PostgreSQL
- **AWS**: Deploy with Elastic Beanstalk or ECS
- **Google Cloud**: Deploy with Cloud Run or App Engine

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on the GitHub repository.

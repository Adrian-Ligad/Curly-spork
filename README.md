# Nurse Scheduler Application

A full-stack application for managing nurse schedules, built with React, TypeScript, GraphQL, and PostgreSQL.

## Project Structure

```
.
├── frontend/           # React TypeScript frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/      # Page components
│   │   ├── styles/     # Theme and styling
│   │   ├── graphql/    # GraphQL queries and mutations
│   │   └── utils/      # Utility functions
│   └── package.json
│
└── backend/           # Express GraphQL backend
    ├── src/
    │   ├── graphql/    # GraphQL schema and resolvers
    │   ├── models/     # Database models
    │   ├── services/   # Business logic
    │   └── utils/      # Utility functions
    ├── prisma/        # Prisma schema and migrations
    └── package.json
```

## Prerequisites

- Node.js (v14 or higher)
- Docker and Docker Compose
- npm or yarn

## Setup

### 1. Database Setup

First, start the PostgreSQL database using Docker:

```bash
# Start the PostgreSQL container
docker-compose up -d

# Verify the container is running
docker ps
```

The PostgreSQL instance will be available with these credentials:

- Host: localhost
- Port: 5432
- User: postgres
- Password: postgres
- Database: nurse_scheduler

Useful Docker commands:

```bash
# View container logs
docker-compose logs postgres

# Access PostgreSQL CLI
docker exec -it nurse-scheduler-db psql -U postgres -d nurse_scheduler

# Stop the container
docker-compose down

# Stop and remove all containers and volumes (will delete all data)
docker-compose down -v
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create a .env file with your DATABASE_URL
echo "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nurse_scheduler" > .env

# Run Prisma migrations
npx prisma migrate dev

# Start the development server
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install

# Create a .env file for development
echo "FAST_REFRESH=true
CHOKIDAR_USEPOLLING=true
REACT_APP_API_URL=http://localhost:4000/graphql" > .env

# Start the development server
npm start
```

## Development

- Backend runs on http://localhost:4000
- Frontend runs on http://localhost:3000
- GraphQL Playground available at http://localhost:4000/graphql
- Database GUI available via Prisma Studio: `npx prisma studio`

### Hot Reloading

The frontend includes hot reloading functionality:

- Components will update in-place when you make changes
- CSS changes are reflected immediately
- Error recovery with browser error display
- Console state preservation between reloads

## Features

- User authentication and authorization
- Nurse schedule management
- Staff overview and dashboard
- Calendar view for schedules
- User management interface

## Technologies Used

### Frontend

- React with TypeScript
- Material-UI (MUI)
- Styled Components
- Apollo Client
- React Router

### Backend

- Express.js
- Apollo Server
- Prisma ORM
- PostgreSQL (Docker)
- GraphQL

## License

MIT

# Issue Tracking System API

A robust backend API for managing issues with role-based access control, authentication, and real-time tracking capabilities.

## Live URL

> **Note:** Update this URL once deployed to production

```
https://your-deployment-url.com
```

## Features

- **User Authentication**: Secure signup and login with JWT tokens
- **Role-Based Access Control**: Support for contributor and maintainer roles
- **Issue Management**: Create, read, update, and delete issues
- **Issue Tracking**: Track issues by type (bug, feature request) and status (open, in progress, resolved)
- **CORS Support**: Cross-origin requests enabled for frontend integration
- **Error Handling**: Comprehensive error handling middleware with proper HTTP status codes
- **Password Security**: Passwords hashed using bcrypt with salt rounds

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js 5.2.1
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Middleware**: CORS, Express JSON parser

### Development Tools
- **Build Tool**: TypeScript Compiler (tsc)
- **Dev Server**: ts-node-dev with auto-restart
- **Type Checking**: TypeScript 6.0.3

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher recommended)
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Assignment-2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the root directory with the following variables:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/database_name
   JWT_SECRET=your-secret-key-here
   PORT=3000
   NODE_ENV=development
   ```

4. **Database Setup**
   
   Execute the following SQL commands to create the required tables:
   ```sql
   -- Create users table
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     email VARCHAR(255) UNIQUE NOT NULL,
     password VARCHAR(255) NOT NULL,
     role VARCHAR(50) DEFAULT 'contributor',
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- Create issues table
   CREATE TABLE issues (
     id SERIAL PRIMARY KEY,
     title VARCHAR(255) NOT NULL,
     description TEXT NOT NULL,
     type VARCHAR(50) NOT NULL,
     status VARCHAR(50) DEFAULT 'open',
     reporter_id INTEGER REFERENCES users(id),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```
   
   The server will start on `http://localhost:3000`

6. **Build for production**
   ```bash
   npm run build
   ```

7. **Start production server**
   ```bash
   npm start
   ```

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|-----------------|
| `POST` | `/signup` | Register a new user | Not required |
| `POST` | `/login` | Login user and receive JWT token | Not required |

### Issues Routes (`/api/issues`)

| Method | Endpoint | Description | Authentication | Role Required |
|--------|----------|-------------|-----------------|-----------------|
| `GET` | `/` | Get all issues | Not required | - |
| `GET` | `/:id` | Get a specific issue by ID | Not required | - |
| `POST` | `/` | Create a new issue | Required | Any (contributor/maintainer) |
| `PATCH` | `/:id` | Update an issue | Required | Any (contributor/maintainer) |
| `DELETE` | `/:id` | Delete an issue | Required | Maintainer only |

## Database Schema

### Users Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Unique user identifier |
| `name` | VARCHAR(255) | NOT NULL | User's full name |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | User's email address |
| `password` | VARCHAR(255) | NOT NULL | Hashed password (bcrypt) |
| `role` | VARCHAR(50) | DEFAULT 'contributor' | User role: `contributor` or `maintainer` |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Account creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

### Issues Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Unique issue identifier |
| `title` | VARCHAR(255) | NOT NULL | Issue title |
| `description` | TEXT | NOT NULL | Detailed description of the issue |
| `type` | VARCHAR(50) | NOT NULL | Issue type: `bug` or `feature_request` |
| `status` | VARCHAR(50) | DEFAULT 'open' | Issue status: `open`, `in_progress`, or `resolved` |
| `reporter_id` | INTEGER | REFERENCES users(id) | ID of the user who reported the issue |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Issue creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

## Project Structure

```
src/
├── app.ts                  # Express application setup
├── index.ts               # Server entry point
├── config/
│   └── db.ts             # PostgreSQL connection pool
├── interfaces/
│   ├── auth.interface.ts # User and authentication types
│   └── issues.interface.ts # Issue types
├── middleware/
│   ├── auth.middleware.ts        # JWT verification
│   ├── error.middleware.ts       # Error handling
│   ├── notFound.middleware.ts    # 404 handling
│   └── role.middleware.ts        # Role-based authorization
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts   # Auth request handlers
│   │   ├── auth.route.ts        # Auth routes
│   │   ├── auth.service.ts      # Auth business logic
│   │   └── auth.validation.ts   # Input validation schemas
│   └── issues/
│       ├── issues.controller.ts # Issue request handlers
│       ├── issues.repo.ts       # Database queries
│       ├── issues.route.ts      # Issue routes
│       ├── issues.service.ts    # Business logic
│       └── issues.validation.ts # Input validation schemas
├── types/
│   └── index.ts          # Global TypeScript types
└── utils/
    ├── AppError.ts       # Custom error class
    ├── bcrypt.ts         # Password hashing utilities
    ├── catchAsync.ts     # Async error wrapper
    ├── jwt.ts            # JWT utilities
    ├── response.ts       # Response formatting
    └── sendResponse.ts   # Standard response handler
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the `Authorization` header for protected routes:

```http
Authorization: Bearer <your-jwt-token>
```

## Error Handling

The API returns standardized error responses with appropriate HTTP status codes:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error message",
  "data": null
}
```

## License

ISC

## Author

Assignment-2 Project

---

**Last Updated**: May 2026

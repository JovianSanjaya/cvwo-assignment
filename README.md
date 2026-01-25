# SquAre - A Modern Forum Application

A full-stack forum application built with React, Go, and PostgreSQL. Features include topic discussions, voting, commenting, and user authentication.

## Features

- 🔐 User Authentication (Register/Login with JWT)
- 📝 Create and manage discussion topics
- 💬 Post and comment on discussions
- ⬆️ Upvote/downvote posts and comments
- 🔍 Search and sort functionality
- 👤 User profiles with consistent avatars
- 📱 Responsive design with modern UI
- 🎨 Framer Motion animations
- 🐳 Docker containerization

## Tech Stack

**Frontend:**
- React 18 with TypeScript
- Material-UI v5
- React Router v6
- Framer Motion
- Vite

**Backend:**
- Go 1.21
- Chi Router
- PostgreSQL 15
- JWT Authentication

## Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed

### Run the Application

```bash
# Clone the repository
git clone <repository-url>
cd cvwo-assignment

# Start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8080
```

The application will automatically:
- Set up PostgreSQL database
- Run database migrations
- Start the backend API server
- Build and serve the frontend

### Stop the Application

```bash
docker-compose down
```

To remove all data:
```bash
docker-compose down -v
```

## Manual Setup (Development)

### Backend Setup

```bash
cd backend

# Install dependencies
go mod download

# Set up environment variables
export DB_HOST=localhost
export DB_PORT=5432
export DB_USER=postgres
export DB_PASSWORD=postgres
export DB_NAME=cvwo_forum
export JWT_SECRET=your-secret-key

# Run PostgreSQL (if not using Docker)
# Make sure PostgreSQL is running on port 5432

# Run the server
go run main.go
```

Backend will run on http://localhost:8080

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will run on http://localhost:5173

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user (protected)

### Topics
- `GET /topics` - Get all topics
- `POST /topics` - Create topic (protected)
- `PUT /topics/:id` - Update topic (protected)
- `DELETE /topics/:id` - Delete topic (protected)

### Posts
- `GET /topics/:topicId/posts` - Get posts in topic
- `GET /posts/:id` - Get single post
- `POST /topics/:topicId/posts` - Create post (protected)
- `PUT /posts/:id` - Update post (protected)
- `DELETE /posts/:id` - Delete post (protected)

### Comments
- `GET /topics/:topicId/posts/:postId/comments` - Get comments
- `POST /topics/:topicId/posts/:postId/comments` - Create comment (protected)
- `PUT /comments/:id` - Update comment (protected)
- `DELETE /comments/:id` - Delete comment (protected)

### Voting
- `POST /posts/:id/vote` - Vote on post (protected)
- `POST /comments/:id/vote` - Vote on comment (protected)

## Project Structure

```
cvwo-assignment/
├── backend/
│   ├── db/              # Database connection
│   ├── handlers/        # API handlers
│   ├── middleware/      # Auth middleware
│   ├── models/          # Data models
│   ├── main.go          # Entry point
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── context/     # Auth context
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── theme/       # Theme configuration
│   │   └── utils/       # Utility functions
│   ├── Dockerfile
│   └── nginx.conf
└── docker-compose.yml
```

## Database Schema

### Users
- id, username (unique), password_hash, time_created

### Topics
- id, title, user_id, time_created

### Posts
- id, title, content, topic_id, user_id, time_created

### Comments
- id, content, post_id, user_id, time_created

### Votes
- id, post_id, comment_id, user_id, vote_type (+1/-1)

## Development Notes

### Environment Variables

**Backend (.env)**
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=cvwo_forum
JWT_SECRET=your-secret-key-change-in-production
```

### Building for Production

```bash
# Build all services
docker-compose build

# Run in production mode
docker-compose up -d
```

## Author

Jovian Sanjaya Putra (A0334772Y)

## Assignment

CVWO Winter Assignment 2025/2026
Computing for Voluntary Welfare Organisations (CVWO)
School of Computing, National University of Singapore

## License

This project is created for educational purposes as part of the CVWO assignment.

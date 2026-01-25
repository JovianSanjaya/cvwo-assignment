# SqUare - Forum Application

A full-stack forum application built with React, Go, and PostgreSQL.

## Author

Jovian Sanjaya Putra  
CVWO Winter Assignment 2025/2026  
School of Computing, National University of Singapore

## Features

- User authentication (register/login with JWT)
- Create and manage discussion topics
- Post and comment on discussions
- Upvote/downvote posts and comments
- Search and sort functionality
- User profiles with consistent avatars
- Responsive design with modern UI
- Docker containerization for easy deployment

## Tech Stack

**Frontend:** React 18, TypeScript, Material-UI, React Router, Framer Motion, Vite  
**Backend:** Go 1.21, Chi Router, PostgreSQL 15, JWT Authentication

## Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed

### Run the Application

```bash
# Clone the repository
git clone https://github.com/JovianSanjaya/cvwo-assignment.git
cd cvwo-assignment

# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8080
```


### Stop the Application

```bash
# Stop services
docker-compose down

# Remove all data
docker-compose down -v
```

## Google OAuth Setup

The application supports Google Sign-In for easier authentication.

### Backend Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure OAuth consent screen
6. Create OAuth Client ID:
   - Application type: **Web application**
   - Authorized JavaScript origins: `http://localhost:5173`, `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:5173`, `http://localhost:3000`
7. Copy the **Client ID**

### Environment Variables

Add to your environment (.env file or docker-compose.yml):

```bash
# Backend
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Frontend
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### For Docker

Update `docker-compose.yml` backend service:

```yaml
backend:
  environment:
    - GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

Update `docker-compose.yml` frontend service:

```yaml
frontend:
  build:
    args:
      - VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

Backend runs on http://localhost:8080

Frontend runs on http://localhost:3000

Database runs on http://localhost:5433

## API Endpoints

Authentication:
- POST /auth/register - Register new user
- POST /auth/login - Login user
- POST /auth/google - Login/register with Google OAuth
- GET /auth/me - Get current user (protected)

Topics:
- GET /topics - Get all topics
- POST /topics - Create topic (protected)
- PUT /topics/:id - Update topic (protected)
- DELETE /topics/:id - Delete topic (protected)

Posts:
- GET /topics/:topicId/posts - Get posts in topic
- GET /posts/:id - Get single post
- POST /topics/:topicId/posts - Create post (protected)
- PUT /posts/:id - Update post (protected)
- DELETE /posts/:id - Delete post (protected)

Comments:
- GET /topics/:topicId/posts/:postId/comments - Get comments
- POST /topics/:topicId/posts/:postId/comments - Create comment (protected)
- PUT /comments/:id - Update comment (protected)
- DELETE /comments/:id - Delete comment (protected)

Voting:
- POST /posts/:id/vote - Vote on post (protected)
- POST /comments/:id/vote - Vote on comment (protected)

## Project Structure

```
cvwo-assignment/
├── backend/
│   ├── db/              # Database connection
│   ├── handlers/        # API handlers
│   ├── middleware/      # Authentication middleware
│   ├── models/          # Data models
│   ├── main.go          # Application entry point
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── context/     # Authentication context
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── theme/       # Theme configuration
│   │   └── utils/       # Utility functions
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
└── start.sh
```

## Database Schema

- Users: id, username (unique), password_hash, time_created
- Topics: id, title, user_id, time_created
- Posts: id, title, content, topic_id, user_id, time_created
- Comments: id, content, post_id, user_id, time_created
- Votes: id, post_id, comment_id, user_id, vote_type (1=upvote, -1=downvote, 0=remove)

## AI Usage Declaration




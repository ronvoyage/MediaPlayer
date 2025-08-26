# API Documentation

## Overview
This document describes the RESTful API endpoints for the MediaPlayer backend service.

**Base URL**: `http://localhost:3201/api/v1`

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Endpoints

### Authentication
#### POST /auth/register
Register a new user account.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "displayName": "John Doe"
}
```

**Response**:
```json
{
  "success": true,
  "user": {
    "id": "user123",
    "email": "user@example.com",
    "displayName": "John Doe"
  },
  "token": "jwt_token_here"
}
```

#### POST /auth/login
Authenticate user and get access token.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

#### POST /auth/logout
Logout current user (requires authentication).

#### POST /auth/refresh
Refresh authentication token.

### User Management
#### GET /users/profile
Get current user profile (requires authentication).

#### PUT /users/profile
Update user profile (requires authentication).

#### GET /users/preferences
Get user preferences (requires authentication).

#### PUT /users/preferences
Update user preferences (requires authentication).

### Media Library
#### GET /media
Get user's media library (requires authentication).

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `search`: Search query
- `sort`: Sort field (title, artist, date)
- `order`: Sort order (asc, desc)

#### POST /media
Add media to library (requires authentication).

#### GET /media/:id
Get specific media item (requires authentication).

#### PUT /media/:id
Update media item (requires authentication).

#### DELETE /media/:id
Remove media from library (requires authentication).

### Playlists
#### GET /playlists
Get user's playlists (requires authentication).

#### POST /playlists
Create new playlist (requires authentication).

#### GET /playlists/:id
Get specific playlist (requires authentication).

#### PUT /playlists/:id
Update playlist (requires authentication).

#### DELETE /playlists/:id
Delete playlist (requires authentication).

#### POST /playlists/:id/items
Add item to playlist (requires authentication).

#### DELETE /playlists/:id/items/:itemId
Remove item from playlist (requires authentication).

### External Media
#### GET /external/youtube/search
Search YouTube for videos.

**Query Parameters**:
- `q`: Search query (required)
- `maxResults`: Maximum results (default: 25)

#### GET /external/vimeo/search
Search Vimeo for videos.

### AI Features
#### GET /ai/recommendations
Get personalized recommendations (requires authentication).

#### POST /ai/subtitles
Generate subtitles for video (requires authentication).

#### POST /ai/enhance
Enhance audio/video quality (requires authentication).

### Admin
#### GET /admin/users
Get all users (requires admin role).

#### GET /admin/analytics
Get usage analytics (requires admin role).

#### POST /admin/users/:id/suspend
Suspend user account (requires admin role).

## Error Responses
All endpoints return standardized error responses:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    }
  }
}
```

### Error Codes
- `VALIDATION_ERROR`: Input validation failed
- `AUTHENTICATION_ERROR`: Invalid or missing authentication
- `AUTHORIZATION_ERROR`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INTERNAL_ERROR`: Server error

## Rate Limiting
- General API: 100 requests per minute per user
- Search endpoints: 50 requests per minute per user
- Authentication: 10 requests per minute per IP

## Pagination
List endpoints support pagination:

**Request**:
```
GET /media?page=2&limit=20
```

**Response**:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": true
  }
}
```

---

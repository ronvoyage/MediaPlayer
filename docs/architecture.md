# Architecture Document

## Overview
This document describes the technical architecture for the MediaPlayer web application, a modern React-based media player with AI-powered features.

## Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **UI Library**: Material UI (MUI) v5
- **Animation**: Framer Motion
- **State Management**: Redux Toolkit + RTK Query
- **Routing**: React Router v6
- **Internationalization**: i18next + react-i18next
- **Media Player**: Video.js or React Player
- **File Handling**: File System Access API (where supported)
- **Build Tool**: Vite
- **Testing**: Jest + React Testing Library + Playwright
- **Linting**: ESLint + Prettier

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **File Storage**: Firebase Storage
- **Real-time**: WebSockets (Socket.io)
- **API Documentation**: Swagger/OpenAPI
- **Testing**: Jest + Supertest + Firebase Emulators

### Cloud Services
- **Primary Cloud**: Firebase (Google Cloud)
  - Authentication (email, social logins)
  - Firestore (user data, playlists, metadata)
  - Storage (media files, avatars)
  - Analytics
  - Hosting (optional)
- **AI Services**: 
  - Google Cloud AI Platform
  - OpenAI API (for recommendations)
  - Google Cloud Speech-to-Text
  - Google Cloud Translation API

### External APIs
- **YouTube API v3**: Search and metadata
- **Vimeo API**: Search and playback
- **Last.fm API**: Music metadata and recommendations
- **Spotify Web API**: Additional music data (optional)

## System Architecture

### High-Level Architecture
```
[Frontend (React)] ↔ [Backend API (Express)] ↔ [Firebase Services]
                                             ↔ [External APIs]
                                             ↔ [AI Services]
```

### Directory Structure
```
/
├── docs/                    # Documentation
├── scripts/                 # Setup and deployment scripts
├── assets/                  # Static assets (logos, images)
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   ├── store/          # Redux store
│   │   ├── services/       # API services
│   │   ├── utils/          # Utility functions
│   │   ├── locales/        # i18n translations
│   │   └── theme/          # MUI theme configuration
│   ├── public/
│   └── package.json
└── backend/                # Node.js API
    ├── src/
    │   ├── routes/         # API routes
    │   ├── middleware/     # Express middleware
    │   ├── services/       # Business logic
    │   ├── models/         # Data models
    │   ├── utils/          # Utility functions
    │   └── config/         # Configuration
    ├── tests/
    └── package.json
```

## Core Components

### Frontend Components
- **Player Component**: Main media player (minimized/maximized modes)
- **Library Component**: Media library with local and web sources
- **Auth Components**: Login, register, profile management
- **Playlist Components**: Create, edit, manage playlists
- **Admin Dashboard**: User management, analytics, moderation
- **Settings Component**: User preferences and configuration
- **Theme Provider**: Light/dark theme management
- **Language Selector**: i18n language switching
- **AI Features**: Recommendations, voice commands, visual search

### Backend Services
- **Auth Service**: User authentication and authorization
- **Media Service**: File handling and metadata extraction
- **Playlist Service**: Playlist CRUD operations
- **Admin Service**: Admin dashboard functionality
- **AI Service**: Integration with AI APIs
- **Analytics Service**: Usage tracking and reporting
- **External API Service**: YouTube/Vimeo integration

## Data Models

### User Model
```typescript
interface User {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  preferences: UserPreferences;
  createdAt: Date;
  lastLoginAt: Date;
  isAdmin: boolean;
}

interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  audioQuality: 'low' | 'medium' | 'high';
  videoQuality: '480p' | '720p' | '1080p' | 'auto';
  autoplay: boolean;
  volume: number;
}
```

### Media Model
```typescript
interface MediaItem {
  id: string;
  title: string;
  artist?: string;
  album?: string;
  duration: number;
  format: string;
  source: 'local' | 'youtube' | 'vimeo';
  url: string;
  thumbnail?: string;
  metadata: MediaMetadata;
  addedAt: Date;
  userId: string;
}
```

### Playlist Model
```typescript
interface Playlist {
  id: string;
  name: string;
  description?: string;
  userId: string;
  items: string[]; // MediaItem IDs
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## Data Flow

### Authentication Flow
1. User submits credentials via frontend
2. Frontend calls backend auth endpoint
3. Backend validates with Firebase Auth
4. Firebase returns JWT token
5. Token stored in frontend (secure cookie/localStorage)
6. Token included in subsequent API requests

### Media Playback Flow
1. User selects media from library
2. Frontend requests media URL from backend
3. Backend validates permissions and returns playback URL
4. Frontend initializes player with media URL
5. Playback events tracked for analytics

### AI Recommendations Flow
1. User playback data collected
2. Backend processes listening patterns
3. AI service generates recommendations
4. Recommendations cached and returned to frontend
5. User feedback improves future recommendations

## Security Architecture

### Authentication & Authorization
- Firebase Auth for user management
- JWT tokens for API authentication
- Role-based access control (user, admin)
- OAuth2 for social logins
- Session management and token refresh

### Data Protection
- HTTPS enforcement (TLS 1.3)
- Data encryption at rest (Firebase default)
- Data encryption in transit
- Input validation and sanitization
- XSS and CSRF protection
- Rate limiting and DDoS protection

### Privacy & GDPR Compliance
- Data minimization principles
- User consent management
- Right to data portability
- Right to be forgotten (data deletion)
- Privacy policy and terms of service
- Cookie consent management
- Data retention policies

## Performance & Scalability

### Frontend Optimization
- Code splitting and lazy loading
- Image and video optimization
- CDN for static assets
- Service worker for caching
- Progressive Web App (PWA) features
- Bundle size optimization

### Backend Scalability
- Firebase auto-scaling
- Caching strategies (Redis/Firebase)
- Database indexing optimization
- API response compression
- Connection pooling
- Load balancing (Firebase handles)

### Media Streaming
- Adaptive bitrate streaming
- Progressive download
- Thumbnail generation
- Video transcoding (future)
- CDN for media delivery

## Development Phases

### Phase 0: Infrastructure & Design Foundation
**Purpose**: Establish project foundation and obtain design approval before core development

**Components**:
- Basic React + TypeScript + Vite setup
- Material UI v5 with custom theme configuration
- Framer Motion integration for animations
- Basic Node.js + Express backend structure
- Design showcase application with theme switching
- Interactive logo with hover animations
- Comprehensive UI component library preview

**Deliverables**:
- Functional design approval screen
- Complete theme system (light/dark)
- Animated logo implementation
- Responsive design demonstration
- Component library showcase
- Stakeholder approval documentation

**Approval Gates**:
- Visual design meets aesthetic requirements
- Theme switching functionality works correctly
- Logo animations are engaging and professional
- Responsive design functions across all target devices
- Overall user experience aligns with project goals

**Critical Path**: No Epic 1+ development begins without Phase 0 approval
- Local development with hot reload
- Environment variables management
- Database seeding and migrations
- API documentation (Swagger)
- Code quality tools (ESLint, Prettier)

### CI/CD Pipeline
- GitHub Actions for automation
- Automated testing (unit, integration, e2e)
- Code coverage reporting
- Security scanning
- Automated deployment to staging/production

### Monitoring & Analytics
- Firebase Analytics for user behavior
- Error tracking (Sentry or similar)
- Performance monitoring
- API response time tracking
- User feedback collection

## AI Integration Architecture

### Recommendation Engine
- Collaborative filtering
- Content-based filtering
- Hybrid recommendation approach
- Real-time preference learning
- A/B testing for algorithm improvement

### Voice Commands
- Speech recognition API integration
- Natural language processing
- Command parsing and execution
- Offline voice command support (future)

### Content Enhancement
- Automatic subtitle generation
- Audio enhancement processing
- Video quality improvement
- Noise reduction algorithms
- Content analysis and tagging

---

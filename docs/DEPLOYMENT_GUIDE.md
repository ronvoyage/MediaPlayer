# Deployment Guide

## Overview
This guide covers deployment of the MediaPlayer application to production environments.

## Prerequisites
- Firebase project setup
- Domain name (optional but recommended)
- SSL certificate (Firebase Hosting provides this)

## Environment Configuration

### Production Environment Variables

#### Frontend (.env.production)
```env
REACT_APP_API_URL=https://your-api-domain.com/api/v1
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123
REACT_APP_YOUTUBE_API_KEY=your_youtube_api_key
REACT_APP_VIMEO_API_KEY=your_vimeo_api_key
```

#### Backend (.env.production)
```env
NODE_ENV=production
PORT=3201
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
JWT_SECRET=your-super-secret-jwt-key
YOUTUBE_API_KEY=your_youtube_api_key
VIMEO_API_KEY=your_vimeo_api_key
OPENAI_API_KEY=your_openai_api_key
CORS_ORIGIN=https://your-frontend-domain.com
```

## Deployment Options

### Option 1: Firebase Hosting (Recommended)

#### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
```

#### 2. Login to Firebase
```bash
firebase login
```

#### 3. Initialize Firebase
```bash
firebase init
```
Select:
- Hosting
- Functions (for backend)
- Firestore
- Storage

#### 4. Deploy Frontend
```bash
cd frontend
npm run build
firebase deploy --only hosting
```

#### 5. Deploy Backend as Firebase Functions
```bash
cd backend
npm run build
firebase deploy --only functions
```

### Option 2: Traditional Hosting

#### Frontend Deployment (Static Hosting)
1. Build the app:
```bash
cd frontend
npm run build
```

2. Upload `build/` folder to your hosting provider (Netlify, Vercel, etc.)

#### Backend Deployment (Node.js Hosting)
1. Choose a Node.js hosting provider (Heroku, DigitalOcean, AWS EC2)
2. Set up environment variables
3. Deploy backend code
4. Ensure Node.js 18+ is supported

### Option 3: Docker Deployment

#### Dockerfile (Frontend)
```dockerfile
# frontend/Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Dockerfile (Backend)
```dockerfile
# backend/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3201
CMD ["npm", "start"]
```

#### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3200:80"
    environment:
      - REACT_APP_API_URL=http://localhost:3201/api/v1

  backend:
    build: ./backend
    ports:
      - "3201:3201"
    environment:
      - NODE_ENV=production
      - PORT=3201
    env_file:
      - backend/.env.production
```

## Database Setup

### Firebase Firestore
1. Set up security rules in Firebase Console
2. Create indexes for query performance
3. Import initial data if needed

### Security Rules Example
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Playlists are private to users
    match /playlists/{playlistId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Media items are private to users
    match /media/{mediaId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

## CI/CD Pipeline

### GitHub Actions Example
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm test

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Install dependencies
        run: cd frontend && npm ci
      - name: Build
        run: cd frontend && npm run build
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: your-project-id

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Deploy to Firebase Functions
        run: |
          cd backend
          npm ci
          npx firebase deploy --only functions
```

## Performance Optimization

### Frontend Optimizations
- Enable gzip compression
- Set up CDN for static assets
- Implement service worker for caching
- Optimize images and media files
- Use code splitting and lazy loading

### Backend Optimizations
- Enable compression middleware
- Implement Redis caching
- Optimize database queries
- Use connection pooling
- Set up monitoring and logging

## Monitoring and Analytics

### Firebase Analytics
- Set up Google Analytics 4
- Track user engagement events
- Monitor performance metrics

### Error Tracking
- Set up Sentry or similar service
- Monitor error rates and performance
- Set up alerting for critical issues

### Health Checks
```javascript
// Backend health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  });
});
```

## Security Checklist

- [ ] HTTPS enabled (SSL certificate)
- [ ] Environment variables secured
- [ ] Firebase security rules configured
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] XSS and CSRF protection enabled
- [ ] Dependencies updated and scanned for vulnerabilities
- [ ] Authentication tokens properly secured
- [ ] Database access restricted

## Rollback Strategy

### Quick Rollback Steps
1. Keep previous version builds
2. Use Firebase Hosting version management
3. Maintain database migration scripts
4. Document rollback procedures
5. Test rollback process in staging

### Version Management
```bash
# Firebase Hosting versions
firebase hosting:releases:list
firebase hosting:releases:rollback
```

## Support and Maintenance

### Regular Tasks
- Monitor error logs and performance
- Update dependencies monthly
- Review and rotate API keys quarterly
- Backup database regularly
- Test disaster recovery procedures

### Emergency Contacts
- Firebase Support
- Domain/SSL provider
- Hosting provider support
- Development team contacts

---

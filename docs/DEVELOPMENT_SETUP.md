# Development Setup Guide

## Prerequisites

### Required Software
- **Node.js** 18+ (LTS recommended)
- **npm** 9+ (comes with Node.js)
- **Git** for version control
- **VS Code** (recommended IDE)

### Optional but Recommended
- **Firebase CLI** for deployment
- **Postman** or similar for API testing

## Environment Setup

### 1. Clone Repository
```bash
git clone https://github.com/ronlederer/MediaPlayer.git
cd MediaPlayer
```

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your configuration
npm run dev
```

### 3. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your Firebase and API keys
npm run dev
```

### 4. Firebase Configuration
1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Authentication, Firestore, and Storage
3. Download service account key
4. Configure environment variables

### 5. External API Keys
- **YouTube API**: Get from Google Cloud Console
- **Vimeo API**: Get from Vimeo Developer Portal
- **OpenAI API**: For AI features (optional)

## Development Workflow

### Code Style
- Use Prettier for formatting
- Use ESLint for linting
- Follow TypeScript best practices
- Write unit tests for new features

### Git Workflow
1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -m "feat: add new feature"`
3. Push branch: `git push origin feature/your-feature`
4. Create Pull Request

### Testing
```bash
# Frontend tests
cd frontend && npm test

# Backend tests
cd backend && npm test

# E2E tests
npm run test:e2e
```

## Troubleshooting

### Common Issues
1. **Port conflicts**: Ensure ports 3200-3210 are available
2. **Firebase permissions**: Check IAM roles and API enablement
3. **Node version**: Use Node 18+ (check with `node --version`)
4. **CORS issues**: Configure backend CORS settings properly

### Windows-Specific
- Use PowerShell or Command Prompt as Administrator if needed
- Ensure Windows Defender doesn't block Node.js
- Use `npm run clean` if facing cache issues

## Additional Resources
- [React Documentation](https://reactjs.org/docs)
- [Material UI Documentation](https://mui.com/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

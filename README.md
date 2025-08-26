# MediaPlayer

A modern, AI-powered web media player built with React and advanced technologies. Supports local and web-based media with intelligent features, user management, and multi-language support.

## 🚀 Features

- **Universal Media Support**: Play audio/video from local files, YouTube, and Vimeo
- **Modern UI**: Material UI with Framer Motion animations, light/dark themes
- **AI-Powered**: Smart recommendations, auto-subtitles, voice commands, visual search
- **User Management**: Authentication, profiles, playlists, favorites
- **Admin Dashboard**: User management, analytics, content moderation
- **Multi-Language**: Support for 7+ languages including Hebrew, Portuguese, Chinese
- **Security & Privacy**: GDPR compliant, encrypted data, secure authentication

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Material UI, Framer Motion
- **Backend**: Node.js, Express, Firebase
- **Authentication**: Firebase Auth (email, social logins)
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **AI Services**: Google Cloud AI, OpenAI
- **Languages**: i18next for internationalization

## 📁 Project Structure

```
MediaPlayer/
├── docs/                    # Documentation
├── scripts/                 # Setup and deployment scripts
├── assets/                  # Static assets (logos, images)
├── frontend/               # React application
├── backend/                # Node.js API server
├── README.md
├── LICENSE
└── ...other config files
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Firebase account (for backend services)
- YouTube/Vimeo API keys (for web media integration)

### Phase 0: Design Foundation Setup
**Important**: This project follows a phased approach starting with design approval.

**Phase 0 Setup** (Design showcase and approval):
```bash
# Use the automated setup script
.\scripts\quickstart.bat

# Or manual setup:
cd frontend && npm install
cd ../backend && npm install
npm run dev:phase0
```

This will start a design showcase application at `http://localhost:3200` where you can:
- Review light and dark themes
- Test the animated logo
- Explore the UI component library
- Validate responsive design
- Approve the overall design direction

**⚠️ Development Note**: Core application features (media player, authentication, etc.) will only be developed after Phase 0 design approval is obtained.

### Full Development Setup
After Phase 0 approval, proceed with full setup:

**Windows Users**: Use the automated setup script:
```bash
.\scripts\quickstart.bat
```

**Manual Setup**:
1. Clone the repository
2. Install frontend dependencies: `cd frontend && npm install`
3. Install backend dependencies: `cd backend && npm install`
4. Configure environment variables (see `.env.example`)
5. Start backend: `cd backend && npm run start` (port 3201)
6. Start frontend: `cd frontend && npm run start` (port 3200)

The application will be available at `http://localhost:3200`

## 📖 Documentation

- [Product Requirements Document (PRD)](docs/PRD.md)
- [Architecture Document](docs/architecture.md)
- [Epics, Stories & Tasks](docs/epics_stories_tasks.md)
- [Development Guidelines](docs/COPILOT_GUIDELINES.md)

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md).

## 🔒 Security

Please report security vulnerabilities responsibly. See our [Security Policy](SECURITY.md) for details.

## 🧪 Testing

### Test Coverage Requirements
- **Frontend**: 85% minimum coverage
- **Backend**: 90% minimum coverage
- **E2E**: All critical user journeys covered

### Running Tests
```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# All tests with coverage
npm run test:coverage

# Performance tests
npm run test:performance

# Accessibility tests
npm run test:a11y
```

### Testing Strategy
- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Jest + Supertest + Firebase Emulators
- **E2E Tests**: Playwright (cross-browser)
- **Visual Regression**: Playwright visual comparisons
- **Performance**: Lighthouse CI
- **Accessibility**: Jest-axe + Pa11y

See [Testing Strategy](docs/TESTING_STRATEGY.md) for detailed information.

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Ron Lederer** - Project Owner & Lead Developer

---

Built with ❤️ using modern web technologies and AI-powered features.

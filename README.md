# Smart Life & Work Manager 🚀

A comprehensive life management application built with modern web technologies, designed to help users manage tasks, goals, health, finances, and personal development in one integrated platform.

## 🌟 Features

### Core Functionality
- **Task Management** - Create, organize, and track tasks with priorities and deadlines
- **Goal Setting** - Set and monitor progress towards personal and professional goals
- **Health Tracking** - Monitor workouts, meals, and health metrics
- **Financial Management** - Track expenses, income, budgets, and financial goals
- **Work Organization** - Manage projects, meetings, and work notes
- **Learning Tracker** - Track courses, books, and learning progress
- **Life Enhancement** - Vision boards, bucket lists, and personal development tools

### Technical Features
- **Multi-language Support** - English and Traditional Chinese (繁體中文)
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Real-time Updates** - Live data synchronization across devices
- **Data Visualization** - Interactive charts and progress tracking
- **Offline Support** - Basic functionality when internet is unavailable
- **Dark/Light Themes** - Customizable user interface themes

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Material-UI (MUI)** - Professional UI component library
- **Redux Toolkit** - State management with RTK Query
- **React Router** - Client-side routing
- **Chart.js & Recharts** - Data visualization
- **i18next** - Internationalization

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication and authorization
- **Passport.js** - OAuth integration (Google, Facebook)

### Development Tools
- **ESLint & Prettier** - Code quality and formatting
- **Hot Reload** - Fast development experience
- **Environment Configuration** - Flexible deployment settings
- **Docker Support** - Containerized deployment

## 📁 Project Structure

```
smart-life-manager/
├── client/                          # React frontend
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── layout/             # Layout components
│   │   │   ├── forms/              # Form components
│   │   │   ├── charts/             # Chart components
│   │   │   └── ui/                 # Basic UI elements
│   │   ├── pages/                  # Main application pages
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── contexts/               # React contexts
│   │   ├── store/                  # Redux store and slices
│   │   ├── services/               # API services
│   │   ├── utils/                  # Utility functions
│   │   ├── styles/                 # Global styles
│   │   └── i18n/                  # Internationalization
│   ├── package.json
│   └── README.md
├── server/                          # Express.js backend
│   ├── src/
│   │   ├── config/                 # Configuration files
│   │   ├── controllers/            # Route controllers
│   │   ├── models/                 # Mongoose models
│   │   ├── routes/                 # API routes
│   │   ├── middlewares/            # Custom middleware
│   │   ├── utils/                  # Utility functions
│   │   └── app.js                  # Main server file
│   ├── package.json
│   └── README.md
├── docs/                           # Documentation
│   ├── api/                        # API documentation
│   ├── database/                   # Database schemas
│   ├── deployment/                 # Deployment guides
│   └── tutorials/                  # Learning tutorials
├── docker-compose.yml              # Docker configuration
├── .env.example                    # Environment variables template
└── README.md                       # This file
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and **npm** 9+
- **MongoDB** 6+ (local or cloud)
- **Git** for version control

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/smart-life-manager.git
cd smart-life-manager
```

### 2. Install Dependencies

#### Frontend
```bash
cd client
npm install
```

#### Backend
```bash
cd server
npm install
```

### 3. Environment Setup

#### Frontend (.env)
```bash
cd client
cp .env.example .env
```

Edit `.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENVIRONMENT=development
```

#### Backend (.env)
```bash
cd server
cp .env.example .env
```

Edit `.env`:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-life-manager
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:3000
```

### 4. Start MongoDB
```bash
# Local MongoDB
mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 5. Run the Application

#### Development Mode
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm start
```

#### Production Mode
```bash
# Build frontend
cd client
npm run build

# Start backend
cd server
npm start
```

### 6. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api/docs

## 🐳 Docker Deployment

### Using Docker Compose
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Docker Build
```bash
# Build frontend
docker build -t smart-life-manager-client ./client

# Build backend
docker build -t smart-life-manager-server ./server

# Run containers
docker run -d -p 3000:3000 smart-life-manager-client
docker run -d -p 5000:5000 smart-life-manager-server
```

## 📚 Learning Resources

### For Beginners

#### React & Frontend
- [React Official Tutorial](https://react.dev/learn) - Start here for React basics
- [Material-UI Documentation](https://mui.com/material-ui/getting-started/) - UI component library
- [Redux Toolkit Guide](https://redux-toolkit.js.org/introduction/getting-started) - State management
- [React Router Tutorial](https://reactrouter.com/en/main/start/tutorial) - Client-side routing

#### Node.js & Backend
- [Node.js Getting Started](https://nodejs.org/en/learn/getting-started/introduction-to-nodejs) - Node.js basics
- [Express.js Guide](https://expressjs.com/en/guide/routing.html) - Web framework
- [MongoDB University](https://university.mongodb.com/) - Free MongoDB courses
- [JWT.io](https://jwt.io/introduction) - Authentication tokens

#### General Web Development
- [MDN Web Docs](https://developer.mozilla.org/) - Comprehensive web development reference
- [JavaScript.info](https://javascript.info/) - Modern JavaScript tutorial
- [CSS-Tricks](https://css-tricks.com/) - CSS and design resources

### For Intermediate Developers

#### Advanced React
- [React Patterns](https://reactpatterns.com/) - Common React patterns
- [Kent C. Dodds Blog](https://kentcdodds.com/blog) - React best practices
- [React Performance](https://react.dev/learn/render-and-commit) - Performance optimization

#### Backend Architecture
- [Node.js Design Patterns](https://github.com/nodejs/node/wiki/Design-Patterns) - Backend patterns
- [MongoDB Best Practices](https://docs.mongodb.com/manual/core/data-modeling-introduction/) - Database design
- [REST API Design](https://restfulapi.net/) - API design principles

#### DevOps & Deployment
- [Docker Tutorial](https://docs.docker.com/get-started/) - Container basics
- [GitHub Actions](https://docs.github.com/en/actions) - CI/CD automation
- [Heroku Deployment](https://devcenter.heroku.com/) - Cloud deployment

### For Advanced Developers

#### Performance & Optimization
- [React Profiler](https://react.dev/reference/react/Profiler) - Performance analysis
- [MongoDB Performance](https://docs.mongodb.com/manual/core/performance/) - Database optimization
- [Web Vitals](https://web.dev/vitals/) - Core web metrics

#### Security
- [OWASP Top 10](https://owasp.org/www-project-top-ten/) - Security best practices
- [JWT Security](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/) - Token security
- [MongoDB Security](https://docs.mongodb.com/manual/security/) - Database security

## 🔧 Development Workflow

### Adding New Features

#### 1. Create Feature Branch
```bash
git checkout -b feature/new-feature-name
```

#### 2. Frontend Development
```bash
cd client
# Create new components in src/components/
# Create new pages in src/pages/
# Add Redux slices in src/store/slices/
# Update routing in src/App.js
```

#### 3. Backend Development
```bash
cd server
# Create new models in src/models/
# Create new controllers in src/controllers/
# Add new routes in src/routes/
# Update main app.js
```

#### 4. Testing
```bash
# Frontend tests
cd client
npm test

# Backend tests
cd server
npm test
```

#### 5. Commit and Push
```bash
git add .
git commit -m "feat: add new feature description"
git push origin feature/new-feature-name
```

### Code Quality Standards

#### ESLint Configuration
```json
{
  "extends": [
    "react-app",
    "react-app/jest",
    "prettier"
  ],
  "rules": {
    "no-console": "warn",
    "prefer-const": "error",
    "no-unused-vars": "error"
  }
}
```

#### Prettier Configuration
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

## 🧪 Testing

### Frontend Testing
```bash
cd client
npm test                    # Run all tests
npm test -- --watch        # Watch mode
npm test -- --coverage     # Coverage report
```

### Backend Testing
```bash
cd server
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # Coverage report
```

### API Testing
```bash
# Using Postman or similar tool
# Import the Postman collection from docs/api/
```

## 📊 Database Schema

### Core Collections
- **Users** - User accounts and profiles
- **Tasks** - Task management and tracking
- **Goals** - Goal setting and progress
- **Workouts** - Health and fitness tracking
- **Expenses** - Financial expense tracking
- **Projects** - Work project management

### Relationships
- Users have many Tasks, Goals, Workouts, etc.
- Tasks can have Subtasks and Attachments
- Goals have Milestones and Progress tracking
- All entities support Tags and Categories

## 🌐 Internationalization

### Supported Languages
- **English (en)** - Default language
- **Traditional Chinese (zh-Hant)** - 繁體中文

### Adding New Languages
1. Create translation file in `client/src/i18n/locales/`
2. Update language configuration in `client/src/i18n/index.js`
3. Add language selector in UI components

## 🚀 Deployment

### Environment Variables
```env
# Production
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=production-jwt-secret
CLIENT_URL=https://yourdomain.com
```

### Build Commands
```bash
# Frontend build
cd client
npm run build

# Backend build
cd server
npm run build
```

### Deployment Platforms
- **Heroku** - Easy cloud deployment
- **Vercel** - Frontend deployment
- **DigitalOcean** - VPS deployment
- **AWS** - Enterprise deployment

## 🤝 Contributing

### How to Contribute
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Contribution Guidelines
- Follow the existing code style
- Add comments for complex logic
- Update documentation as needed
- Test your changes thoroughly
- Use conventional commit messages

### Commit Message Format
```
type(scope): description

Examples:
feat(auth): add Google OAuth login
fix(tasks): resolve task completion bug
docs(readme): update installation instructions
style(ui): improve button component styling
refactor(store): simplify Redux slice structure
test(auth): add authentication test cases
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing frontend framework
- **Material-UI Team** - For the beautiful component library
- **MongoDB Team** - For the flexible database
- **Express.js Team** - For the robust backend framework
- **Open Source Community** - For all the amazing tools and libraries

## 📞 Support

### Getting Help
- **Issues**: [GitHub Issues](https://github.com/yourusername/smart-life-manager/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/smart-life-manager/discussions)
- **Documentation**: [Project Wiki](https://github.com/yourusername/smart-life-manager/wiki)

### Community
- **Discord**: Join our community server
- **Twitter**: Follow for updates and tips
- **Blog**: Read our development blog

---

**Made with ❤️ by the Smart Life Manager Team**

*Empowering people to live their best lives through intelligent organization and tracking.*

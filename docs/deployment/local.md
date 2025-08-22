# Local Development Deployment Guide 🚀

This guide will walk you through setting up the Smart Life Manager application on your local machine for development.

## Prerequisites

Before starting, ensure you have the following installed:

### Required Software
- **Node.js** 18.0.0 or higher
- **npm** 8.0.0 or higher (comes with Node.js)
- **Git** for version control
- **MongoDB** 5.0 or higher

### Optional Software
- **Docker** for containerized development
- **VS Code** for enhanced development experience
- **Postman** for API testing
- **MongoDB Compass** for database management

## Quick Start

### 1. Clone the Repository
```bash
# Clone your forked repository
git clone https://github.com/YOUR_USERNAME/smart-life-manager.git
cd smart-life-manager

# Add upstream remote for updates
git remote add upstream https://github.com/ORIGINAL_OWNER/smart-life-manager.git
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install

# Return to root directory
cd ..
```

### 3. Environment Setup
```bash
# Create environment files
cp .env.example .env
cp client/.env.example client/.env
cp server/.env.example server/.env
```

### 4. Configure Environment Variables

#### Root `.env` (if needed)
```env
NODE_ENV=development
```

#### Client `.env`
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENVIRONMENT=development
REACT_APP_VERSION=1.0.0
```

#### Server `.env`
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-life-manager-dev
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=24h
CLIENT_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 5. Start MongoDB

#### Option A: Local MongoDB Installation
```bash
# Start MongoDB service
mongod

# Or on macOS with Homebrew
brew services start mongodb-community

# Or on Windows
net start MongoDB
```

#### Option B: Docker MongoDB
```bash
# Pull and run MongoDB container
docker run -d \
  --name mongodb-dev \
  -p 27017:27017 \
  -e MONGO_INITDB_DATABASE=smart-life-manager-dev \
  mongo:latest

# Verify container is running
docker ps
```

### 6. Run the Application

#### Terminal 1: Backend Server
```bash
cd server
npm run dev
```

Expected output:
```
✅ MongoDB Connected: localhost
📊 Database: smart-life-manager-dev
🔌 Port: 27017
🎉 Mongoose connected to MongoDB
🚀 Server running on port 5000
📝 Environment: development
🔒 JWT Secret: configured
🌐 CORS Origin: http://localhost:3000
```

#### Terminal 2: Frontend Development Server
```bash
cd client
npm start
```

Expected output:
```
Compiled successfully!

You can now view smart-life-manager in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.1.100:3000

Note that the development build is not optimized.
To create a production build, use npm run build.
```

### 7. Verify Installation

#### Backend Health Check
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2023-09-06T10:30:00.000Z",
  "uptime": "00:05:23",
  "environment": "development",
  "database": "connected"
}
```

#### Frontend Access
Open your browser and navigate to `http://localhost:3000`

You should see the Smart Life Manager application with:
- Login/Register forms
- Navigation menu
- Dashboard layout

## Development Workflow

### 1. Code Changes
- Make changes to your code
- Frontend will auto-reload on save
- Backend will restart on file changes (with nodemon)

### 2. Database Changes
- Modify models in `server/src/models/`
- Restart the backend server
- Check MongoDB Compass for data visualization

### 3. API Testing
- Use Postman or similar tool
- Test endpoints at `http://localhost:5000/api/*`
- Include JWT token in Authorization header

### 4. Frontend Testing
- Use browser DevTools
- Check Console for errors
- Use React DevTools extension
- Use Redux DevTools for state management

## Common Development Tasks

### Adding a New API Endpoint

#### 1. Create Controller
```javascript
// server/src/controllers/exampleController.js
const exampleController = {
  async getExample(req, res, next) {
    try {
      // Your logic here
      res.json({ success: true, data: {} });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = exampleController;
```

#### 2. Create Route
```javascript
// server/src/routes/example.js
const express = require('express');
const router = express.Router();
const exampleController = require('../controllers/exampleController');
const { protect } = require('../middlewares/auth');

router.get('/', protect, exampleController.getExample);

module.exports = router;
```

#### 3. Add to Main App
```javascript
// server/src/app.js
const exampleRoutes = require('./routes/example');
app.use('/api/example', exampleRoutes);
```

### Adding a New React Component

#### 1. Create Component
```jsx
// client/src/components/ExampleComponent.js
import React from 'react';
import { Box, Typography } from '@mui/material';

const ExampleComponent = () => {
  return (
    <Box>
      <Typography variant="h6">Example Component</Typography>
    </Box>
  );
};

export default ExampleComponent;
```

#### 2. Add to Page
```jsx
// client/src/pages/ExamplePage.js
import React from 'react';
import ExampleComponent from '../components/ExampleComponent';

const ExamplePage = () => {
  return (
    <div>
      <h1>Example Page</h1>
      <ExampleComponent />
    </div>
  );
};

export default ExamplePage;
```

#### 3. Add Route
```jsx
// client/src/App.js
import ExamplePage from './pages/ExamplePage';

// In your Routes
<Route path="/example" element={<ExamplePage />} />
```

## Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Check what's using the port
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

#### 2. MongoDB Connection Failed
```bash
# Check if MongoDB is running
ps aux | grep mongod  # macOS/Linux
tasklist | findstr mongod  # Windows

# Check MongoDB logs
tail -f /var/log/mongodb/mongod.log  # Linux
# Check Docker logs if using Docker
docker logs mongodb-dev
```

#### 3. Frontend Build Errors
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 4. Backend Validation Errors
- Check request body format
- Verify required fields
- Check data types
- Review validation middleware

### Debug Steps

#### 1. Check Logs
- **Backend**: Check terminal output
- **Frontend**: Check browser console
- **Database**: Check MongoDB logs

#### 2. Verify Environment
- Check `.env` files exist
- Verify environment variables are loaded
- Confirm file paths are correct

#### 3. Test Individual Components
- Test backend endpoints with Postman
- Test frontend components in isolation
- Verify database connections

## Performance Optimization

### Development Mode
- **Hot Reloading**: Enabled for both frontend and backend
- **Source Maps**: Enabled for debugging
- **Error Overlay**: Shows errors in browser
- **Fast Refresh**: React component updates

### Monitoring
- **CPU Usage**: Monitor with Activity Monitor/Task Manager
- **Memory Usage**: Watch for memory leaks
- **Network Requests**: Use browser DevTools Network tab
- **Database Queries**: Monitor with MongoDB Compass

## Security Considerations

### Development Environment
- **JWT Secret**: Use strong, unique secret
- **CORS**: Configure for local development
- **Rate Limiting**: Adjust for development needs
- **Environment Variables**: Never commit `.env` files

### Data Safety
- **Test Data**: Use separate database for development
- **Backup**: Regular backups of development data
- **Cleanup**: Remove sensitive test data
- **Validation**: Test security measures

## Next Steps

### 1. Explore the Codebase
- Read through the documentation
- Understand the project structure
- Review existing components and APIs

### 2. Make Your First Change
- Follow the getting-started tutorial
- Add a simple feature
- Test your changes thoroughly

### 3. Learn the Tools
- **Redux DevTools**: State management debugging
- **React DevTools**: Component inspection
- **MongoDB Compass**: Database visualization
- **Postman**: API testing and documentation

### 4. Contribute
- Create feature branches
- Write tests for your code
- Document your changes
- Submit pull requests

---

## Support

If you encounter issues:

1. **Check this guide** - Review all steps
2. **Search issues** - Look for similar problems
3. **Check logs** - Review error messages
4. **Ask community** - Use GitHub discussions

---

**Happy coding! 🎉**

**Next**: [Production Deployment](./production.md) | [Back to Deployment Overview](../README.md) 
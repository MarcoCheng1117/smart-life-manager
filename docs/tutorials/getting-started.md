# Getting Started Tutorial 🚀

Welcome to your first steps with Smart Life Manager! This tutorial will guide you through setting up the development environment and building your first feature.

## 📋 What You'll Learn

By the end of this tutorial, you'll have:
- ✅ Set up your development environment
- ✅ Run the application locally
- ✅ Understood the basic architecture
- ✅ Added a simple feature
- ✅ Made your first commit

## 🎯 Prerequisites

Before starting, make sure you have:
- **Node.js** 18+ installed
- **Git** installed
- **A code editor** (VS Code recommended)
- **Basic knowledge** of JavaScript/HTML/CSS

## 🚀 Step 1: Environment Setup

### 1.1 Clone the Repository
```bash
# Fork the repository on GitHub first, then:
git clone https://github.com/YOUR_USERNAME/smart-life-manager.git
cd smart-life-manager

# Add the upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/smart-life-manager.git
```

### 1.2 Install Dependencies
```bash
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

### 1.3 Environment Configuration
```bash
# Frontend environment
cd client
cp .env.example .env
```

Edit `client/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENVIRONMENT=development
```

```bash
# Backend environment
cd ../server
cp .env.example .env
```

Edit `server/.env`:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-life-manager
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
CLIENT_URL=http://localhost:3000
```

### 1.4 Start MongoDB
```bash
# Option 1: Local MongoDB
mongod

# Option 2: Docker (recommended for beginners)
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## 🏃‍♂️ Step 2: Run the Application

### 2.1 Start the Backend
```bash
# Terminal 1
cd server
npm run dev
```

You should see:
```
✅ MongoDB Connected: localhost
📊 Database: smart-life-manager
🔌 Port: 27017
🎉 Mongoose connected to MongoDB
🚀 Server running on port 5000
```

### 2.2 Start the Frontend
```bash
# Terminal 2
cd client
npm start
```

Your browser should open to `http://localhost:3000`

### 2.3 Verify Everything Works
- ✅ Backend API: http://localhost:5000 (should show API info)
- ✅ Frontend: http://localhost:3000 (should show the app)
- ✅ Database: MongoDB running on port 27017

## 🏗️ Step 3: Understand the Architecture

### 3.1 Project Structure Overview
```
smart-life-manager/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Main application pages
│   │   ├── store/         # Redux state management
│   │   ├── hooks/         # Custom React hooks
│   │   └── i18n/          # Internationalization
├── server/                 # Express.js backend
│   ├── src/
│   │   ├── models/        # Database models
│   │   ├── routes/        # API endpoints
│   │   ├── controllers/   # Business logic
│   │   └── middlewares/   # Request processing
└── docs/                   # Documentation
```

### 3.2 Data Flow
```
User Action → React Component → Redux Action → API Call → Express Route → Controller → Database → Response → UI Update
```

### 3.3 Key Technologies
- **Frontend**: React 18, Material-UI, Redux Toolkit
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JWT tokens
- **State Management**: Redux with RTK Query

## 🛠️ Step 4: Build Your First Feature

Let's add a simple "Quick Note" feature to the dashboard. This will teach you:
- Creating React components
- Using Redux state
- Making API calls
- Updating the UI

### 4.1 Create the Quick Note Component

Create `client/src/components/QuickNote.js`:
```jsx
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';

const QuickNote = () => {
  const [note, setNote] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (note.trim()) {
      // TODO: Save note to backend
      console.log('Saving note:', note);
      setNote('');
      setIsExpanded(false);
    }
  };

  const handleClose = () => {
    setIsExpanded(false);
    setNote('');
  };

  if (!isExpanded) {
    return (
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() => setIsExpanded(true)}
        fullWidth
      >
        Add Quick Note
      </Button>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Quick Note</Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Write your note here..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            variant="outlined"
            margin="normal"
            autoFocus
          />
          
          <Box display="flex" gap={1} mt={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!note.trim()}
            >
              Save Note
            </Button>
            <Button
              variant="outlined"
              onClick={handleClose}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default QuickNote;
```

### 4.2 Add the Component to Dashboard

Edit `client/src/pages/Dashboard.js` (create if it doesn't exist):
```jsx
import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import QuickNote from '../components/QuickNote';

const Dashboard = () => {
  return (
    <Box p={3}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <QuickNote />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Welcome to Smart Life Manager!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            This is your personal dashboard where you can manage tasks, goals, and track your progress.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
```

### 4.3 Test Your Feature

1. **Save the files** - Your changes should auto-reload
2. **Navigate to the dashboard** - You should see your Quick Note component
3. **Click "Add Quick Note"** - The form should expand
4. **Type a note** - The Save button should enable
5. **Submit the form** - Check the browser console for the log

## 🔄 Step 5: Add State Management

Now let's connect the Quick Note to Redux state management.

### 5.1 Create a Notes Slice

Create `client/src/store/slices/notesSlice.js`:
```jsx
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notes: [],
  loading: false,
  error: null,
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    addNote: (state, action) => {
      state.notes.unshift({
        id: Date.now(),
        text: action.payload,
        createdAt: new Date().toISOString(),
      });
    },
    deleteNote: (state, action) => {
      state.notes = state.notes.filter(note => note.id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { addNote, deleteNote, setLoading, setError } = notesSlice.actions;
export default notesSlice.reducer;

// Selectors
export const selectAllNotes = (state) => state.notes.notes;
export const selectNotesLoading = (state) => state.notes.loading;
export const selectNotesError = (state) => state.notes.error;
```

### 5.2 Add Notes to the Store

Edit `client/src/store/index.js`:
```jsx
// ... existing imports ...
import notesReducer from './slices/notesSlice';

export const store = configureStore({
  reducer: {
    // ... existing reducers ...
    notes: notesReducer,
  },
  // ... rest of configuration ...
});
```

### 5.3 Update the Quick Note Component

Update `client/src/components/QuickNote.js`:
```jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNote } from '../store/slices/notesSlice';
// ... other imports ...

const QuickNote = () => {
  const dispatch = useDispatch();
  // ... existing state ...

  const handleSubmit = (e) => {
    e.preventDefault();
    if (note.trim()) {
      dispatch(addNote(note));
      setNote('');
      setIsExpanded(false);
    }
  };

  // ... rest of component ...
};
```

### 5.4 Display Notes in Dashboard

Update `client/src/pages/Dashboard.js`:
```jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { selectAllNotes } from '../store/slices/notesSlice';
// ... other imports ...

const Dashboard = () => {
  const notes = useSelector(selectAllNotes);

  return (
    <Box p={3}>
      {/* ... existing content ... */}
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <QuickNote />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Recent Notes
          </Typography>
          {notes.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No notes yet. Add your first note!
            </Typography>
          ) : (
            notes.map((note) => (
              <Box key={note.id} mb={2} p={2} border={1} borderColor="divider" borderRadius={1}>
                <Typography variant="body2">{note.text}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(note.createdAt).toLocaleString()}
                </Typography>
              </Box>
            ))
          )}
        </Grid>
      </Grid>
    </Box>
  );
};
```

## 🧪 Step 6: Test Your Feature

### 6.1 Manual Testing
1. **Add a note** - Type and save a quick note
2. **Verify persistence** - The note should appear in the Recent Notes section
3. **Add multiple notes** - Test with different content
4. **Check formatting** - Notes should display with timestamps

### 6.2 Browser DevTools
1. **Open Redux DevTools** - Check the state changes
2. **Monitor Network** - See API calls (when we add them)
3. **Console logs** - Check for any errors

## 🚀 Step 7: Add Backend Support

Now let's create the backend API for notes.

### 7.1 Create the Note Model

Create `server/src/models/Note.js`:
```javascript
const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Note text is required'],
    trim: true,
    maxlength: [1000, 'Note cannot exceed 1000 characters'],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    enum: ['quick', 'work', 'personal', 'idea'],
    default: 'quick',
  },
  tags: [{
    type: String,
    trim: true,
  }],
  isPinned: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Indexes for better performance
noteSchema.index({ userId: 1, createdAt: -1 });
noteSchema.index({ userId: 1, category: 1 });

module.exports = mongoose.model('Note', noteSchema);
```

### 7.2 Create the Notes Controller

Create `server/src/controllers/notesController.js`:
```javascript
const Note = require('../models/Note');

const notesController = {
  // Get all notes for a user
  async getNotes(req, res, next) {
    try {
      const notes = await Note.find({ userId: req.user.id })
        .sort({ createdAt: -1 })
        .limit(50);

      res.json({
        success: true,
        data: notes,
        count: notes.length,
      });
    } catch (error) {
      next(error);
    }
  },

  // Create a new note
  async createNote(req, res, next) {
    try {
      const noteData = {
        ...req.body,
        userId: req.user.id,
      };

      const note = await Note.create(noteData);

      res.status(201).json({
        success: true,
        data: note,
      });
    } catch (error) {
      next(error);
    }
  },

  // Delete a note
  async deleteNote(req, res, next) {
    try {
      const note = await Note.findOneAndDelete({
        _id: req.params.id,
        userId: req.user.id,
      });

      if (!note) {
        return res.status(404).json({
          success: false,
          error: 'Note not found',
        });
      }

      res.json({
        success: true,
        data: {},
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = notesController;
```

### 7.3 Create the Notes Routes

Create `server/src/routes/notes.js`:
```javascript
const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController');
const { protect } = require('../middlewares/auth');

// All routes require authentication
router.use(protect);

// GET /api/notes - Get all notes
router.get('/', notesController.getNotes);

// POST /api/notes - Create a new note
router.post('/', notesController.createNote);

// DELETE /api/notes/:id - Delete a note
router.delete('/:id', notesController.deleteNote);

module.exports = router;
```

### 7.4 Add Notes Routes to Main App

Edit `server/src/app.js`:
```javascript
// ... existing imports ...
const notesRoutes = require('./routes/notes');

// ... existing middleware ...

// API routes
app.use('/api/notes', notesRoutes);
// ... existing routes ...
```

### 7.5 Update Frontend to Use API

Create `client/src/services/notesApi.js`:
```javascript
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const notesApi = {
  // Get all notes
  async getNotes() {
    const response = await axios.get(`${API_URL}/notes`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },

  // Create a new note
  async createNote(noteData) {
    const response = await axios.post(`${API_URL}/notes`, noteData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },

  // Delete a note
  async deleteNote(noteId) {
    const response = await axios.delete(`${API_URL}/notes/${noteId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },
};

export default notesApi;
```

## 🎉 Step 8: Celebrate Your Success!

Congratulations! You've successfully:
- ✅ Set up a development environment
- ✅ Created a React component
- ✅ Implemented Redux state management
- ✅ Built a backend API
- ✅ Connected frontend and backend
- ✅ Created a working feature

## 📚 What You've Learned

### Frontend Concepts
- **React Components** - Creating reusable UI components
- **State Management** - Using Redux for application state
- **Material-UI** - Building beautiful interfaces
- **Event Handling** - Managing user interactions

### Backend Concepts
- **Express.js Routes** - Creating API endpoints
- **MongoDB Models** - Designing database schemas
- **Controllers** - Implementing business logic
- **Middleware** - Processing requests

### Full-Stack Concepts
- **API Integration** - Connecting frontend and backend
- **Data Flow** - Understanding how data moves through the system
- **Error Handling** - Managing failures gracefully
- **Authentication** - Securing API endpoints

## 🚀 Next Steps

### Immediate Actions
1. **Test your feature** - Make sure everything works
2. **Add error handling** - Handle API failures gracefully
3. **Improve the UI** - Add loading states and better styling
4. **Add validation** - Validate input on both frontend and backend

### Learning Goals
1. **Study the codebase** - Understand how other features work
2. **Read the documentation** - Explore the API and database docs
3. **Practice testing** - Write tests for your components
4. **Contribute** - Submit a pull request with your feature

### Advanced Features
1. **Real-time updates** - Add WebSocket support
2. **File attachments** - Allow users to attach files to notes
3. **Search functionality** - Implement note search
4. **Categories and tags** - Organize notes better

## 🤝 Getting Help

### When You're Stuck
1. **Check the console** - Look for error messages
2. **Review the code** - Compare with working examples
3. **Search documentation** - Look for similar patterns
4. **Ask the community** - Use GitHub discussions

### Common Issues
- **CORS errors** - Make sure backend allows frontend origin
- **Authentication errors** - Check JWT token implementation
- **Database connection** - Verify MongoDB is running
- **Port conflicts** - Ensure ports 3000 and 5000 are free

## 🎯 Challenge Yourself

Try these additional features:
1. **Add note editing** - Allow users to modify existing notes
2. **Implement search** - Add a search bar for notes
3. **Add categories** - Let users organize notes by type
4. **Create a notes page** - Build a dedicated notes management page

---

**You're now a Smart Life Manager developer! 🎉**

Keep building, keep learning, and don't forget to share your knowledge with others. Happy coding! 
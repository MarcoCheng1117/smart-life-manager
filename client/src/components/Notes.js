import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  IconButton,
  Grid,
  Paper
} from '@mui/material';
import { Delete, Add, Note } from '@mui/icons-material';
import { backgroundColors } from '../theme';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('smart-life-notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem('smart-life-notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (newNote.trim()) {
      const note = {
        id: Date.now(),
        text: newNote.trim(),
        createdAt: new Date().toISOString(),
        completed: false
      };
      setNotes([note, ...notes]);
      setNewNote('');
    }
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const toggleComplete = (id) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, completed: !note.completed } : note
    ));
  };

  const filteredNotes = notes.filter(note =>
    note.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addNote();
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1000, mx: 'auto' }}>
      <Typography variant="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Note sx={{ mr: 2, color: 'primary.main' }} />
        Quick Notes
      </Typography>

      {/* Add Note Form */}
      <Paper sx={{ 
        p: 3, 
        mb: 3, 
        backgroundColor: backgroundColors.bg3,
        border: '1px solid rgba(94, 82, 64, 0.12)'
      }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <TextField
              fullWidth
              label="Add a new note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your note here and press Enter..."
              variant="outlined"
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              onClick={addNote}
              disabled={!newNote.trim()}
              startIcon={<Add />}
              sx={{
                bgcolor: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.dark',
                }
              }}
            >
              Add Note
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Search */}
      <TextField
        fullWidth
        label="Search notes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
        variant="outlined"
      />

      {/* Notes List */}
      <Grid container spacing={2}>
        {filteredNotes.length === 0 ? (
          <Grid item xs={12}>
            <Paper sx={{ 
              p: 4, 
              textAlign: 'center',
              backgroundColor: backgroundColors.bg4,
              border: '1px solid rgba(94, 82, 64, 0.12)'
            }}>
              <Typography variant="h5" color="text.secondary">
                {searchTerm ? 'No notes match your search' : 'No notes yet. Add your first note above!'}
              </Typography>
            </Paper>
          </Grid>
        ) : (
          filteredNotes.map((note, index) => (
            <Grid item xs={12} sm={6} md={4} key={note.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  opacity: note.completed ? 0.7 : 1,
                  textDecoration: note.completed ? 'line-through' : 'none',
                  backgroundColor: index % 4 === 0 ? backgroundColors.bg1 :
                                 index % 4 === 1 ? backgroundColors.bg2 :
                                 index % 4 === 2 ? backgroundColors.bg5 :
                                 backgroundColors.bg6,
                  border: '1px solid rgba(94, 82, 64, 0.12)',
                  transition: 'transform 250ms cubic-bezier(0.16, 1, 0.3, 1)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                <CardContent>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mb: 2, 
                      minHeight: 60,
                      textDecoration: note.completed ? 'line-through' : 'none',
                      color: note.completed ? 'text.secondary' : 'text.primary'
                    }}
                  >
                    {note.text}
                  </Typography>
                  
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                    {new Date(note.createdAt).toLocaleString()}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                      size="small"
                      onClick={() => toggleComplete(note.id)}
                      color={note.completed ? 'success' : 'default'}
                      variant={note.completed ? 'contained' : 'outlined'}
                      sx={{
                        borderColor: 'rgba(94, 82, 64, 0.2)',
                        '&:hover': {
                          borderColor: 'rgba(94, 82, 64, 0.3)',
                        }
                      }}
                    >
                      {note.completed ? 'Completed' : 'Mark Complete'}
                    </Button>
                    
                    <IconButton
                      size="small"
                      onClick={() => deleteNote(note.id)}
                      color="error"
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(192, 21, 47, 0.08)',
                        }
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Stats */}
      {notes.length > 0 && (
        <Paper sx={{ 
          p: 2, 
          mt: 3, 
          textAlign: 'center',
          backgroundColor: backgroundColors.bg7,
          border: '1px solid rgba(94, 82, 64, 0.12)'
        }}>
          <Typography variant="body2" color="text.secondary">
            Total Notes: {notes.length} | 
            Completed: {notes.filter(n => n.completed).length} | 
            Pending: {notes.filter(n => !n.completed).length}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default Notes; 
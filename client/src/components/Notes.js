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
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Note sx={{ mr: 2, color: 'primary.main' }} />
        Quick Notes
      </Typography>

      {/* Add Note Form */}
      <Paper sx={{ p: 3, mb: 3 }}>
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
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                {searchTerm ? 'No notes match your search' : 'No notes yet. Add your first note above!'}
              </Typography>
            </Paper>
          </Grid>
        ) : (
          filteredNotes.map((note) => (
            <Grid item xs={12} sm={6} md={4} key={note.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  opacity: note.completed ? 0.7 : 1,
                  textDecoration: note.completed ? 'line-through' : 'none'
                }}
              >
                <CardContent>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mb: 2, 
                      minHeight: 60,
                      textDecoration: note.completed ? 'line-through' : 'none'
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
                    >
                      {note.completed ? 'Completed' : 'Mark Complete'}
                    </Button>
                    
                    <IconButton
                      size="small"
                      onClick={() => deleteNote(note.id)}
                      color="error"
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
        <Paper sx={{ p: 2, mt: 3, textAlign: 'center' }}>
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
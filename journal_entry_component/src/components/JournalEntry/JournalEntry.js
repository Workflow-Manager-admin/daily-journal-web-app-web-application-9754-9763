import React, { useState, useEffect } from 'react';
import { TextField, Button, Paper, Typography, Container, Box } from '@mui/material';
import { user } from '../../utils/userAuth';
import { createJournalEntry } from '../../models/JournalEntry';
import {
  getAllEntries,
  createEntry,
  updateEntry,
  deleteEntry
} from '../../services/journalService';
import './JournalEntry.css';

/**
 * JournalEntry component for creating and managing journal entries.
 * Uses static user details for direct access.
 */
const JournalEntry = () => {
  // State for form fields
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [entries, setEntries] = useState([]);
  const [currentEntry, setCurrentEntry] = useState(null);
  const [error, setError] = useState(null);

  // Load existing entries on component mount
  useEffect(() => {
    loadEntries();
  }, []);

  /**
   * Load all journal entries from the service
   */
  const loadEntries = () => {
    const allEntries = getAllEntries();
    setEntries(allEntries);
  };

  /**
   * Handle form submission for creating/updating entries
   * @param {Event} e - Form submission event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const entryData = {
      title: title.trim(),
      content: content.trim(),
      userId: user.username, // Using static user details
    };

    try {
      if (currentEntry) {
        // Update existing entry
        const { entry, errors } = updateEntry(currentEntry.id, entryData);
        if (errors) {
          setError(Object.values(errors).join(', '));
          return;
        }
        setCurrentEntry(null);
      } else {
        // Create new entry
        const { entry, errors } = createEntry(entryData);
        if (errors) {
          setError(Object.values(errors).join(', '));
          return;
        }
      }

      // Reset form and reload entries
      setTitle('');
      setContent('');
      loadEntries();
    } catch (err) {
      setError('An error occurred while saving the entry');
      console.error('Error saving entry:', err);
    }
  };

  /**
   * Handle editing an existing entry
   * @param {Object} entry - The entry to edit
   */
  const handleEdit = (entry) => {
    setCurrentEntry(entry);
    setTitle(entry.title);
    setContent(entry.content);
  };

  /**
   * Handle deleting an entry
   * @param {string} id - ID of the entry to delete
   */
  const handleDelete = (id) => {
    try {
      const { success, errors } = deleteEntry(id);
      if (!success) {
        setError(Object.values(errors).join(', '));
        return;
      }
      loadEntries();
    } catch (err) {
      setError('An error occurred while deleting the entry');
      console.error('Error deleting entry:', err);
    }
  };

  return (
    <Container className="journal-entry-container">
      <Box className="user-info">
        <Typography variant="h6">
          Welcome, {user.username}!
        </Typography>
      </Box>

      <Paper elevation={3} className="entry-form">
        <form onSubmit={handleSubmit}>
          <Typography variant="h5" gutterBottom>
            {currentEntry ? 'Edit Journal Entry' : 'New Journal Entry'}
          </Typography>

          {error && (
            <Typography color="error" gutterBottom>
              {error}
            </Typography>
          )}

          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
          />

          <TextField
            label="Content"
            variant="outlined"
            fullWidth
            required
            multiline
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            margin="normal"
          />

          <Box className="form-actions">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="submit-button"
            >
              {currentEntry ? 'Update Entry' : 'Save Entry'}
            </Button>

            {currentEntry && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  setCurrentEntry(null);
                  setTitle('');
                  setContent('');
                }}
              >
                Cancel Edit
              </Button>
            )}
          </Box>
        </form>
      </Paper>

      <Box className="entries-list">
        <Typography variant="h5" gutterBottom>
          Your Journal Entries
        </Typography>

        {entries.length === 0 ? (
          <Typography variant="body1">
            No entries yet. Create your first journal entry above!
          </Typography>
        ) : (
          entries.map((entry) => (
            <Paper key={entry.id} elevation={2} className="entry-item">
              <Box className="entry-content">
                <Typography variant="h6">{entry.title}</Typography>
                <Typography variant="body1">{entry.content}</Typography>
                <Typography variant="caption" className="entry-date">
                  Created: {new Date(entry.createdAt).toLocaleString()}
                </Typography>
              </Box>
              <Box className="entry-actions">
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleEdit(entry)}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDelete(entry.id)}
                >
                  Delete
                </Button>
              </Box>
            </Paper>
          ))
        )}
      </Box>
    </Container>
  );
};

export default JournalEntry;

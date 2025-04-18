import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Button,
  Box,
  IconButton,
  Divider,
  Snackbar,
  Alert,
  Chip,
  Stack
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import MoodIcon from '@mui/icons-material/Mood';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

import { formatDate, validateJournalEntryData } from '../../models/JournalEntry';
import journalService from '../../services/journalService';

/**
 * JournalEntry component for displaying and editing a single journal entry.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.entry - The journal entry object to display/edit
 * @param {Function} props.onSave - Callback function called after successful save
 * @param {Function} props.onDelete - Callback function called after successful delete
 * @param {boolean} props.isNew - Whether this is a new entry being created
 * @param {Function} props.onEdit - Callback function called when edit button is clicked
 * @returns {JSX.Element} The JournalEntry component
 */
const JournalEntry = ({ entry, onSave, onDelete, isNew = false, onEdit }) => {
  // State for managing the entry data
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(isNew);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  // Initialize state from entry prop when it changes
  useEffect(() => {
    if (entry) {
      setTitle(entry.title || '');
      setContent(entry.content || '');
    }
  }, [entry]);

  /**
   * Handle editing mode toggle
   */
  const handleEditToggle = () => {
    if (isEditing) {
      // If canceling edit, reset to original values
      setTitle(entry?.title || '');
      setContent(entry?.content || '');
      setErrors({});
    } else if (onEdit && typeof onEdit === 'function') {
      // If entering edit mode and onEdit prop is provided, call it
      onEdit();
      return;
    }
    setIsEditing(!isEditing);
  };

  /**
   * Handle saving the journal entry
   */
  const handleSave = () => {
    // Validate the entry data
    const entryData = { title, content };
    const validation = validateJournalEntryData(entryData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      let result;

      if (isNew) {
        // Create a new entry
        result = journalService.createEntry(entryData);
      } else {
        // Update existing entry
        result = journalService.updateEntry(entry.id, entryData);
      }

      if (result.errors) {
        setErrors(result.errors);
        setNotification({
          open: true,
          message: 'Failed to save journal entry',
          severity: 'error'
        });
        return;
      }

      // Clear errors and exit editing mode
      setErrors({});
      setIsEditing(false);
      
      // Show success notification
      setNotification({
        open: true,
        message: isNew ? 'Journal entry created successfully' : 'Journal entry updated successfully',
        severity: 'success'
      });

      // Call the onSave callback if provided
      if (onSave && typeof onSave === 'function') {
        onSave(result.entry);
      }
    } catch (error) {
      console.error('Error saving journal entry:', error);
      setNotification({
        open: true,
        message: 'An unexpected error occurred',
        severity: 'error'
      });
    }
  };

  /**
   * Handle deleting the journal entry
   */
  const handleDelete = () => {
    if (!entry || !entry.id) return;

    try {
      const result = journalService.deleteEntry(entry.id);

      if (!result.success) {
        setNotification({
          open: true,
          message: 'Failed to delete journal entry',
          severity: 'error'
        });
        return;
      }

      // Show success notification
      setNotification({
        open: true,
        message: 'Journal entry deleted successfully',
        severity: 'success'
      });

      // Call the onDelete callback if provided
      if (onDelete && typeof onDelete === 'function') {
        onDelete(entry.id);
      }
    } catch (error) {
      console.error('Error deleting journal entry:', error);
      setNotification({
        open: true,
        message: 'An unexpected error occurred',
        severity: 'error'
      });
    }
  };

  /**
   * Handle closing the notification
   */
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  /**
   * Get mood display name from mood value
   * @param {string} moodValue - The mood value
   * @returns {string} The display name for the mood
   */
  const getMoodDisplayName = (moodValue) => {
    const moodMap = {
      'happy': 'Happy',
      'sad': 'Sad',
      'excited': 'Excited',
      'anxious': 'Anxious',
      'calm': 'Calm',
      'frustrated': 'Frustrated',
      'grateful': 'Grateful'
    };
    return moodValue ? moodMap[moodValue] || moodValue : 'Not specified';
  };

  // Render the component
  return (
    <Card sx={{ mb: 3, boxShadow: 3 }}>
      <CardContent>
        {isEditing ? (
          // Edit mode
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={!!errors.title}
              helperText={errors.title}
              autoFocus
            />
            <TextField
              label="Content"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              error={!!errors.content}
              helperText={errors.content}
            />
          </Box>
        ) : (
          // View mode
          <Box>
            <Typography variant="h5" component="h2" gutterBottom>
              {title || 'Untitled Entry'}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {entry && formatDate(entry.createdAt, 'relative')}
              {entry && entry.updatedAt > entry.createdAt && 
                ` (Updated ${formatDate(entry.updatedAt, 'relative')})`}
            </Typography>
            
            {/* Display mood if available */}
            {entry && entry.mood && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, mb: 1 }}>
                <MoodIcon fontSize="small" color="primary" />
                <Typography variant="body2">
                  {getMoodDisplayName(entry.mood)}
                </Typography>
              </Box>
            )}
            
            {/* Display tags if available */}
            {entry && entry.tags && entry.tags.length > 0 && (
              <Box sx={{ mt: 1, mb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <LocalOfferIcon fontSize="small" color="primary" />
                  <Typography variant="body2" color="text.secondary">
                    Tags:
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                  {entry.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      color="primary"
                      size="small"
                      sx={{ mb: 0.5 }}
                    />
                  ))}
                </Stack>
              </Box>
            )}
            
            <Divider sx={{ my: 1.5 }} />
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mt: 2 }}>
              {content || 'No content'}
            </Typography>
          </Box>
        )}
      </CardContent>

      <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
        {isEditing ? (
          // Edit mode actions
          <>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={handleEditToggle}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              sx={{ ml: 1 }}
            >
              Save
            </Button>
          </>
        ) : (
          // View mode actions
          <>
            {!isNew && (
              <IconButton 
                color="error" 
                onClick={handleDelete}
                aria-label="delete"
              >
                <DeleteIcon />
              </IconButton>
            )}
            <IconButton 
              color="primary" 
              onClick={handleEditToggle}
              aria-label="edit"
            >
              <EditIcon />
            </IconButton>
          </>
        )}
      </CardActions>

      {/* Notification snackbar */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default JournalEntry;

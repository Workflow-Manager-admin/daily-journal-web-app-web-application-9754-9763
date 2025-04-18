import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Snackbar,
  Alert,
  FormHelperText,
  Divider,
  Paper
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MoodIcon from '@mui/icons-material/Mood';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

import { validateJournalEntryData, formatDate } from '../../models/JournalEntry';
import journalService from '../../services/journalService';

/**
 * JournalEntryForm component for creating and editing journal entries.
 * 
 * @param {Object} props - Component props
 * @param {Object} [props.entry] - Existing journal entry for editing (optional)
 * @param {Function} props.onSave - Callback function called after successful save
 * @param {Function} props.onCancel - Callback function called when form is cancelled
 * @param {string} [props.mode='edit'] - The mode of the form ('edit' or 'view')
 * @param {Function} [props.onEdit] - Callback function called when edit button is clicked in view mode
 * @returns {JSX.Element} The JournalEntryForm component
 */
const JournalEntryForm = ({ entry, onSave, onCancel, mode = 'edit', onEdit }) => {
  // State for form fields
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(new Date());
  const [mood, setMood] = useState('');
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');
  
  // State for form validation and notifications
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  // Initialize form with entry data if provided
  useEffect(() => {
    if (entry) {
      setTitle(entry.title || '');
      setContent(entry.content || '');
      setDate(entry.createdAt ? new Date(entry.createdAt) : new Date());
      
      // If the entry has mood or tags in the future, set them here
      // This assumes these fields might be added to the JournalEntry model later
      if (entry.mood) setMood(entry.mood);
      if (entry.tags && Array.isArray(entry.tags)) setTags(entry.tags);
    }
  }, [entry]);

  /**
   * Handle form submission
   * @param {React.FormEvent} event - The form event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Prepare entry data
    const entryData = {
      title,
      content,
      createdAt: date,
      // Include mood and tags if they're not empty
      ...(mood && { mood }),
      ...(tags.length > 0 && { tags })
    };
    
    // Validate the entry data
    const validation = validateJournalEntryData(entryData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    
    try {
      let result;
      
      if (entry && entry.id) {
        // Update existing entry
        result = journalService.updateEntry(entry.id, entryData);
      } else {
        // Create new entry
        result = journalService.createEntry(entryData);
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
      
      // Clear errors and show success notification
      setErrors({});
      setNotification({
        open: true,
        message: entry && entry.id ? 'Journal entry updated successfully' : 'Journal entry created successfully',
        severity: 'success'
      });
      
      // Call the onSave callback if provided
      if (onSave && typeof onSave === 'function') {
        onSave(result.entry);
      }
      
      // Reset form if creating a new entry
      if (!entry || !entry.id) {
        resetForm();
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
   * Reset the form to its initial state
   */
  const resetForm = () => {
    setTitle('');
    setContent('');
    setDate(new Date());
    setMood('');
    setTags([]);
    setCurrentTag('');
    setErrors({});
  };

  /**
   * Handle cancelling the form
   */
  const handleCancel = () => {
    if (onCancel && typeof onCancel === 'function') {
      onCancel();
    }
  };

  /**
   * Add a tag to the tags array
   */
  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  /**
   * Remove a tag from the tags array
   * @param {string} tagToRemove - The tag to remove
   */
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  /**
   * Handle closing the notification
   */
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  /**
   * Handle key press in the tag input field
   * @param {React.KeyboardEvent} event - The keyboard event
   */
  const handleTagKeyPress = (event) => {
    if (event.key === 'Enter' && currentTag.trim()) {
      event.preventDefault();
      handleAddTag();
    }
  };

  // Get mood display name
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

  // Render view mode content
  const renderViewMode = () => {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {entry?.title || 'Untitled Entry'}
        </Typography>
        
        <Divider />
        
        {/* Date display */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CalendarTodayIcon color="primary" />
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Date
            </Typography>
            <Typography variant="body1">
              {date ? formatDate(date, 'default') : 'Not specified'}
            </Typography>
          </Box>
        </Box>
        
        {/* Mood display */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <MoodIcon color="primary" />
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Mood
            </Typography>
            <Typography variant="body1">
              {getMoodDisplayName(mood)}
            </Typography>
          </Box>
        </Box>
        
        {/* Tags display */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <LocalOfferIcon color="primary" sx={{ mt: 0.5 }} />
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Tags
            </Typography>
            {tags && tags.length > 0 ? (
              <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', gap: 1 }}>
                {tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    color="primary"
                    size="small"
                  />
                ))}
              </Stack>
            ) : (
              <Typography variant="body1">No tags</Typography>
            )}
          </Box>
        </Box>
        
        <Divider />
        
        {/* Content display */}
        <Box>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Content
          </Typography>
          <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {content || 'No content'}
            </Typography>
          </Paper>
        </Box>
      </Box>
    );
  };

  // Render edit mode form
  const renderEditMode = () => {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            {/* Title field (optional) */}
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={!!errors.title}
              helperText={errors.title || 'Optional'}
              autoFocus
            />
            
            {/* Date picker */}
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Date"
                value={date}
                onChange={(newDate) => setDate(newDate || new Date())}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                    error: !!errors.createdAt,
                    helperText: errors.createdAt
                  }
                }}
              />
            </LocalizationProvider>
            
            {/* Content field (required) */}
            <TextField
              label="Content"
              variant="outlined"
              fullWidth
              multiline
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              error={!!errors.content}
              helperText={errors.content || 'Write your journal entry here'}
              required
            />
            
            {/* Mood selector (optional) */}
            <FormControl variant="outlined" fullWidth>
              <InputLabel id="mood-label">Mood</InputLabel>
              <Select
                labelId="mood-label"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                label="Mood"
              >
                <MenuItem value=""><em>None</em></MenuItem>
                <MenuItem value="happy">Happy</MenuItem>
                <MenuItem value="sad">Sad</MenuItem>
                <MenuItem value="excited">Excited</MenuItem>
                <MenuItem value="anxious">Anxious</MenuItem>
                <MenuItem value="calm">Calm</MenuItem>
                <MenuItem value="frustrated">Frustrated</MenuItem>
                <MenuItem value="grateful">Grateful</MenuItem>
              </Select>
              <FormHelperText>Optional</FormHelperText>
            </FormControl>
            
            {/* Tags input (optional) */}
            <Box>
              <TextField
                label="Tags"
                variant="outlined"
                fullWidth
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={handleTagKeyPress}
                helperText="Press Enter to add a tag (optional)"
                InputProps={{
                  endAdornment: (
                    <Button 
                      onClick={handleAddTag} 
                      disabled={!currentTag.trim()}
                      sx={{ ml: 1 }}
                    >
                      Add
                    </Button>
                  ),
                }}
              />
              
              {/* Display added tags */}
              {tags.length > 0 && (
                <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', gap: 1 }}>
                  {tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => handleRemoveTag(tag)}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Stack>
              )}
            </Box>
          </Box>
        </CardContent>
        
        <CardActions sx={{ justifyContent: 'flex-end', p: 2, flexShrink: 0 }}>
          <Button
            variant="outlined"
            startIcon={<CancelIcon />}
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            sx={{ ml: 1 }}
          >
            Save
          </Button>
        </CardActions>
      </form>
      
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

export default JournalEntryForm;

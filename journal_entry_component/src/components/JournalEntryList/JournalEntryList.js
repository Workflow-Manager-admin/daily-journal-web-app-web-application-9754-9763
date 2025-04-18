import React, { useState, useEffect } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Button,
  Chip,
  Tooltip,
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';

import { formatDate } from '../../models/JournalEntry';
import journalService from '../../services/journalService';

/**
 * JournalEntryList component for displaying a list of journal entries with sorting and filtering options.
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onSelectEntry - Callback function called when an entry is selected
 * @param {Function} props.onCreateEntry - Callback function called when the create button is clicked
 * @param {string} [props.selectedEntryId] - ID of the currently selected entry
 * @returns {JSX.Element} The JournalEntryList component
 */
const JournalEntryList = ({ onSelectEntry, onCreateEntry, selectedEntryId }) => {
  // State for entries and filtering/sorting
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('updatedAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [loading, setLoading] = useState(true);

  // Load entries on component mount
  useEffect(() => {
    loadEntries();
  }, []);

  // Apply filtering and sorting when entries, searchQuery, sortField, or sortDirection change
  useEffect(() => {
    applyFilterAndSort();
  }, [entries, searchQuery, sortField, sortDirection]);

  /**
   * Load all journal entries from the service
   */
  const loadEntries = () => {
    setLoading(true);
    try {
      const allEntries = journalService.getAllEntries();
      setEntries(allEntries);
    } catch (error) {
      console.error('Error loading journal entries:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Apply filtering and sorting to the entries
   */
  const applyFilterAndSort = () => {
    let result = [...entries];

    // Apply search filter if query exists
    if (searchQuery.trim()) {
      result = journalService.searchEntries(searchQuery);
    }

    // Apply sorting
    result = journalService.sortEntries(sortField, sortDirection);
    
    setFilteredEntries(result);
  };

  /**
   * Handle search query change
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event
   */
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  /**
   * Clear the search query
   */
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  /**
   * Handle sort field change
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event
   */
  const handleSortFieldChange = (event) => {
    setSortField(event.target.value);
  };

  /**
   * Handle sort direction change
   */
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  /**
   * Handle entry selection
   * @param {string} entryId - The ID of the selected entry
   */
  const handleSelectEntry = (entryId) => {
    if (onSelectEntry && typeof onSelectEntry === 'function') {
      onSelectEntry(entryId);
    }
  };

  /**
   * Handle create new entry button click
   */
  const handleCreateEntry = () => {
    if (onCreateEntry && typeof onCreateEntry === 'function') {
      onCreateEntry();
    }
  };

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Header with title */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" component="h2">
          Journal Entries
        </Typography>
      </Box>

      {/* Search and filter controls */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <TextField
          fullWidth
          placeholder="Search entries..."
          value={searchQuery}
          onChange={handleSearchChange}
          margin="normal"
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton
                  aria-label="clear search"
                  onClick={handleClearSearch}
                  edge="end"
                  size="small"
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <Box sx={{ display: 'flex', mt: 2, gap: 1, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 120, flex: 1 }}>
            <InputLabel id="sort-field-label">Sort By</InputLabel>
            <Select
              labelId="sort-field-label"
              value={sortField}
              label="Sort By"
              onChange={handleSortFieldChange}
              startAdornment={
                <InputAdornment position="start">
                  <SortIcon fontSize="small" />
                </InputAdornment>
              }
            >
              <MenuItem value="updatedAt">Last Updated</MenuItem>
              <MenuItem value="createdAt">Date Created</MenuItem>
              <MenuItem value="title">Title</MenuItem>
            </Select>
          </FormControl>

          <Tooltip title={`Sort ${sortDirection === 'asc' ? 'Ascending' : 'Descending'}`}>
            <Chip 
              icon={<FilterListIcon />} 
              label={sortDirection === 'asc' ? 'A-Z' : 'Z-A'} 
              onClick={toggleSortDirection}
              color="primary"
              variant="outlined"
              size="small"
            />
          </Tooltip>
        </Box>
      </Box>

      {/* Entries list */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredEntries.length > 0 ? (
          <List disablePadding>
            {filteredEntries.map((entry, index) => (
              <React.Fragment key={entry.id}>
                <ListItemButton
                  selected={selectedEntryId === entry.id}
                  onClick={() => handleSelectEntry(entry.id)}
                  sx={{ 
                    py: 1.5,
                    px: 2,
                    '&.Mui-selected': {
                      backgroundColor: 'action.selected',
                      borderLeft: 3,
                      borderColor: 'primary.main',
                    }
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography 
                        variant="subtitle1" 
                        component="div" 
                        noWrap
                        fontWeight={selectedEntryId === entry.id ? 600 : 400}
                      >
                        {entry.title || 'Untitled Entry'}
                      </Typography>
                    }
                    secondary={
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        component="div"
                        noWrap
                      >
                        {formatDate(entry.updatedAt, 'relative')}
                      </Typography>
                    }
                  />
                </ListItemButton>
                {index < filteredEntries.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">
              {searchQuery ? 'No entries match your search' : 'No journal entries yet'}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Create new entry button */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          startIcon={<AddIcon />}
          onClick={handleCreateEntry}
        >
          New Entry
        </Button>
      </Box>
    </Paper>
  );
};

export default JournalEntryList;

import React, { useState, useEffect } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Typography,
  Button,
  Container,
  Box,
  AppBar,
  Toolbar,
  Grid,
  Paper,
  Tabs,
  Tab
} from '@mui/material';

import JournalEntryList from './components/JournalEntryList';
import JournalEntry from './components/JournalEntry/JournalEntry';
import JournalEntryForm from './components/JournalEntryForm/JournalEntryForm';
import { createJournalEntry } from './models/JournalEntry';
import journalService from './services/journalService';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#E87A41', // Kavia orange
    },
    background: {
      default: '#1A1A1A',
      paper: '#1A1A1A',
    },
    text: {
      primary: '#ffffff',
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    subtitle1: {
      fontSize: '1.1rem',
      lineHeight: 1.5,
      color: 'rgba(255, 255, 255, 0.7)',
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          padding: '10px 20px',
          fontSize: '1rem',
          textTransform: 'none',
          fontWeight: 500,
        },
        containedPrimary: {
          backgroundColor: '#E87A41',
          '&:hover': {
            backgroundColor: '#FF8B4D',
          },
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1A1A1A',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }
      }
    }
  }
});

function App() {
  const [entries, setEntries] = useState([]);
  const [selectedEntryId, setSelectedEntryId] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isNewEntry, setIsNewEntry] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // 0 for view, 1 for edit/create


  // Load entries on component mount
  useEffect(() => {
    loadEntries();
  }, []);

  // Update selected entry when selectedEntryId changes
  useEffect(() => {
    if (selectedEntryId) {
      const entry = journalService.getEntryById(selectedEntryId);
      setSelectedEntry(entry);
      setIsNewEntry(false);
    } else if (isNewEntry) {
      setSelectedEntry(null);
    } else {
      // If no entry is selected and we're not creating a new one,
      // select the first entry if available
      if (entries.length > 0 && !isNewEntry) {
        setSelectedEntryId(entries[0].id);
      } else {
        setSelectedEntry(null);
      }
    }
  }, [selectedEntryId, entries, isNewEntry]);

  /**
   * Load all journal entries from the service
   */
  const loadEntries = () => {
    try {
      const allEntries = journalService.getAllEntries();
      setEntries(allEntries);
      
      // Select the first entry if available and none is currently selected
      if (allEntries.length > 0 && !selectedEntryId && !isNewEntry) {
        setSelectedEntryId(allEntries[0].id);
      }
    } catch (error) {
      console.error('Error loading journal entries:', error);
    }
  };

  /**
   * Handle entry selection
   * @param {string} entryId - The ID of the selected entry
   */
  const handleSelectEntry = (entryId) => {
    setSelectedEntryId(entryId);
    setIsNewEntry(false);
    setActiveTab(0); // Set view tab as default when clicking an entry
    setShowForm(false);
  };

  /**
   * Handle creating a new entry
   */
  const handleCreateEntry = () => {
    setSelectedEntryId(null);
    setIsNewEntry(true);
    setShowForm(true);
    setActiveTab(1); // Switch to edit tab
    setSelectedEntry(createJournalEntry({
      title: '',
      content: ''
    }));
  };

  /**
   * Handle saving an entry
   * @param {Object} savedEntry - The saved entry
   */
  const handleSaveEntry = (savedEntry) => {
    loadEntries(); // Reload all entries
    setSelectedEntryId(savedEntry.id);
    setIsNewEntry(false);
    setShowForm(false);
    setActiveTab(0); // Switch back to view tab
  };

  /**
   * Handle canceling form edit/create
   */
  const handleCancelForm = () => {
    setShowForm(false);
    setActiveTab(0); // Switch back to view tab
    
    if (isNewEntry) {
      // If canceling a new entry, select the first entry if available
      if (entries.length > 0) {
        setSelectedEntryId(entries[0].id);
      } else {
        setSelectedEntry(null);
      }
      setIsNewEntry(false);
    }
  };

  /**
   * Handle tab change between view and edit modes
   * @param {Event} event - The event object
   * @param {number} newValue - The index of the selected tab
   */
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setShowForm(newValue === 1);
  };

  /**
   * Handle editing an existing entry
   */
  const handleEditEntry = () => {
    if (selectedEntry) {
      setShowForm(true);
      setActiveTab(1); // Switch to edit tab
    }
  };

  /**
   * Handle deleting an entry
   */
  const handleDeleteEntry = () => {
    setSelectedEntryId(null);
    setSelectedEntry(null);
    setIsNewEntry(false);
    loadEntries(); // Reload all entries
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <AppBar position="fixed">
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Typography
              variant="h6"
              sx={{
                mr: 4,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <span style={{ color: '#E87A41' }}>*</span> Daily Journal
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 10, mb: 4 }}>
        <Grid container spacing={3} sx={{ height: 'calc(100vh - 140px)' }}>
          {/* Journal Entry List */}
          <Grid item xs={12} md={4} lg={3} sx={{ height: '100%' }}>
            <JournalEntryList 
              onSelectEntry={handleSelectEntry}
              onCreateEntry={handleCreateEntry}
              selectedEntryId={selectedEntryId}
            />
          </Grid>
          
          {/* Journal Entry Detail */}
          <Grid item xs={12} md={8} lg={9} sx={{ height: '100%' }}>
            <Paper 
              elevation={2} 
              sx={{ 
                height: '100%', 
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'auto'
              }}
            >
              {selectedEntry || isNewEntry ? (
                <>
                  {/* Tabs for switching between view and edit modes */}
                  <Tabs 
                    value={activeTab} 
                    onChange={handleTabChange}
                    sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
                  >
                    <Tab label="View" disabled={isNewEntry} />
                    <Tab label={isNewEntry ? "Create" : "Edit"} />
                  </Tabs>
                  
                  {/* Show either the JournalEntry view or JournalEntryForm based on activeTab */}
                  {activeTab === 0 ? (
                    <JournalEntryForm
                      entry={selectedEntry}
                      onSave={handleSaveEntry}
                      onCancel={handleCancelForm}
                      mode="view"
                      onEdit={handleEditEntry}
                    />
                  ) : (
                    <JournalEntryForm
                      entry={selectedEntry}
                      onSave={handleSaveEntry}
                      onCancel={handleCancelForm}
                      mode="edit"
                    />
                  )}
                </>
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  height: '100%'
                }}>
                  <Typography variant="h6" color="text.secondary">
                    Select an entry or create a new one
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreateEntry}
                    sx={{ mt: 2 }}
                  >
                    Create New Entry
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default App;
import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import JournalEntry from './components/JournalEntry/JournalEntry';
import JournalEntryForm from './components/JournalEntryForm/JournalEntryForm';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <JournalEntryForm />
    </ThemeProvider>
  );
}

export default App;
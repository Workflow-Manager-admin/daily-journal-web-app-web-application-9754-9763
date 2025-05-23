import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Chip,
  Tab,
  Tabs,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Mood } from '@mui/icons-material';
import { format } from 'date-fns';

interface JournalEntryFormProps {
  entry?: {
    date: Date;
    mood: string;
    tags: string[];
    content: string;
  };
  onSave?: (entry: any) => void;
  readOnly?: boolean;
}

const JournalEntryForm: React.FC<JournalEntryFormProps> = ({
  entry,
  onSave,
  readOnly = false,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [content, setContent] = useState(entry?.content || '');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSave = () => {
    if (onSave) {
      onSave({
        ...entry,
        content,
      });
    }
  };

  const renderMetadataSection = () => {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
          mb: 2,
          p: 2,
          bgcolor: 'background.paper',
          borderRadius: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Date:
          </Typography>
          <Typography variant="body1">
            {entry?.date ? format(entry.date, 'PPP') : 'Not set'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Mood:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Mood sx={{ mr: 0.5 }} />
            <Typography variant="body1">{entry?.mood || 'Not set'}</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Tags:
          </Typography>
          {entry?.tags && entry.tags.length > 0 ? (
            entry.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                variant="outlined"
              />
            ))
          ) : (
            <Typography variant="body1">No tags</Typography>
          )}
        </Box>
      </Box>
    );
  };

  const renderViewMode = () => {
    return (
      <Box sx={{ p: 2 }}>
        {renderMetadataSection()}
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
          {content}
        </Typography>
      </Box>
    );
  };

  const renderEditMode = () => {
    return (
      <Box sx={{ p: 2 }}>
        {renderMetadataSection()}
        <TextField
          fullWidth
          multiline
          minRows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          variant="outlined"
        />
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Box>
    );
  };

  return (
    <Paper elevation={2}>
      {!readOnly && (
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="View" />
          <Tab label="Edit" />
        </Tabs>
      )}
      {activeTab === 0 || readOnly ? renderViewMode() : renderEditMode()}
    </Paper>
  );
};

export default JournalEntryForm;

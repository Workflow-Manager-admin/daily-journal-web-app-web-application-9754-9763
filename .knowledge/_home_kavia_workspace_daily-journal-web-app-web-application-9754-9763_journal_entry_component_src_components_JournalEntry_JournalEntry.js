{"is_source_file": true, "format": "JavaScript", "description": "The JournalEntry component for a React application that displays and allows editing of a single journal entry.", "external_files": ["../../models/JournalEntry", "../../services/journalService"], "external_methods": ["journalService.createEntry", "journalService.updateEntry", "journalService.deleteEntry", "validateJournalEntryData"], "published": [], "classes": [], "methods": [{"name": "JournalEntry", "description": "The main functional component for displaying, editing, and managing a journal entry."}, {"name": "handleEditToggle", "description": "Toggles the editing state of the journal entry."}, {"name": "handleSave", "description": "Validates and saves the journal entry, calling the appropriate service method based on whether it is a new entry or an update."}, {"name": "handleDelete", "description": "Deletes the current journal entry using the associated service."}, {"name": "handleCloseNotification", "description": "Closes the notification snackbar."}, {"name": "getMoodDisplayName", "description": "Returns the display name for a mood based on its value."}], "calls": ["useState", "useEffect", "setTitle", "setContent", "setErrors", "setNotification", "onEdit", "journalService.createEntry", "journalService.updateEntry", "journalService.deleteEntry", "formatDate"], "search-terms": ["JournalEntry", "entry management", "journal component"], "state": 2, "file_id": 21, "knowledge_revision": 77, "git_revision": "c014d594d6f74f33d646ba8d693591816701fc51", "revision_history": [{"43": "774faf830ccb0b3639465231d87d116542aff5ae"}, {"56": "2beb72249c3e9267cdfecfde9fa053ce342c53c7"}, {"71": "2beb72249c3e9267cdfecfde9fa053ce342c53c7"}, {"72": "2beb72249c3e9267cdfecfde9fa053ce342c53c7"}, {"73": "2beb72249c3e9267cdfecfde9fa053ce342c53c7"}, {"74": "a0891d49cd62f7827e6e2329041f107e9f9f8a19"}, {"75": "a0891d49cd62f7827e6e2329041f107e9f9f8a19"}, {"76": "a0891d49cd62f7827e6e2329041f107e9f9f8a19"}, {"77": "c014d594d6f74f33d646ba8d693591816701fc51"}], "ctags": [{"_type": "tag", "name": "6000", "path": "/home/kavia/workspace/daily-journal-web-app-web-application-9754-9763/journal_entry_component/src/components/JournalEntry/JournalEntry.js", "pattern": "/^        autoHideDuration={6000} $/", "language": "JavaScript", "kind": "field", "scope": "autoHideDuration", "scopeKind": "class"}, {"_type": "tag", "name": "JournalEntry", "path": "/home/kavia/workspace/daily-journal-web-app-web-application-9754-9763/journal_entry_component/src/components/JournalEntry/JournalEntry.js", "pattern": "/^const JournalEntry = ({ entry, onSave, onDelete, isNew = false, onEdit }) => {$/", "language": "JavaScript", "kind": "constant"}, {"_type": "tag", "name": "anxious", "path": "/home/kavia/workspace/daily-journal-web-app-web-application-9754-9763/journal_entry_component/src/components/JournalEntry/JournalEntry.js", "pattern": "/^      'anxious': 'Anxious',$/", "language": "JavaScript", "kind": "property", "scope": "moodMap", "scopeKind": "class"}, {"_type": "tag", "name": "calm", "path": "/home/kavia/workspace/daily-journal-web-app-web-application-9754-9763/journal_entry_component/src/components/JournalEntry/JournalEntry.js", "pattern": "/^      'calm': 'Calm',$/", "language": "JavaScript", "kind": "property", "scope": "moodMap", "scopeKind": "class"}, {"_type": "tag", "name": "entry", "path": "/home/kavia/workspace/daily-journal-web-app-web-application-9754-9763/journal_entry_component/src/components/JournalEntry/JournalEntry.js", "pattern": "/^const JournalEntry = ({ entry, onSave, onDelete, isNew = false, onEdit }) => {$/", "language": "JavaScript", "kind": "field", "scope": "JournalEntry", "scopeKind": "class"}, {"_type": "tag", "name": "entryData", "path": "/home/kavia/workspace/daily-journal-web-app-web-application-9754-9763/journal_entry_component/src/components/JournalEntry/JournalEntry.js", "pattern": "/^    const entryData = { title, content };$/", "language": "JavaScript", "kind": "constant"}, {"_type": "tag", "name": "excited", "path": "/home/kavia/workspace/daily-journal-web-app-web-application-9754-9763/journal_entry_component/src/components/JournalEntry/JournalEntry.js", "pattern": "/^      'excited': 'Excited',$/", "language": "JavaScript", "kind": "property", "scope": "moodMap", "scopeKind": "class"}, {"_type": "tag", "name": "frustrated", "path": "/home/kavia/workspace/daily-journal-web-app-web-application-9754-9763/journal_entry_component/src/components/JournalEntry/JournalEntry.js", "pattern": "/^      'frustrated': 'Frustrated',$/", "language": "JavaScript", "kind": "property", "scope": "moodMap", "scopeKind": "class"}, {"_type": "tag", "name": "getMoodDisplayName", "path": "/home/kavia/workspace/daily-journal-web-app-web-application-9754-9763/journal_entry_component/src/components/JournalEntry/JournalEntry.js", "pattern": "/^  const getMoodDisplayName = (moodValue) => {$/", "language": "JavaScript", "kind": "constant"}, {"_type": "tag", "name": "grateful", "path": "/home/kavia/workspace/daily-journal-web-app-web-application-9754-9763/journal_entry_component/src/components/JournalEntry/JournalEntry.js", "pattern": "/^      'grateful': 'Grateful'$/", "language": "JavaScript", "kind": "property", "scope": "moodMap", "scopeKind": "class"}, {"_type": "tag", "name": "handleCloseNotification", "path": "/home/kavia/workspace/daily-journal-web-app-web-application-9754-9763/journal_entry_component/src/components/JournalEntry/JournalEntry.js", "pattern": "/^          onClose={handleCloseNotification} $/", "language": "JavaScript", "kind": "field", "scope": "onClose", "scopeKind": "class"}, {"_type": "tag", "name": "handleCloseNotification", "path": "/home/kavia/workspace/daily-journal-web-app-web-application-9754-9763/journal_entry_component/src/components/JournalEntry/JournalEntry.js", "pattern": "/^        onClose={handleCloseNotification}$/", "language": "JavaScript", "kind": "field", "scope": "onClose", "scopeKind": "class"}, {"_type": "tag", "name": "handleCloseNotification", "path": "/home/kavia/workspace/daily-journal-web-app-web-application-9754-9763/journal_entry_component/src/components/JournalEntry/JournalEntry.js", "pattern": "/^  const handleCloseNotification = () => {$/", "language": "JavaScript", "kind": "constant"}, {"_type": "tag", "name": "handleDelete", "path": "/home/kavia/workspace/daily-journal-web-app-web-application-9754-9763/journal_entry_component/src/components/JournalEntry/JournalEntry.js", "pattern": "/^  const handleDelete = () => {$/", "language": "JavaScript", "kind": "constant"}, {"_type": "tag", "name": "handleEditToggle", "path": "/home/kavia/workspace/daily-journal-web-app-web-application-9754-9763/journal_entry_component/src/components/JournalEntry/JournalEntry.js", "pattern": "/^  const handleEditToggle = () => {$/", "language": "JavaScript", "kind": "constant"}, {"_type": "tag", "name": "handleSave", "path": "/home/kavia/workspace/daily-journal-web-app-web-application-9754-9763/journal_entry_component/src/components/JournalEntry/JournalEntry.js", "pattern": "/^  const handleSave = () => {$/", "language": "JavaScript", "kind": "constant"}, {"_type": "tag", "name": "happy", "path": "/home/kavia/workspace/daily-journal-web-app-web-application-9754-9763/journal_entry_component/src/components/JournalEntry/JournalEntry.js", "pattern": "/^      'happy': 'Happy',$/", "language": "JavaScript", "kind": "property", "scope": "moodMap", "scopeKind": "class"}, {"_type": "tag", "name": "moodMap", "path": "/home/kavia/workspace/daily-journal-web-app-web-application-9754-9763/journal_entry_component/src/components/JournalEntry/JournalEntry.js", "pattern": "/^    const moodMap = {$/", "language": "JavaScript", "kind": "class"}, {"_type": "tag", "name": "notification", "path": "/home/kavia/workspace/daily-journal-web-app-web-application-9754-9763/journal_entry_component/src/components/JournalEntry/JournalEntry.js", "pattern": "/^          severity={notification.severity} $/", "language": "JavaScript", "kind": "field", "scope": "severity", "scopeKind": "class"}, {"_type": "tag", "name": "notification", "path": "/home/kavia/workspace/daily-journal-web-app-web-application-9754-9763/journal_entry_component/src/components/JournalEntry/JournalEntry.js", "pattern": "/^        open={notification.open} $/", "language": "JavaScript", "kind": "field", "scope": "open", "scopeKind": "class"}, {"_type": "tag", "name": "result", "path": "/home/kavia/workspace/daily-journal-web-app-web-application-9754-9763/journal_entry_component/src/components/JournalEntry/JournalEntry.js", "pattern": "/^      const result = journalService.deleteEntry(entry.id);$/", "language": "JavaScript", "kind": "constant"}, {"_type": "tag", "name": "result", "path": "/home/kavia/workspace/daily-journal-web-app-web-application-9754-9763/journal_entry_component/src/components/JournalEntry/JournalEntry.js", "pattern": "/^      let result;$/", "language": "JavaScript", "kind": "variable"}, {"_type": "tag", "name": "sad", "path": "/home/kavia/workspace/daily-journal-web-app-web-application-9754-9763/journal_entry_component/src/components/JournalEntry/JournalEntry.js", "pattern": "/^      'sad': 'Sad',$/", "language": "JavaScript", "kind": "property", "scope": "moodMap", "scopeKind": "class"}, {"_type": "tag", "name": "setContent", "path": "/home/kavia/workspace/daily-journal-web-app-web-application-9754-9763/journal_entry_component/src/components/JournalEntry/JournalEntry.js", "pattern": "/^  const [content, setContent] = useState('');$/", "language": "JavaScript", "kind": "constant"}, {"_type": "tag", "name": "setErrors", "path": "/home/kavia/workspace/daily-journal-web-app-web-application-9754-9763/journal_entry_component/src/components/JournalEntry/JournalEntry.js", "pattern": "/^  const [errors, setErrors] = useState({});$/", "language": "JavaScript", "kind": "constant"}, {"_type": "tag", "name": "setIsEditing", "path": "/home/kavia/workspace/daily-journal-web-app-web-application-9754-9763/journal_entry_component/src/components/JournalEntry/JournalEntry.js", "pattern": "/^  const [isEditing, setIsEditing] = useState(isNew);$/", "language": "JavaScript", "kind": "constant"}, {"_type": "tag", "name": "setNotification", "path": "/home/kavia/workspace/daily-journal-web-app-web-application-9754-9763/journal_entry_component/src/components/JournalEntry/JournalEntry.js", "pattern": "/^  const [notification, setNotification] = useState({ open: false, message: '', severity: 'succes/", "language": "JavaScript", "kind": "constant"}, {"_type": "tag", "name": "setTitle", "path": "/home/kavia/workspace/daily-journal-web-app-web-application-9754-9763/journal_entry_component/src/components/JournalEntry/JournalEntry.js", "pattern": "/^  const [title, setTitle] = useState('');$/", "language": "JavaScript", "kind": "constant"}, {"_type": "tag", "name": "title", "path": "/home/kavia/workspace/daily-journal-web-app-web-application-9754-9763/journal_entry_component/src/components/JournalEntry/JournalEntry.js", "pattern": "/^    const entryData = { title, content };$/", "language": "JavaScript", "kind": "field", "scope": "entryData", "scopeKind": "class"}, {"_type": "tag", "name": "validation", "path": "/home/kavia/workspace/daily-journal-web-app-web-application-9754-9763/journal_entry_component/src/components/JournalEntry/JournalEntry.js", "pattern": "/^    const validation = validateJournalEntryData(entryData);$/", "language": "JavaScript", "kind": "constant"}], "filename": "/home/kavia/workspace/daily-journal-web-app-web-application-9754-9763/journal_entry_component/src/components/JournalEntry/JournalEntry.js", "hash": "7eb3b75bc882a9454beb45645c6063b6", "format-version": 4, "code-base-name": "default", "fields": [{"name": "autoHideDuration={6000}", "scope": "autoHideDuration", "scopeKind": "class", "description": "unavailable"}, {"name": "'anxious': 'Anxious',", "scope": "moodMap", "scopeKind": "class", "description": "unavailable"}, {"name": "'calm': 'Calm',", "scope": "moodMap", "scopeKind": "class", "description": "unavailable"}, {"name": "const JournalEntry = ({ entry, onSave, onDelete, isNew = false, onEdit }) => {", "scope": "JournalEntry", "scopeKind": "class", "description": "unavailable"}, {"name": "'excited': 'Excited',", "scope": "moodMap", "scopeKind": "class", "description": "unavailable"}, {"name": "'frustrated': 'Frustrated',", "scope": "moodMap", "scopeKind": "class", "description": "unavailable"}, {"name": "'grateful': 'Grateful'", "scope": "moodMap", "scopeKind": "class", "description": "unavailable"}, {"name": "onClose={handleCloseNotification}", "scope": "onClose", "scopeKind": "class", "description": "unavailable"}, {"name": "'happy': 'Happy',", "scope": "moodMap", "scopeKind": "class", "description": "unavailable"}, {"name": "severity={notification.severity}", "scope": "severity", "scopeKind": "class", "description": "unavailable"}, {"name": "open={notification.open}", "scope": "open", "scopeKind": "class", "description": "unavailable"}, {"name": "let result;", "scope": "", "scopeKind": "", "description": "unavailable"}, {"name": "'sad': 'Sad',", "scope": "moodMap", "scopeKind": "class", "description": "unavailable"}, {"name": "const entryData = { title, content };", "scope": "entryData", "scopeKind": "class", "description": "unavailable"}]}
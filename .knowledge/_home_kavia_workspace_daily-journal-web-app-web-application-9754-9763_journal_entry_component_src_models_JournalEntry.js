{"is_source_file": true, "format": "JavaScript", "description": "This file defines the JournalEntry model which structures data for journal entries and provides utility functions related to journal entries.", "external_files": [], "external_methods": [], "published": ["JournalEntry", "createJournalEntry", "formatDate", "validateJournalEntryData"], "classes": [{"name": "JournalEntry", "description": "A class representing a journal entry with methods for validation, updating, and converting to different formats."}], "methods": [{"name": "constructor(data)", "description": "Initializes a new instance of the JournalEntry class with the provided data.", "scope": "JournalEntry", "scopeKind": "class"}, {"name": "generateId()", "description": "Generates a unique ID for a journal entry.", "scope": "JournalEntry", "scopeKind": "class"}, {"name": "isValid()", "description": "Checks if the journal entry is valid based on title and content.", "scope": "JournalEntry", "scopeKind": "class"}, {"name": "update(data)", "description": "Updates the journal entry with new data.", "scope": "JournalEntry", "scopeKind": "class"}, {"name": "toObject()", "description": "Converts the journal entry instance to a plain object.", "scope": "JournalEntry", "scopeKind": "class"}, {"name": "toJSON()", "description": "Converts the journal entry instance to a JSON string.", "scope": "JournalEntry", "scopeKind": "class"}, {"name": "formatDate(date, format = 'default')", "description": "Formats a date to a human-readable string.", "scope": "", "scopeKind": ""}, {"name": "createJournalEntry(data = {})", "description": "Creates a new instance of a journal entry given the entry data.", "scope": "", "scopeKind": ""}, {"name": "validateJournalEntryData(data)", "description": "Validates the journal entry data and returns validation results.", "scope": "", "scopeKind": ""}, {"name": "getRelativeTimeString(date)", "scope": "", "scopeKind": "", "description": "unavailable"}], "calls": ["Array.isArray", "new Date", "JSON.stringify"], "search-terms": ["JournalEntry", "entry validation", "journal utility functions"], "state": 2, "file_id": 19, "knowledge_revision": 82, "git_revision": "0f24be76120482430f97f5c7adc5c9f24388c06a", "revision_history": [{"39": ""}, {"81": "0fd40eb028490daf40bf5f1d63ac1aa97bdef166"}, {"82": "0f24be76120482430f97f5c7adc5c9f24388c06a"}], "ctags": [{"_type": "tag", "name": "JournalEntry", "path": "/home/kavia/workspace/daily-journal-web-app-web-application-9754-9763/journal_entry_component/src/models/JournalEntry.js", "pattern": "/^class JournalEntry {$/", "language": "JavaScript", "kind": "class"}, {"_type": "tag", "name": "constructor", "path": "/home/kavia/workspace/daily-journal-web-app-web-application-9754-9763/journal_entry_component/src/models/JournalEntry.js", "pattern": "/^  constructor(data) {$/", "language": "JavaScript", "kind": "method", "signature": "(data)", "scope": "JournalEntry", "scopeKind": "class"}, {"_type": "tag", "name": "createJournalEntry", "path": "/home/kavia/workspace/daily-journal-web-app-web-application-9754-9763/journal_entry_component/src/models/JournalEntry.js", "pattern": "/^function createJournalEntry(data = {}) {$/", "language": "JavaScript", "kind": "function", "signature": "(data = {})"}, {"_type": "tag", "name": "formatDate", "path": "/home/kavia/workspace/daily-journal-web-app-web-application-9754-9763/journal_entry_component/src/models/JournalEntry.js", "pattern": "/^function formatDate(date, format = 'default') {$/", "language": "JavaScript", "kind": "function", "signature": "(date, format = 'default')"}, {"_type": "tag", "name": "generateId", "path": "/home/kavia/workspace/daily-journal-web-app-web-application-9754-9763/journal_entry_component/src/models/JournalEntry.js", "pattern": "/^  generateId() {$/", "language": "JavaScript", "kind": "method", "signature": "()", "scope": "JournalEntry", "scopeKind": "class"}, {"_type": "tag", "name": "getRelativeTimeString", "path": "/home/kavia/workspace/daily-journal-web-app-web-application-9754-9763/journal_entry_component/src/models/JournalEntry.js", "pattern": "/^function getRelativeTimeString(date) {$/", "language": "JavaScript", "kind": "function", "signature": "(date)"}, {"_type": "tag", "name": "isValid", "path": "/home/kavia/workspace/daily-journal-web-app-web-application-9754-9763/journal_entry_component/src/models/JournalEntry.js", "pattern": "/^  isValid() {$/", "language": "JavaScript", "kind": "method", "signature": "()", "scope": "JournalEntry", "scopeKind": "class"}, {"_type": "tag", "name": "toJSON", "path": "/home/kavia/workspace/daily-journal-web-app-web-application-9754-9763/journal_entry_component/src/models/JournalEntry.js", "pattern": "/^  toJSON() {$/", "language": "JavaScript", "kind": "method", "signature": "()", "scope": "JournalEntry", "scopeKind": "class"}, {"_type": "tag", "name": "toObject", "path": "/home/kavia/workspace/daily-journal-web-app-web-application-9754-9763/journal_entry_component/src/models/JournalEntry.js", "pattern": "/^  toObject() {$/", "language": "JavaScript", "kind": "method", "signature": "()", "scope": "JournalEntry", "scopeKind": "class"}, {"_type": "tag", "name": "update", "path": "/home/kavia/workspace/daily-journal-web-app-web-application-9754-9763/journal_entry_component/src/models/JournalEntry.js", "pattern": "/^  update(data) {$/", "language": "JavaScript", "kind": "method", "signature": "(data)", "scope": "JournalEntry", "scopeKind": "class"}, {"_type": "tag", "name": "validateJournalEntryData", "path": "/home/kavia/workspace/daily-journal-web-app-web-application-9754-9763/journal_entry_component/src/models/JournalEntry.js", "pattern": "/^function validateJournalEntryData(data) {$/", "language": "JavaScript", "kind": "function", "signature": "(data)"}], "filename": "/home/kavia/workspace/daily-journal-web-app-web-application-9754-9763/journal_entry_component/src/models/JournalEntry.js", "hash": "1003198ca28088e2f618a50597637780", "format-version": 4, "code-base-name": "default"}
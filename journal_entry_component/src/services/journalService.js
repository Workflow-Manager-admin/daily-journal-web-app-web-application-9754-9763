/**
 * @fileoverview Journal service that provides CRUD operations for journal entries
 * and handles data persistence using localStorage.
 */

import {
  JournalEntry,
  createJournalEntry,
  validateJournalEntryData
} from '../models/JournalEntry';

// Storage key for journal entries in localStorage
const STORAGE_KEY = 'journal_entries';

/**
 * Helper function to get all entries from localStorage.
 * @returns {Array<JournalEntry>} Array of journal entries.
 * @private
 */
const getEntriesFromStorage = () => {
  try {
    const entriesJson = localStorage.getItem(STORAGE_KEY);
    if (!entriesJson) return [];
    
    const entriesData = JSON.parse(entriesJson);
    return entriesData.map(data => new JournalEntry(data));
  } catch (error) {
    console.error('Error retrieving journal entries from localStorage:', error);
    return [];
  }
};

/**
 * Helper function to save entries to localStorage.
 * @param {Array<JournalEntry>} entries - The entries to save.
 * @returns {boolean} True if successful, false otherwise.
 * @private
 */
const saveEntriesToStorage = (entries) => {
  try {
    const entriesData = entries.map(entry => entry.toObject());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entriesData));
    return true;
  } catch (error) {
    console.error('Error saving journal entries to localStorage:', error);
    return false;
  }
};

/**
 * Get all journal entries.
 * @returns {Array<JournalEntry>} Array of journal entries.
 * @public
 */
export const getAllEntries = () => {
  return getEntriesFromStorage();
};

/**
 * Get a journal entry by ID.
 * @param {string} id - The ID of the entry to retrieve.
 * @returns {JournalEntry|null} The journal entry if found, null otherwise.
 * @public
 */
export const getEntryById = (id) => {
  if (!id) return null;
  
  const entries = getEntriesFromStorage();
  const entry = entries.find(entry => entry.id === id);
  return entry || null;
};

/**
 * Create a new journal entry.
 * @param {Object} entryData - The data for the new entry.
 * @returns {Object} Object containing the created entry and any errors.
 * @property {JournalEntry|null} entry - The created entry, or null if validation failed.
 * @property {Object|null} errors - Validation errors, or null if validation passed.
 * @public
 */
export const createEntry = (entryData) => {
  // Validate the entry data
  const validation = validateJournalEntryData(entryData);
  if (!validation.isValid) {
    return { entry: null, errors: validation.errors };
  }
  
  try {
    // Create a new entry
    const newEntry = createJournalEntry(entryData);
    
    // Get existing entries and add the new one
    const entries = getEntriesFromStorage();
    entries.push(newEntry);
    
    // Save to localStorage
    const saved = saveEntriesToStorage(entries);
    if (!saved) {
      return { 
        entry: null, 
        errors: { storage: 'Failed to save entry to storage' } 
      };
    }
    
    return { entry: newEntry, errors: null };
  } catch (error) {
    console.error('Error creating journal entry:', error);
    return { 
      entry: null, 
      errors: { general: 'An unexpected error occurred while creating the entry' } 
    };
  }
};

/**
 * Update an existing journal entry.
 * @param {string} id - The ID of the entry to update.
 * @param {Object} entryData - The new data for the entry.
 * @returns {Object} Object containing the updated entry and any errors.
 * @property {JournalEntry|null} entry - The updated entry, or null if update failed.
 * @property {Object|null} errors - Validation errors, or null if validation passed.
 * @public
 */
export const updateEntry = (id, entryData) => {
  if (!id) {
    return { 
      entry: null, 
      errors: { id: 'Entry ID is required' } 
    };
  }
  
  // Validate the entry data
  const validation = validateJournalEntryData({
    ...entryData,
    id // Ensure ID is included for validation
  });
  
  if (!validation.isValid) {
    return { entry: null, errors: validation.errors };
  }
  
  try {
    // Get existing entries
    const entries = getEntriesFromStorage();
    const entryIndex = entries.findIndex(entry => entry.id === id);
    
    if (entryIndex === -1) {
      return { 
        entry: null, 
        errors: { id: 'Entry not found' } 
      };
    }
    
    // Update the entry
    const updatedEntry = entries[entryIndex].update(entryData);
    entries[entryIndex] = updatedEntry;
    
    // Save to localStorage
    const saved = saveEntriesToStorage(entries);
    if (!saved) {
      return { 
        entry: null, 
        errors: { storage: 'Failed to save updated entry to storage' } 
      };
    }
    
    return { entry: updatedEntry, errors: null };
  } catch (error) {
    console.error('Error updating journal entry:', error);
    return { 
      entry: null, 
      errors: { general: 'An unexpected error occurred while updating the entry' } 
    };
  }
};

/**
 * Delete a journal entry.
 * @param {string} id - The ID of the entry to delete.
 * @returns {Object} Object containing the result of the operation.
 * @property {boolean} success - Whether the deletion was successful.
 * @property {Object|null} errors - Any errors that occurred, or null if successful.
 * @public
 */
export const deleteEntry = (id) => {
  if (!id) {
    return { 
      success: false, 
      errors: { id: 'Entry ID is required' } 
    };
  }
  
  try {
    // Get existing entries
    const entries = getEntriesFromStorage();
    const entryIndex = entries.findIndex(entry => entry.id === id);
    
    if (entryIndex === -1) {
      return { 
        success: false, 
        errors: { id: 'Entry not found' } 
      };
    }
    
    // Remove the entry
    entries.splice(entryIndex, 1);
    
    // Save to localStorage
    const saved = saveEntriesToStorage(entries);
    if (!saved) {
      return { 
        success: false, 
        errors: { storage: 'Failed to save changes to storage' } 
      };
    }
    
    return { success: true, errors: null };
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    return { 
      success: false, 
      errors: { general: 'An unexpected error occurred while deleting the entry' } 
    };
  }
};

/**
 * Search for journal entries by title or content.
 * @param {string} query - The search query.
 * @returns {Array<JournalEntry>} Array of matching journal entries.
 * @public
 */
export const searchEntries = (query) => {
  if (!query || typeof query !== 'string') {
    return getAllEntries();
  }
  
  const entries = getEntriesFromStorage();
  const normalizedQuery = query.toLowerCase().trim();
  
  return entries.filter(entry => {
    const titleMatch = entry.title.toLowerCase().includes(normalizedQuery);
    const contentMatch = entry.content.toLowerCase().includes(normalizedQuery);
    return titleMatch || contentMatch;
  });
};

/**
 * Filter journal entries by a custom filter function.
 * @param {Function} filterFn - The filter function to apply.
 * @returns {Array<JournalEntry>} Array of filtered journal entries.
 * @public
 */
export const filterEntries = (filterFn) => {
  if (typeof filterFn !== 'function') {
    return getAllEntries();
  }
  
  const entries = getEntriesFromStorage();
  return entries.filter(filterFn);
};

/**
 * Sort journal entries by a specified field and direction.
 * @param {string} field - The field to sort by (e.g., 'createdAt', 'title').
 * @param {string} [direction='desc'] - The sort direction ('asc' or 'desc').
 * @returns {Array<JournalEntry>} Array of sorted journal entries.
 * @public
 */
export const sortEntries = (field, direction = 'desc') => {
  const entries = getEntriesFromStorage();
  
  if (!field || !entries.length || !entries[0].hasOwnProperty(field)) {
    return entries;
  }
  
  const sortedEntries = [...entries];
  
  sortedEntries.sort((a, b) => {
    let valueA = a[field];
    let valueB = b[field];
    
    // Handle date comparisons
    if (valueA instanceof Date && valueB instanceof Date) {
      valueA = valueA.getTime();
      valueB = valueB.getTime();
    }
    
    // Handle string comparisons
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return direction === 'asc' 
        ? valueA.localeCompare(valueB) 
        : valueB.localeCompare(valueA);
    }
    
    // Handle number comparisons
    return direction === 'asc' ? valueA - valueB : valueB - valueA;
  });
  
  return sortedEntries;
};

/**
 * Clear all journal entries from storage.
 * @returns {boolean} True if successful, false otherwise.
 * @public
 */
export const clearAllEntries = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing journal entries:', error);
    return false;
  }
};

/**
 * Check if localStorage is available in the current environment.
 * @returns {boolean} True if localStorage is available, false otherwise.
 * @public
 */
export const isStorageAvailable = () => {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Export entries to JSON string for backup purposes.
 * @returns {string|null} JSON string of all entries, or null if export failed.
 * @public
 */
export const exportEntries = () => {
  try {
    const entries = getEntriesFromStorage();
    return JSON.stringify(entries.map(entry => entry.toObject()));
  } catch (error) {
    console.error('Error exporting journal entries:', error);
    return null;
  }
};

/**
 * Import entries from JSON string.
 * @param {string} jsonString - JSON string containing entry data.
 * @param {boolean} [replace=false] - Whether to replace existing entries.
 * @returns {Object} Object containing the result of the operation.
 * @property {boolean} success - Whether the import was successful.
 * @property {number} count - Number of entries imported.
 * @property {Object|null} errors - Any errors that occurred, or null if successful.
 * @public
 */
export const importEntries = (jsonString, replace = false) => {
  if (!jsonString || typeof jsonString !== 'string') {
    return { 
      success: false, 
      count: 0, 
      errors: { input: 'Invalid input for import' } 
    };
  }
  
  try {
    // Parse the JSON string
    const importedData = JSON.parse(jsonString);
    
    if (!Array.isArray(importedData)) {
      return { 
        success: false, 
        count: 0, 
        errors: { format: 'Import data is not in the expected format' } 
      };
    }
    
    // Create JournalEntry objects from the imported data
    const importedEntries = importedData.map(data => new JournalEntry(data));
    
    // Get existing entries or use an empty array if replacing
    const existingEntries = replace ? [] : getEntriesFromStorage();
    
    // Combine entries, avoiding duplicates by ID
    const existingIds = new Set(existingEntries.map(entry => entry.id));
    const uniqueImportedEntries = importedEntries.filter(entry => !existingIds.has(entry.id));
    
    const combinedEntries = [...existingEntries, ...uniqueImportedEntries];
    
    // Save to localStorage
    const saved = saveEntriesToStorage(combinedEntries);
    if (!saved) {
      return { 
        success: false, 
        count: 0, 
        errors: { storage: 'Failed to save imported entries to storage' } 
      };
    }
    
    return { 
      success: true, 
      count: uniqueImportedEntries.length, 
      errors: null 
    };
  } catch (error) {
    console.error('Error importing journal entries:', error);
    return { 
      success: false, 
      count: 0, 
      errors: { general: 'An unexpected error occurred during import' } 
    };
  }
};

// Default export as an object with all functions
export default {
  getAllEntries,
  getEntryById,
  createEntry,
  updateEntry,
  deleteEntry,
  searchEntries,
  filterEntries,
  sortEntries,
  clearAllEntries,
  isStorageAvailable,
  exportEntries,
  importEntries
};

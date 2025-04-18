/**
 * @fileoverview JournalEntry model that defines the structure of a journal entry
 * and provides utility functions for working with journal entries.
 */

/**
 * @typedef {Object} JournalEntryData
 * @property {string} [id] - Unique identifier for the journal entry
 * @property {string} title - Title of the journal entry
 * @property {string} content - Content of the journal entry
 * @property {Date|string} [createdAt] - Date when the journal entry was created
 * @property {Date|string} [updatedAt] - Date when the journal entry was last updated
 * @property {string} [mood] - The mood associated with the journal entry
 * @property {string[]} [tags] - Array of tags associated with the journal entry
 */

/**
 * Class representing a journal entry.
 */
class JournalEntry {
  /**
   * Create a journal entry.
   * @param {JournalEntryData} data - The journal entry data.
   */
  constructor(data) {
    this.id = data.id || this.generateId();
    this.title = data.title || '';
    this.content = data.content || '';
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
    this.mood = data.mood || '';
    this.tags = Array.isArray(data.tags) ? [...data.tags] : [];
  }

  /**
   * Generate a unique ID for a new journal entry.
   * @returns {string} A unique ID.
   * @private
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
  }

  /**
   * Check if the journal entry is valid.
   * @returns {boolean} True if the entry is valid, false otherwise.
   */
  isValid() {
    return (
      typeof this.title === 'string' &&
      this.title.trim().length > 0 &&
      typeof this.content === 'string' &&
      this.content.trim().length > 0
    );
  }

  /**
   * Update the journal entry with new data.
   * @param {Partial<JournalEntryData>} data - The data to update.
   * @returns {JournalEntry} The updated journal entry.
   */
  update(data) {
    if (data.title !== undefined) this.title = data.title;
    if (data.content !== undefined) this.content = data.content;
    if (data.mood !== undefined) this.mood = data.mood;
    if (data.tags !== undefined) this.tags = Array.isArray(data.tags) ? [...data.tags] : this.tags;
    this.updatedAt = new Date();
    return this;
  }

  /**
   * Convert the journal entry to a plain object.
   * @returns {JournalEntryData} The journal entry as a plain object.
   */
  toObject() {
    return {
      id: this.id,
      title: this.title,
      content: this.content,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      mood: this.mood,
      tags: [...this.tags]
    };
  }

  /**
   * Convert the journal entry to a JSON string.
   * @returns {string} The journal entry as a JSON string.
   */
  toJSON() {
    return JSON.stringify(this.toObject());
  }
}

/**
 * Format a date to a human-readable string.
 * @param {Date|string} date - The date to format.
 * @param {string} [format='default'] - The format to use ('default', 'short', 'relative').
 * @returns {string} The formatted date string.
 */
function formatDate(date, format = 'default') {
  const dateObj = date instanceof Date ? date : new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }

  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString();
    case 'relative':
      return getRelativeTimeString(dateObj);
    case 'default':
    default:
      return dateObj.toLocaleString();
  }
}

/**
 * Get a relative time string (e.g., "2 hours ago", "yesterday").
 * @param {Date} date - The date to convert to relative time.
 * @returns {string} The relative time string.
 * @private
 */
function getRelativeTimeString(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);

  if (diffSec < 60) {
    return 'just now';
  } else if (diffMin < 60) {
    return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
  } else if (diffHour < 24) {
    return `${diffHour} hour${diffHour === 1 ? '' : 's'} ago`;
  } else if (diffDay === 1) {
    return 'yesterday';
  } else if (diffDay < 30) {
    return `${diffDay} day${diffDay === 1 ? '' : 's'} ago`;
  } else {
    return formatDate(date, 'short');
  }
}

/**
 * Create a new journal entry.
 * @param {JournalEntryData} data - The journal entry data.
 * @returns {JournalEntry} A new journal entry instance.
 * @public
 */
function createJournalEntry(data = {}) {
  return new JournalEntry(data);
}

/**
 * Validate journal entry data.
 * @param {JournalEntryData} data - The journal entry data to validate.
 * @returns {Object} An object containing validation results.
 * @property {boolean} isValid - Whether the data is valid.
 * @property {Object} errors - Validation errors, if any.
 * @public
 */
function validateJournalEntryData(data) {
  const errors = {};
  
  if (!data.title || data.title.trim().length === 0) {
    errors.title = 'Title is required';
  }
  
  if (!data.content || data.content.trim().length === 0) {
    errors.content = 'Content is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export {
  JournalEntry,
  createJournalEntry,
  formatDate,
  validateJournalEntryData
};

// API Configuration for the Journal Entry Application

// Constants for API URLs
const PRODUCTION_API_URL = 'https://api.journalapp.com';
const DEVELOPMENT_API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Validate and sanitize API URL
const validateApiUrl = (url) => {
  try {
    if (!url) return false;
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch (error) {
    return false;
  }
};

// Get API URL with validation and fallback
const getApiUrl = () => {
  const envApiUrl = process.env.REACT_APP_API_URL;
  
  // If environment variable is set and valid, use it
  if (envApiUrl && validateApiUrl(envApiUrl)) {
    return envApiUrl.replace(/\/$/, ''); // Remove trailing slash if present
  }

  // Fallback to default URLs based on environment
  const defaultUrl = process.env.NODE_ENV === 'production'
    ? PRODUCTION_API_URL
    : DEVELOPMENT_API_URL;

  // Log warning if environment variable is invalid
  if (envApiUrl) {
    console.warn(
      'Warning: REACT_APP_API_URL is invalid or malformed.\n' +
      `Falling back to default ${process.env.NODE_ENV} URL: ${defaultUrl}`
    );
  }

  return defaultUrl;
};

// Logger for API related errors with enhanced details and retry information
const logApiError = (error) => {
  const errorDetails = {
    message: error.message,
    code: error.code,
    status: error.response?.status,
    data: error.response?.data,
    url: error.config?.url,
    method: error.config?.method,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    retryAttempt: error.retryInfo?.attempt,
    maxRetries: error.retryInfo?.maxRetries,
    willRetry: error.retryInfo?.willRetry,
    timeout: error.config?.timeout
  };

  console.error('API Error:', errorDetails);

  // Additional logging for development environment
  if (process.env.NODE_ENV === 'development') {
    console.debug('Full error object:', error);
  }
};

// Configuration validation
const validateConfig = (config) => {
  const requiredFields = ['BASE_URL', 'ENDPOINTS', 'HEADERS', 'REQUEST_CONFIG'];
  const missingFields = requiredFields.filter(field => !config[field]);

  if (missingFields.length > 0) {
    throw new Error(`Invalid API configuration. Missing required fields: ${missingFields.join(', ')}`);
  }

  if (!validateApiUrl(config.BASE_URL)) {
    throw new Error('Invalid API configuration. BASE_URL is not a valid URL.');
  }
};

// Main API configuration object
const API_CONFIG = {
  BASE_URL: getApiUrl(),
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      REGISTER: '/auth/register'
    },
    JOURNAL: {
      ENTRIES: '/journal/entries',
      ENTRY: '/journal/entry'
    }
  },
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  REQUEST_CONFIG: {
    timeout: 45000, // 45 seconds timeout for better handling of slow connections
    retries: 3,
    retryDelay: 1000, // Initial retry delay
    retryDelayMultiplier: 2, // Exponential backoff multiplier
    maxRetryDelay: 10000, // Maximum retry delay cap
    jitterFactor: 0.25, // Add 25% random jitter to retry delays
    connectionTimeout: 15000, // Increased connection timeout
    validateStatus: (status) => status >= 200 && status < 500,
    shouldRetry: (error) => {
      // Retry on network errors, timeouts, and 5xx server errors
      return (
        error.code === 'ECONNABORTED' || // Timeout
        error.code === 'ECONNREFUSED' || // Server not available
        !error.response || // Network error
        (error.response && error.response.status >= 500) // Server error
      );
    },
    onError: (error) => {
      const retryAttempt = error.config?.retryAttempt || 0;
      const maxRetries = error.config?.retries || 3;
      
      // Enhanced error logging
      logApiError({
        ...error,
        retryInfo: {
          attempt: retryAttempt,
          maxRetries: maxRetries,
          willRetry: retryAttempt < maxRetries
        }
      });
    }
  }
};

// Validate configuration before exporting
try {
  validateConfig(API_CONFIG);
} catch (error) {
  console.error('API Configuration Error:', error.message);
  throw error; // Re-throw to prevent application from starting with invalid config
}

export { logApiError, validateApiUrl, getApiUrl };
export default API_CONFIG;

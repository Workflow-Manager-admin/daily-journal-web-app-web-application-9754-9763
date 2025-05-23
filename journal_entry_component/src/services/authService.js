import API_CONFIG from '../config/api.config';

// Custom error classes for different types of errors
class AuthenticationError extends Error {
  constructor(message, context = {}) {
    super(message);
    this.name = 'AuthenticationError';
    this.context = context;
    this.timestamp = new Date().toISOString();
  }
}

class NetworkError extends Error {
  constructor(message = 'A network error occurred', context = {}) {
    super(message);
    this.name = 'NetworkError';
    this.context = context;
    this.timestamp = new Date().toISOString();
  }
}

class ServerError extends Error {
  constructor(message = 'A server error occurred', context = {}) {
    super(message);
    this.name = 'ServerError';
    this.context = context;
    this.timestamp = new Date().toISOString();
  }
}

class ValidationError extends Error {
  constructor(message = 'Validation failed', context = {}) {
    super(message);
    this.name = 'ValidationError';
    this.context = context;
    this.timestamp = new Date().toISOString();
  }
}

// Circuit breaker implementation
class CircuitBreaker {
  constructor() {
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.resetTimeout = 60000; // 1 minute
    this.failureThreshold = 5;
  }

  recordSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  recordFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
    }
  }

  canRequest() {
    if (this.state === 'CLOSED') return true;
    if (this.state === 'OPEN') {
      const timeElapsed = Date.now() - this.lastFailureTime;
      if (timeElapsed >= this.resetTimeout) {
        this.state = 'HALF_OPEN';
        return true;
      }
      return false;
    }
    return this.state === 'HALF_OPEN';
  }
}

// Request queue for failed operations
class RequestQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
  }

  add(request) {
    this.queue.push(request);
    if (!this.processing) {
      this.processQueue();
    }
  }

  async processQueue() {
    if (this.processing || this.queue.length === 0) return;
    this.processing = true;

    while (this.queue.length > 0) {
      const request = this.queue[0];
      try {
        if (checkConnection()) {
          await request.execute();
          this.queue.shift(); // Remove processed request
        } else {
          break; // Stop processing if no connection
        }
      } catch (error) {
        if (!isRetryableError(error)) {
          this.queue.shift(); // Remove failed request if not retryable
        } else {
          break; // Stop processing on retryable error
        }
      }
      await new Promise(resolve => setTimeout(resolve, 1000)); // Delay between retries
    }

    this.processing = false;
  }
}

// Helper function to check internet connection with active check
function checkConnection() {
  const lastRequest = window.localStorage.getItem('lastSuccessfulRequest');
  if (!navigator.onLine) return false;
  if (!lastRequest) return true;
  
  try {
    const lastRequestTime = parseInt(lastRequest, 10);
    if (isNaN(lastRequestTime)) return true;
    return lastRequestTime > Date.now() - 30000;
  } catch (error) {
    console.warn('Error parsing lastSuccessfulRequest timestamp:', error);
    return true; // Default to allowing connection on parse error
  }
}

// Helper function to calculate retry delay with exponential backoff and jitter
function calculateRetryDelay(retryAttempt) {
  const baseDelay = API_CONFIG.REQUEST_CONFIG.retryDelay;
  const maxDelay = API_CONFIG.REQUEST_CONFIG.maxRetryDelay;
  const exponentialDelay = baseDelay * Math.pow(2, retryAttempt);
  const jitter = Math.random() * 1000; // Add random jitter up to 1 second
  return Math.min(exponentialDelay + jitter, maxDelay);
}

// Helper function to check if error is retryable
function isRetryableError(error) {
  return (
    error instanceof NetworkError ||
    error instanceof ServerError ||
    error instanceof TypeError ||
    (error instanceof Error && error.message.includes('timeout'))
  );
}

// Initialize circuit breaker and request queue
const circuitBreaker = new CircuitBreaker();
const requestQueue = new RequestQueue();

// Helper function for making API requests with retry mechanism and circuit breaker
async function makeRequest(url, options, retries = API_CONFIG.REQUEST_CONFIG.retries) {
  if (!circuitBreaker.canRequest()) {
    throw new NetworkError('Service temporarily unavailable', { 
      circuitBreakerState: circuitBreaker.state,
      failureCount: circuitBreaker.failureCount
    });
  }

  if (!checkConnection()) {
    const error = new NetworkError('No internet connection available');
    requestQueue.add({
      execute: () => makeRequest(url, options, retries),
      timestamp: Date.now()
    });
    throw error;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 
    API_CONFIG.REQUEST_CONFIG.timeout * (API_CONFIG.REQUEST_CONFIG.retries - retries + 1));

  try {
    const startTime = Date.now();
    const response = await Promise.race([
      fetch(url, {
        ...options,
        signal: controller.signal
      }),
      new Promise((_, reject) => {
        setTimeout(
          () => reject(new NetworkError('Connection timeout', { 
            url,
            timeout: API_CONFIG.REQUEST_CONFIG.connectionTimeout
          })),
          API_CONFIG.REQUEST_CONFIG.connectionTimeout
        );
      })
    ]);

    clearTimeout(timeoutId);

    // Update connection status on successful request
    window.localStorage.setItem('lastSuccessfulRequest', Date.now().toString());

    // Check if response should be retried based on status
    if (!API_CONFIG.REQUEST_CONFIG.validateStatus(response.status)) {
      throw new ServerError(`Server error occurred: ${response.status}`, {
        status: response.status,
        url,
        method: options.method,
        responseTime: Date.now() - startTime
      });
    }

    const data = await response.json();

    if (!response.ok) {
      const errorContext = {
        status: response.status,
        url,
        method: options.method,
        responseTime: Date.now() - startTime
      };

      if (response.status === 400) {
        throw new ValidationError(data.message || 'Invalid request', errorContext);
      } else if (response.status === 401 || response.status === 403) {
        throw new AuthenticationError(data.message || 'Authentication failed', errorContext);
      } else {
        throw new Error(data.message || 'Request failed');
      }
    }

    circuitBreaker.recordSuccess();
    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      const timeoutError = new NetworkError('Request timeout', {
        url,
        timeout: API_CONFIG.REQUEST_CONFIG.timeout,
        method: options.method
      });
      circuitBreaker.recordFailure();
      throw timeoutError;
    }

    if (isRetryableError(error) && retries > 0) {
      const delay = calculateRetryDelay(API_CONFIG.REQUEST_CONFIG.retries - retries);
      await new Promise(resolve => setTimeout(resolve, delay));
      return makeRequest(url, options, retries - 1);
    }

    if (error instanceof TypeError) {
      const networkError = new NetworkError('Unable to connect to the server', {
        url,
        method: options.method,
        originalError: error.message
      });
      circuitBreaker.recordFailure();
      throw networkError;
    }

    // Record failure for server and network errors
    if (error instanceof ServerError || error instanceof NetworkError) {
      circuitBreaker.recordFailure();
    }

    throw error;
  }
}

class AuthService {
  static async register(name, email, password) {
    const requestContext = {
      endpoint: API_CONFIG.ENDPOINTS.AUTH.REGISTER,
      method: 'POST',
      timestamp: new Date().toISOString()
    };

    try {
      const data = await makeRequest(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REGISTER}`,
        {
          method: 'POST',
          headers: API_CONFIG.HEADERS,
          body: JSON.stringify({ name, email, password })
        }
      );
      
      // Store the token if registration automatically logs in the user
      if (data.token) {
        localStorage.setItem('journal_auth_token', data.token);
        localStorage.setItem('auth_timestamp', Date.now().toString());
      }
      
      return data;
    } catch (error) {
      const errorContext = {
        ...requestContext,
        errorType: error.name,
        originalMessage: error.message,
        circuitBreakerState: circuitBreaker.state
      };

      console.error('Registration error:', {
        ...errorContext,
        stack: error.stack
      });
      
      if (error instanceof ValidationError) {
        throw new ValidationError(
          `Invalid registration data: ${error.message}`,
          errorContext
        );
      } else if (error instanceof NetworkError) {
        throw new NetworkError(
          `Registration failed due to network issue: ${error.message}`,
          errorContext
        );
      } else if (error instanceof ServerError) {
        throw new ServerError(
          `Registration failed due to server error: ${error.message}`,
          errorContext
        );
      }
      
      throw new AuthenticationError(
        `Registration failed: ${error.message}`,
        errorContext
      );
    }
  }

  static async login(email, password) {
    const requestContext = {
      endpoint: API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      method: 'POST',
      timestamp: new Date().toISOString()
    };

    try {
      const data = await makeRequest(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`,
        {
          method: 'POST',
          headers: API_CONFIG.HEADERS,
          body: JSON.stringify({ email, password })
        }
      );
      
      // Store the token and timestamp in localStorage
      if (data.token) {
        localStorage.setItem('journal_auth_token', data.token);
        localStorage.setItem('auth_timestamp', Date.now().toString());
        return data;
      } else {
        throw new AuthenticationError(
          'No authentication token received',
          requestContext
        );
      }
    } catch (error) {
      const errorContext = {
        ...requestContext,
        errorType: error.name,
        originalMessage: error.message,
        circuitBreakerState: circuitBreaker.state
      };

      console.error('Login error:', {
        ...errorContext,
        stack: error.stack
      });
      
      if (error instanceof ValidationError) {
        throw new ValidationError(
          `Invalid login credentials: ${error.message}`,
          errorContext
        );
      } else if (error instanceof NetworkError) {
        throw new NetworkError(
          `Login failed due to network issue: ${error.message}`,
          errorContext
        );
      } else if (error instanceof ServerError) {
        throw new ServerError(
          `Login failed due to server error: ${error.message}`,
          errorContext
        );
      }
      
      throw new AuthenticationError(
        `Login failed: ${error.message}`,
        errorContext
      );
    }
  }

  static async logout() {
    const requestContext = {
      endpoint: API_CONFIG.ENDPOINTS.AUTH.LOGOUT,
      method: 'POST',
      timestamp: new Date().toISOString()
    };

    try {
      // Check if token exists and is valid
      const token = this.getToken();
      if (!token) {
        throw new AuthenticationError(
          'No active session found',
          requestContext
        );
      }

      try {
        await makeRequest(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGOUT}`,
          {
            method: 'POST',
            headers: {
              ...API_CONFIG.HEADERS,
              'Authorization': `Bearer ${token}`
            }
          }
        );

        // Remove auth data after successful server logout
        this.clearAuthData();
      } catch (error) {
        const errorContext = {
          ...requestContext,
          errorType: error.name,
          originalMessage: error.message,
          circuitBreakerState: circuitBreaker.state
        };

        // Handle cleanup for specific error types
        if (error instanceof NetworkError || 
            error instanceof ServerError || 
            error instanceof AuthenticationError) {
          // Remove auth data for network/server/auth errors as we can't verify server state
          this.clearAuthData();
        }

        console.error('Logout error:', {
          ...errorContext,
          stack: error.stack
        });

        // Re-throw with enhanced context
        if (error instanceof NetworkError) {
          throw new NetworkError(
            `Logout failed due to network issue: ${error.message}`,
            errorContext
          );
        } else if (error instanceof ServerError) {
          throw new ServerError(
            `Logout failed due to server error: ${error.message}`,
            errorContext
          );
        } else if (error instanceof AuthenticationError) {
          throw new AuthenticationError(
            `Logout failed due to authentication error: ${error.message}`,
            errorContext
          );
        }

        throw error; // Re-throw other errors with original context
      }
    } catch (error) {
      // Propagate error to caller with enhanced logging
      console.error('Logout error:', {
        error,
        context: requestContext,
        stack: error.stack
      });
      throw error;
    }
  }

  static clearAuthData() {
    localStorage.removeItem('journal_auth_token');
    localStorage.removeItem('auth_timestamp');
  }

  static getToken() {
    return localStorage.getItem('journal_auth_token');
  }

  static isAuthenticated() {
    return !!this.getToken();
  }
}

export default AuthService;

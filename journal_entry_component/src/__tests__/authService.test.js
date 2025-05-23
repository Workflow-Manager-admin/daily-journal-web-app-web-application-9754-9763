import AuthService from '../services/authService';

// Mock fetch globally
global.fetch = jest.fn();

describe('AuthService Tests', () => {
  beforeEach(() => {
    // Clear mock calls before each test
    fetch.mockClear();
  });

  describe('register', () => {
    test('successful registration', async () => {
      const mockResponse = { success: true, token: 'test-token' };
      fetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        })
      );

      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      const response = await AuthService.register(userData);
      expect(response).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(userData),
        })
      );
    });

    test('handles registration failure', async () => {
      const errorMessage = 'Registration failed';
      fetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ error: errorMessage }),
        })
      );

      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      await expect(AuthService.register(userData)).rejects.toThrow(errorMessage);
    });

    test('handles network error', async () => {
      fetch.mockImplementationOnce(() => Promise.reject(new Error('Network error')));

      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      await expect(AuthService.register(userData)).rejects.toThrow('Network error');
    });
  });

  test('validates WebSocket connection during registration', async () => {
    // Mock WebSocket
    const mockWebSocket = {
      send: jest.fn(),
      close: jest.fn(),
    };
    global.WebSocket = jest.fn(() => mockWebSocket);

    const mockResponse = { success: true, token: 'test-token' };
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })
    );

    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    };

    // Trigger registration
    await AuthService.register(userData);

    // Verify WebSocket connection was attempted
    expect(WebSocket).toHaveBeenCalled();
  });

  test('verifies CORS headers in registration request', async () => {
    const mockResponse = { success: true, token: 'test-token' };
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })
    );

    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    };

    await AuthService.register(userData);

    // Verify CORS headers were included in the request
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
        mode: 'cors',
      })
    );
  });
});
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Register from '../components/Register';
import AuthService from '../services/authService';

// Mock the AuthService
jest.mock('../services/authService');

describe('Register Component Tests', () => {
  beforeEach(() => {
    // Clear mock calls before each test
    jest.clearAllMocks();
  });

  test('renders registration form', () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
    
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  test('successful registration with valid credentials', async () => {
    // Mock successful registration
    AuthService.register.mockResolvedValueOnce({ success: true });

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'password123' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    // Wait for the registration to complete
    await waitFor(() => {
      expect(AuthService.register).toHaveBeenCalledWith(
        'Test User',
        'test@example.com',
        'password123'
      );
    });
  });

  test('handles registration failure', async () => {
    // Mock registration failure
    const errorMessage = 'Registration failed';
    AuthService.register.mockRejectedValueOnce(new Error(errorMessage));

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'password123' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  test('validates required fields', async () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    // Submit form without filling in any fields
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    // Check for validation messages
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
    });
  });

  test('validates email format', async () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    // Enter invalid email
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'invalidemail' },
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    // Check for validation message
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });
  });
});
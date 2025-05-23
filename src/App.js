import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import JournalEntryForm from './components/JournalEntryForm/JournalEntryForm';
import Login from './components/Login/Login';
import NavBar from './components/NavBar/NavBar';

/**
 * Main application component that handles routing and authentication state.
 * 
 * @returns {JSX.Element} The App component
 */
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Set to true initially for development
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsAuthenticated(false);
    // Clear any auth tokens or user data here
    localStorage.removeItem('authToken'); // Assuming you use authToken
  };

  // Protected Route wrapper component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <div className="App">
      {isAuthenticated && <NavBar onLogout={handleLogout} />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <JournalEntryForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/new"
          element={
            <ProtectedRoute>
              <JournalEntryForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute>
              <JournalEntryForm />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;

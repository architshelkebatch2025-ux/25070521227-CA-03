import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Books from './pages/Books';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './App.css';

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLoginSuccess = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar user={user} onLogout={handleLogout} />

        <main className="main-content">
          <Routes>
            {/* Protected Routes: Accessible only when authenticated */}
            <Route
              path="/"
              element={
                token ? (
                  <Home user={user} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/books"
              element={
                token ? (
                  <Books token={token} user={user} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Public Auth Routes: Redirect to home if already logged in */}
            <Route
              path="/login"
              element={
                !token ? (
                  <Login onLoginSuccess={handleLoginSuccess} />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/signup"
              element={
                !token ? (
                  <Signup />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />

            {/* Catch-all redirect to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>
            Smart Library Management System &bull; <span>BTech Computer Science Project</span> &bull; Built with MERN Stack
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;

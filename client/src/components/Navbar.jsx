import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <span className="logo-icon">📚</span>
          <span>Smart Library</span>
        </Link>

        <div className="nav-links">
          {user ? (
            <>
              <Link
                to="/"
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              >
                Dashboard
              </Link>
              <Link
                to="/books"
                className={`nav-link ${location.pathname === '/books' ? 'active' : ''}`}
              >
                Books Library
              </Link>
              <div className="user-badge">
                <span>👤</span>
                <span>{user.name}</span>
              </div>
              <button onClick={handleLogoutClick} className="btn-logout" title="Log out of system">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
              >
                Login
              </Link>
              <Link to="/signup" className="nav-link nav-auth-btn">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

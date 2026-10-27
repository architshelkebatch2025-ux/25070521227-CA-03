import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5000/api';

const Home = ({ user }) => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    issuedBooks: 0,
  });
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // 1. Fetch counts
      const countRes = await fetch(`${API_BASE_URL}/books/count`);
      if (!countRes.ok) throw new Error('Could not load library statistics.');
      const countData = await countRes.json();
      setStats(countData);

      // 2. Fetch featured selection for dashboard
      const booksRes = await fetch(`${API_BASE_URL}/books/featured`);
      if (!booksRes.ok) throw new Error('Could not load featured books.');
      const booksData = await booksRes.json();
      setFeaturedBooks(booksData);
    } catch (err) {
      console.error(err);
      setError('Unable to fetch live library data. Please ensure the backend server and MongoDB are running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Welcome Banner */}
      <section className="hero-banner">
        <h1>Welcome back, {user?.name || 'Student'}! 👋</h1>
        <p>
          Welcome to the <strong>Smart Library Management System</strong>. Browse our digital catalog, check real-time
          book availability, and instantly issue books for your BTech coursework and research.
        </p>
      </section>

      {error && (
        <div className="alert alert-danger" role="alert">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Real-time Statistics Cards */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total">📚</div>
          <div className="stat-info">
            <h3>{loading ? '...' : stats.totalBooks}</h3>
            <p>Total Books in Library</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon available">✅</div>
          <div className="stat-info">
            <h3>{loading ? '...' : stats.availableBooks}</h3>
            <p>Books Available to Issue</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon issued">⏳</div>
          <div className="stat-info">
            <h3>{loading ? '...' : stats.issuedBooks}</h3>
            <p>Currently Issued Books</p>
          </div>
        </div>
      </section>

      {/* Featured Collection Section */}
      <section>
        <div className="section-title">
          <h2>Featured Available Books</h2>
          <Link to="/books" className="btn-secondary">
            Explore All Books ➔
          </Link>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading library catalog...</p>
        ) : featuredBooks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📖</div>
            <p>No available books to display right now.</p>
            <p style={{ fontSize: '0.88rem', marginTop: '6px' }}>
              Add books using MongoDB Compass or run <code>node seed.js</code> in the server folder!
            </p>
          </div>
        ) : (
          <div className="books-grid">
            {featuredBooks.map((book) => (
              <div key={book._id} className="book-card">
                <div>
                  <div className="book-header">
                    <span className="category-tag">{book.category}</span>
                    <span className="status-badge available">● Available</span>
                  </div>
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">By {book.author}</p>
                </div>
                <div className="book-card-footer">
                  <Link
                    to="/books"
                    className="btn-issue"
                    style={{ textDecoration: 'none', textAlign: 'center' }}
                  >
                    View in Catalog ➔
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;

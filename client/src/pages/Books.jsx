import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5000/api';

const Books = ({ token, user }) => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [alert, setAlert] = useState({ type: '', message: '' });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async (query = '') => {
    try {
      setLoading(true);
      const url = query
        ? `${API_BASE_URL}/books?search=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/books`;

      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to retrieve books.');
      const data = await res.json();
      setBooks(data);
    } catch (err) {
      console.error(err);
      setAlert({
        type: 'danger',
        message: 'Could not load books. Please verify that the backend server is active.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchBooks(value);
  };

  const handleIssueBook = async (bookId, bookTitle) => {
    if (!token) {
      setAlert({ type: 'danger', message: 'You must be logged in to issue a book.' });
      return;
    }

    try {
      setActionLoadingId(bookId);
      setAlert({ type: '', message: '' });

      const res = await fetch(`${API_BASE_URL}/books/${bookId}/issue`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to issue book.');
      }

      setAlert({
        type: 'success',
        message: `Success! "${bookTitle}" has been issued to you. Availability updated in MongoDB!`,
      });

      // Update local state directly so UI reflects immediately
      setBooks((prevBooks) =>
        prevBooks.map((b) =>
          b._id === bookId
            ? { ...b, isAvailable: false, available: false, issuedTo: user?.id, issuedBy: user?.id }
            : b
        )
      );
    } catch (err) {
      setAlert({ type: 'danger', message: err.message });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReturnBook = async (bookId, bookTitle) => {
    if (!token) return;

    try {
      setActionLoadingId(bookId);
      setAlert({ type: '', message: '' });

      const res = await fetch(`${API_BASE_URL}/books/${bookId}/return`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to return book.');
      }

      setAlert({
        type: 'success',
        message: `"${bookTitle}" returned to the library successfully! Available for new readers.`,
      });

      // Update local state directly
      setBooks((prevBooks) =>
        prevBooks.map((b) =>
          b._id === bookId
            ? { ...b, isAvailable: true, available: true, issuedTo: null, issuedBy: null, issuedDate: null }
            : b
        )
      );
    } catch (err) {
      setAlert({ type: 'danger', message: err.message });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Derive unique categories for filter pills
  const categories = ['All', ...new Set(books.map((b) => b.category))];

  // Filter books locally by category
  const filteredBooks =
    selectedCategory === 'All'
      ? books
      : books.filter((b) => b.category === selectedCategory);

  return (
    <div>
      <div className="section-title">
        <div>
          <h2>Library Books Collection</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Search titles, filter by category, and issue books directly to your account.
          </p>
        </div>
      </div>

      {/* Global Alert Notification */}
      {alert.message && (
        <div
          className={`alert alert-${alert.type}`}
          role="alert"
          style={{ cursor: 'pointer' }}
          onClick={() => setAlert({ type: '', message: '' })}
          title="Click to dismiss"
        >
          <span>{alert.type === 'success' ? '✅' : '⚠️'}</span>
          <span>{alert.message}</span>
        </div>
      )}

      {/* Search Bar & Filter Section */}
      <section className="search-filter-section">
        <div className="search-bar-wrapper">
          <span className="search-icon-inside">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search by book title, author, or subject..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        {/* Category Pills */}
        <div className="category-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Books Grid */}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          Loading books from database...
        </p>
      ) : filteredBooks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No matching books found</h3>
          <p>Try searching for a different title or author, or reset the category filter.</p>
        </div>
      ) : (
        <div className="books-grid">
          {filteredBooks.map((book) => {
            const isProcessing = actionLoadingId === book._id;
            const isAvailable = book.available !== false && book.isAvailable !== false;
            const isIssuedToMe = book.issuedTo === user?.id || book.issuedBy === user?.id;

            return (
              <div key={book._id} className="book-card">
                <div>
                  <div className="book-header">
                    <span className="category-tag">{book.category}</span>
                    <span
                      className={`status-badge ${
                        isAvailable ? 'available' : 'issued'
                      }`}
                    >
                      {isAvailable ? '● Available' : '● Issued'}
                    </span>
                  </div>

                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">By {book.author}</p>
                </div>

                <div className="book-card-footer">
                  {isAvailable ? (
                    <button
                      className="btn-issue"
                      disabled={isProcessing}
                      onClick={() => handleIssueBook(book._id, book.title)}
                    >
                      {isProcessing ? 'Issuing Book...' : '📖 Issue Book'}
                    </button>
                  ) : (
                    <>
                      <button className="btn-issue" disabled>
                        ❌ Not Available (Issued)
                      </button>
                      {/* Viva convenience: If issued, show a return button to test both flow directions */}
                      <button
                        className="btn-return"
                        disabled={isProcessing}
                        onClick={() => handleReturnBook(book._id, book.title)}
                        title="Click to return this book back to library"
                      >
                        {isProcessing ? 'Returning...' : '↩️ Return Book (Viva Demo)'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Books;

const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const authMiddleware = require('../middleware/authMiddleware');

// @route   GET /api/books/count
// @desc    Return the total number of books in MongoDB
// NOTE: Defined BEFORE /:id to prevent Express from treating 'count' as a param ID
router.get('/count', async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const availableBooks = await Book.countDocuments({
      $or: [{ available: true }, { isAvailable: true }],
    });
    const issuedBooks = totalBooks - availableBooks;

    res.status(200).json({
      count: totalBooks,
      totalBooks,
      availableBooks,
      issuedBooks,
    });
  } catch (error) {
    console.error('Error fetching book count:', error);
    res.status(500).json({ message: 'Server error fetching book counts.' });
  }
});

// @route   GET /api/books/featured
// @desc    Return a small selection of books for the Dashboard
router.get('/featured', async (req, res) => {
  try {
    const featured = await Book.find({
      $or: [{ available: true }, { isAvailable: true }],
    })
      .limit(4)
      .sort({ createdAt: -1 });

    res.status(200).json(featured);
  } catch (error) {
    console.error('Error fetching featured books:', error);
    res.status(500).json({ message: 'Server error retrieving featured books.' });
  }
});

// @route   GET /api/books
// @desc    Retrieve all books from MongoDB, with optional search query (?search=...)
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query = {
        $or: [{ title: regex }, { author: regex }, { category: regex }],
      };
    }

    const books = await Book.find(query).sort({ createdAt: -1 });
    res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Server error retrieving books.' });
  }
});

// @route   PUT /api/books/:id/issue
// @desc    Issue an available book to the logged-in user (Requires valid JWT)
router.put('/:id/issue', authMiddleware, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found in the library catalog.' });
    }

    // Check availability
    const isCurrentlyAvailable = book.available !== false && book.isAvailable !== false;
    if (!isCurrentlyAvailable) {
      return res.status(400).json({
        message: 'Sorry, this book is already issued and not currently available.',
      });
    }

    // Update availability and record user ID
    book.available = false;
    book.isAvailable = false;
    book.issuedBy = req.user.id;
    book.issuedTo = req.user.id;
    book.issuedDate = new Date();

    const updatedBook = await book.save();

    res.status(200).json({
      success: true,
      message: `"${book.title}" has been issued to you successfully!`,
      book: updatedBook,
    });
  } catch (error) {
    console.error('Error issuing book:', error);
    res.status(500).json({ message: 'Server error while issuing the book.' });
  }
});

// @route   PUT /api/books/:id/return
// @desc    Return an issued book (Requires valid JWT) - Helpful for viva/practical demo
router.put('/:id/return', authMiddleware, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    const isCurrentlyAvailable = book.available !== false && book.isAvailable !== false;
    if (isCurrentlyAvailable) {
      return res.status(400).json({ message: 'This book is not currently issued.' });
    }

    book.available = true;
    book.isAvailable = true;
    book.issuedBy = null;
    book.issuedTo = null;
    book.issuedDate = null;

    const updatedBook = await book.save();

    res.status(200).json({
      success: true,
      message: `"${book.title}" returned to the library successfully!`,
      book: updatedBook,
    });
  } catch (error) {
    console.error('Error returning book:', error);
    res.status(500).json({ message: 'Server error while returning the book.' });
  }
});

module.exports = router;

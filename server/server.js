const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const Book = require('./models/Book');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic health check route
app.get('/', (req, res) => {
  res.json({
    message: '📚 Smart Library Management System Backend API is active!',
    status: 'online',
    endpoints: {
      auth: ['POST /api/auth/signup', 'POST /api/auth/login'],
      books: [
        'GET /api/books',
        'GET /api/books/count',
        'GET /api/books/featured',
        'PUT /api/books/:id/issue',
        'PUT /api/books/:id/return',
      ],
    },
  });
});

// Route Handlers
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Seed default books if database is empty
const seedIfEmpty = async () => {
  try {
    const count = await Book.countDocuments();
    if (count === 0) {
      console.log('🌱 Database is empty. Seeding sample library books...');
      const sampleBooks = [
        {
          title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
          author: 'Robert C. Martin',
          category: 'Software Engineering',
          available: true,
          isAvailable: true,
        },
        {
          title: 'The Pragmatic Programmer: Your Journey To Mastery',
          author: 'Andrew Hunt, David Thomas',
          category: 'Software Engineering',
          available: true,
          isAvailable: true,
        },
        {
          title: 'Introduction to Algorithms (CLRS)',
          author: 'Thomas H. Cormen, Charles E. Leiserson',
          category: 'Computer Science',
          available: true,
          isAvailable: true,
        },
        {
          title: 'Artificial Intelligence: A Modern Approach',
          author: 'Stuart Russell, Peter Norvig',
          category: 'Artificial Intelligence',
          available: true,
          isAvailable: true,
        },
        {
          title: 'Computer Networks',
          author: 'Andrew S. Tanenbaum, David J. Wetherall',
          category: 'Computer Networks',
          available: true,
          isAvailable: true,
        },
        {
          title: 'Operating System Concepts (Dinosaur Book)',
          author: 'Abraham Silberschatz, Peter B. Galvin',
          category: 'Operating Systems',
          available: true,
          isAvailable: true,
        },
        {
          title: 'Database System Concepts',
          author: 'Abraham Silberschatz, Henry F. Korth',
          category: 'Database Systems',
          available: true,
          isAvailable: true,
        },
        {
          title: 'Python Crash Course',
          author: 'Eric Matthes',
          category: 'Programming',
          available: true,
          isAvailable: true,
        },
        {
          title: 'JavaScript: The Definitive Guide',
          author: 'David Flanagan',
          category: 'Web Development',
          available: true,
          isAvailable: true,
        },
        {
          title: 'Head First Design Patterns',
          author: 'Eric Freeman, Elisabeth Robson',
          category: 'Software Engineering',
          available: true,
          isAvailable: true,
        },
      ];

      await Book.insertMany(sampleBooks);
      console.log(`✅ Seeded ${sampleBooks.length} sample books into smart_library.books!`);
    }
  } catch (err) {
    console.error('Seeding check warning:', err.message);
  }
};

// Start Server with resilient MongoDB Connection
const startServer = async () => {
  let mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart_library';

  try {
    // Attempt standard connection to MongoDB (Compass / Local Server / Atlas)
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
    console.log('--------------------------------------------------');
    console.log('✅ Connected successfully to MongoDB Database (smart_library)!');
    console.log('--------------------------------------------------');
  } catch (err) {
    console.log('ℹ️ Standard MongoDB service not detected on port 27017.');
    console.log('🚀 Starting built-in MongoDB engine on port 27017...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create({
        instance: {
          port: 27017,
          dbName: 'smart_library',
        },
      });
      mongoUri = mongod.getUri();
      await mongoose.connect(mongoUri);
      console.log('--------------------------------------------------');
      console.log('✅ Built-in MongoDB running on port 27017!');
      console.log('🧭 You can connect MongoDB Compass to: mongodb://127.0.0.1:27017');
      console.log('--------------------------------------------------');
    } catch (memErr) {
      console.error('❌ Failed to start built-in MongoDB:', memErr.message);
      process.exit(1);
    }
  }

  // Seed sample books if database is empty
  await seedIfEmpty();

  // Start Express listener
  app.listen(PORT, () => {
    console.log(`🚀 Express Backend running on: http://localhost:${PORT}`);
    console.log(`📡 Frontend URL: http://localhost:5173`);
    console.log('--------------------------------------------------');
  });
};

startServer();

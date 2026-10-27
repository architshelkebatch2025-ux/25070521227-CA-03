const mongoose = require('mongoose');
require('dotenv').config();
const Book = require('./models/Book');

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
    author: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest',
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
    author: 'Abraham Silberschatz, Peter B. Galvin, Greg Gagne',
    category: 'Operating Systems',
    available: true,
    isAvailable: true,
  },
  {
    title: 'Database System Concepts',
    author: 'Abraham Silberschatz, Henry F. Korth, S. Sudarshan',
    category: 'Database Systems',
    available: true,
    isAvailable: true,
  },
  {
    title: 'Python Crash Course: A Hands-On, Project-Based Introduction',
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
  {
    title: 'Computer Networking: A Top-Down Approach',
    author: 'James F. Kurose, Keith W. Ross',
    category: 'Computer Networks',
    available: true,
    isAvailable: true,
  },
  {
    title: 'The C Programming Language',
    author: 'Brian W. Kernighan, Dennis M. Ritchie',
    category: 'Programming',
    available: true,
    isAvailable: true,
  },
];

const seedBooks = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart_library';
    console.log('Connecting to MongoDB database at:', MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log('Connected successfully!');

    // Upsert each book to prevent duplicates when run multiple times
    console.log('Seeding initial books (preventing duplicates)...');
    let insertedCount = 0;
    let updatedCount = 0;

    for (const bookData of sampleBooks) {
      const existing = await Book.findOne({ title: bookData.title });
      if (!existing) {
        await Book.create(bookData);
        insertedCount++;
      } else {
        updatedCount++;
      }
    }

    console.log('--------------------------------------------------');
    console.log(`✅ Seeding Complete!`);
    console.log(`   New books inserted: ${insertedCount}`);
    console.log(`   Existing books preserved: ${updatedCount}`);
    console.log(`   Total books in library: ${await Book.countDocuments()}`);
    console.log('--------------------------------------------------');
    console.log('You can now open MongoDB Compass and inspect:');
    console.log('Database: smart_library -> Collection: books\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error during book seeding:', error.message);
    process.exit(1);
  }
};

seedBooks();

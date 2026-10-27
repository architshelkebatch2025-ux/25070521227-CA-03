const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Book title is required'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    // Both 'available' (from assignment rubric) and 'isAvailable' (frontend convention)
    available: {
      type: Boolean,
      default: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    // Both 'issuedBy' (from assignment rubric) and 'issuedTo' (frontend convention)
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    issuedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    issuedDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to synchronize available <-> isAvailable and issuedBy <-> issuedTo
bookSchema.pre('save', function (next) {
  if (this.isModified('available')) {
    this.isAvailable = this.available;
  } else if (this.isModified('isAvailable')) {
    this.available = this.isAvailable;
  }

  if (this.isModified('issuedBy')) {
    this.issuedTo = this.issuedBy;
  } else if (this.isModified('issuedTo')) {
    this.issuedBy = this.issuedTo;
  }

  next();
});

module.exports = mongoose.model('Book', bookSchema);

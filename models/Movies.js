const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      unique: true,
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 chars']
    },
    description: {
      type: String,
      required: [true, 'Please add a Description'],
      maxlength: [500, 'Description cannot be more than 500 chars']
    },
    website: {
      type: String,
      match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please use a valid URL with HTTP or HTTPS',
      ],
    },
    cast: {
      // Array of strings
      type: [String],
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    }

  }
);

module.exports = mongoose.model('Movie', MovieSchema);
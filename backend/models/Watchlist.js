const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      default: 'demo-user',
    },
    symbols: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Watchlist', watchlistSchema);
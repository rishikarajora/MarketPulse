const mongoose = require('mongoose');

const snapshotStockSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
    },

    previousClose: {
      type: Number,
      default: null,
    },

    change: {
      type: Number,
      default: 0,
    },

    changePercent: {
      type: Number,
      default: 0,
    },

    volume: {
      type: Number,
      default: 0,
    },

    significance: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const snapshotSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      default: 'demo-user',
      index: true,
    },

    stocks: {
      type: [snapshotStockSchema],
      default: [],
    },

    capturedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Snapshot', snapshotSchema);
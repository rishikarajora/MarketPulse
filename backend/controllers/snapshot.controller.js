const Snapshot = require('../models/Snapshot');
const Watchlist = require('../models/Watchlist');

const {
  compareSnapshots,
  getLatestSnapshot: getLatestSnapshotFromService,
} = require('../services/snapshot.service');

const {
  getQuotes,
} = require('../services/marketData.service');

const {
  analyzePortfolio,
} = require('../services/intelligence.service');

async function createSnapshot(req, res) {
  try {
    const watchlist = await Watchlist.findOne({
      userId: 'demo-user',
    });

    if (!watchlist || watchlist.symbols.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Watchlist is empty',
      });
    }

    const quotes = await getQuotes(watchlist.symbols);
    const analyzedStocks = analyzePortfolio(quotes);

    const stocks = analyzedStocks.map((stock) => ({
      symbol: stock.symbol,
      price: stock.price,
      previousClose: stock.previousClose ?? null,
      change: stock.change ?? 0,
      changePercent: stock.changePercent ?? 0,
      volume: stock.volume ?? 0,
      significance: stock.significance ?? 0,
    }));

    const snapshot = await Snapshot.create({
      userId: 'demo-user',
      stocks,
      capturedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: 'Snapshot saved successfully',
      data: snapshot,
    });
  } catch (error) {
    console.error('Create snapshot error:', error.message);

    res.status(500).json({
      success: false,
      message: 'Failed to create snapshot',
    });
  }
}

async function getLatestSnapshot(req, res) {
  try {
    const snapshot = await Snapshot.findOne({
      userId: 'demo-user',
    }).sort({
      capturedAt: -1,
    });

    if (!snapshot) {
      return res.json({
        success: true,
        data: null,
      });
    }

    res.json({
      success: true,
      data: snapshot,
    });
  } catch (error) {
    console.error('Get snapshot error:', error.message);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch latest snapshot',
    });
  }
}

async function getSnapshotChanges(req, res) {
  try {
    const previousSnapshot = await getLatestSnapshotFromService();

    if (!previousSnapshot) {
      return res.json({
        success: true,
        data: [],
        message: 'No previous snapshot available',
      });
    }

    const watchlist = await Watchlist.findOne({
      userId: 'demo-user',
    });

    if (!watchlist || watchlist.symbols.length === 0) {
      return res.json({
        success: true,
        data: [],
      });
    }

    const quotes = await getQuotes(watchlist.symbols);
    const analyzedStocks = analyzePortfolio(quotes);

    const changes = compareSnapshots(
      previousSnapshot,
      analyzedStocks
    );

    res.json({
      success: true,
      data: changes,
      previousSnapshotAt: previousSnapshot.capturedAt,
      comparedAt: new Date(),
    });
  } catch (error) {
    console.error('Snapshot comparison error:', error.message);

    res.status(500).json({
      success: false,
      message: 'Failed to compare snapshots',
    });
  }
}

module.exports = {
  createSnapshot,
  getLatestSnapshot,
  getSnapshotChanges,
};
const Watchlist = require('../models/Watchlist');

async function getWatchlist(req, res) {
  try {
    let watchlist = await Watchlist.findOne({ userId: 'demo-user' });

    if (!watchlist) {
      watchlist = await Watchlist.create({
        userId: 'demo-user',
        symbols: [],
      });
    }

    res.json({
      success: true,
      symbols: watchlist.symbols,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch watchlist',
    });
  }
}

async function addToWatchlist(req, res) {
  try {
    const { symbol } = req.body;

    if (!symbol) {
      return res.status(400).json({
        success: false,
        message: 'Symbol is required',
      });
    }

    const normalizedSymbol = symbol.trim().toUpperCase();

    let watchlist = await Watchlist.findOne({
      userId: 'demo-user',
    });

    if (!watchlist) {
      watchlist = await Watchlist.create({
        userId: 'demo-user',
        symbols: [normalizedSymbol],
      });
    } else if (!watchlist.symbols.includes(normalizedSymbol)) {
      watchlist.symbols.push(normalizedSymbol);
      await watchlist.save();
    }

    res.json({
      success: true,
      symbols: watchlist.symbols,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add stock to watchlist',
    });
  }
}

async function removeFromWatchlist(req, res) {
  try {
    const { symbol } = req.params;

    if (!symbol) {
      return res.status(400).json({
        success: false,
        message: 'Symbol is required',
      });
    }

    const normalizedSymbol = symbol.trim().toUpperCase();

    const watchlist = await Watchlist.findOne({
      userId: 'demo-user',
    });

    if (!watchlist) {
      return res.status(404).json({
        success: false,
        message: 'Watchlist not found',
      });
    }

    watchlist.symbols = watchlist.symbols.filter(
      (item) => item !== normalizedSymbol
    );

    await watchlist.save();

    res.json({
      success: true,
      symbols: watchlist.symbols,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to remove stock from watchlist',
    });
  }
}

module.exports = {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
};
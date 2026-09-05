
const {
  getQuote,
  getQuotes,
} = require('../services/marketData.service');

const {
  analyzeStock,
  analyzePortfolio,
} = require('../services/intelligence.service');

const Watchlist = require('../models/Watchlist');

async function getMarketQuote(req, res) {
  try {
    const { symbol } = req.params;

    if (!symbol) {
      return res.status(400).json({
        success: false,
        message: 'Symbol is required',
      });
    }

    const quote = await getQuote(symbol);

    const analysis = analyzeStock(quote);

    res.json({
      success: true,
      data: {
        ...quote,
        intelligence: analysis,
      },
    });
  } catch (error) {
    console.error('Market quote error:', error.message);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch market quote',
    });
  }
}

async function getWatchlistMarketData(req, res) {
  try {
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

    res.json({
      success: true,
      data: analyzedStocks,
    });
  } catch (error) {
    console.error('Watchlist market data error:', error.message);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch watchlist market data',
    });
  }
}

module.exports = {
  getMarketQuote,
  getWatchlistMarketData,
};
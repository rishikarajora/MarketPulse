const express = require('express');

const {
  getMarketQuote,
  getWatchlistMarketData,
} = require('../controllers/market.controller');

const router = express.Router();

router.get('/quote/:symbol', getMarketQuote);
router.get('/watchlist', getWatchlistMarketData);

module.exports = router;
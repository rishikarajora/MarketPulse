const Snapshot = require('../models/Snapshot');

function calculatePercentChange(previousValue, currentValue) {
  if (!previousValue) {
    return 0;
  }

  return ((currentValue - previousValue) / previousValue) * 100;
}

function compareSnapshots(previousSnapshot, currentStocks) {
  if (!previousSnapshot) {
    return [];
  }

  const previousStocks = previousSnapshot.stocks || [];

  return currentStocks
    .map((currentStock) => {
      const previousStock = previousStocks.find(
        (stock) => stock.symbol === currentStock.symbol
      );

      if (!previousStock) {
        return null;
      }

      const priceChange = calculatePercentChange(
        previousStock.price,
        currentStock.price
      );

      const volumeChange = calculatePercentChange(
        previousStock.volume,
        currentStock.volume
      );

      const significanceChange =
        Number(currentStock.significance || 0) -
        Number(previousStock.significance || 0);

      const absolutePriceChange = Math.abs(priceChange);
      const absoluteVolumeChange = Math.abs(volumeChange);
      const absoluteSignificanceChange = Math.abs(
        significanceChange
      );

      const isMeaningful =
        absolutePriceChange >= 1 ||
        absoluteVolumeChange >= 50 ||
        absoluteSignificanceChange >= 10;

      if (!isMeaningful) {
        return null;
      }

      return {
        symbol: currentStock.symbol,
        name: currentStock.name,

        previousPrice: previousStock.price,
        currentPrice: currentStock.price,

        priceChangePercent: Number(
          priceChange.toFixed(2)
        ),

        previousVolume: previousStock.volume,
        currentVolume: currentStock.volume,

        volumeChangePercent: Number(
          volumeChange.toFixed(2)
        ),

        previousSignificance: previousStock.significance,
        currentSignificance: currentStock.significance,

        significanceChange,
      };
    })
    .filter(Boolean);
}

async function getLatestSnapshot() {
  return Snapshot.findOne({
    userId: 'demo-user',
  }).sort({
    capturedAt: -1,
  });
}

module.exports = {
  compareSnapshots,
  getLatestSnapshot,
};
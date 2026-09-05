function clamp(value, min = 0, max = 100) {
  return Math.min(Math.max(value, min), max);
}

function calculatePriceMovementScore(changePercent) {
  const movement = Math.abs(Number(changePercent) || 0);

  // 1% movement = noticeable
  // 3%+ movement = highly significant
  return clamp((movement / 3) * 100);
}

function calculateVolumeAnomalyScore(volumeRatio) {
  const ratio = Number(volumeRatio) || 0;

  if (ratio <= 1) return 0;

  // 2x average volume -> ~50
  // 3x average volume -> ~100
  return clamp((ratio - 1) * 50);
}

function calculateSectorDivergenceScore(
  stockChangePercent,
  sectorChangePercent
) {
  const stockChange = Number(stockChangePercent) || 0;
  const sectorChange = Number(sectorChangePercent) || 0;

  const divergence = Math.abs(stockChange - sectorChange);

  return clamp((divergence / 3) * 100);
}

function calculateVolatilityScore(changePercent) {
  const movement = Math.abs(Number(changePercent) || 0);

  return clamp((movement / 4) * 100);
}

function calculateSignificance({
  priceMovement,
  volumeAnomaly,
  sectorDivergence,
  volatility,
}) {
  const score =
    priceMovement * 0.4 +
    volumeAnomaly * 0.3 +
    sectorDivergence * 0.2 +
    volatility * 0.1;

  return Math.round(clamp(score));
}

function getSignificanceLabel(score) {
  if (score >= 70) return 'High';
  if (score >= 40) return 'Medium';
  return 'Low';
}

function buildReason({
  changePercent,
  volumeRatio,
  relativePerformance,
  event,
}) {
  const reasons = [];

  const movement = Number(changePercent) || 0;
  const volume = Number(volumeRatio) || 0;
  const relative = Number(relativePerformance) || 0;

  if (Math.abs(movement) >= 2) {
    reasons.push(
      `Price moved ${movement >= 0 ? '+' : ''}${movement.toFixed(1)}%`
    );
  }

  if (volume >= 2) {
    reasons.push(
      `volume is ${volume.toFixed(1)}x the average`
    );
  }

  if (Math.abs(relative) >= 1) {
    reasons.push(
      `${relative >= 0 ? 'outperforming' : 'underperforming'} its sector`
    );
  }

  if (event) {
    reasons.push('a recent company event was detected');
  }

  if (reasons.length === 0) {
    return 'No major signal detected.';
  }

  return reasons.join(' + ') + '.';
}

function analyzeStock(stock, context = {}) {
  const changePercent = Number(
    stock.changePercent ?? stock.dayChange ?? 0
  );

  const volumeRatio = Number(
    stock.volumeRatio ?? context.volumeRatio ?? 1
  );

  const sectorChangePercent = Number(
    stock.sectorChangePct ?? context.sectorChangePct ?? 0
  );

  const relativePerformance = Number(
    stock.relativePerformance ?? 0
  );

  const event = stock.event ?? null;

  const priceMovement = calculatePriceMovementScore(
    changePercent
  );

  const volumeAnomaly = calculateVolumeAnomalyScore(
    volumeRatio
  );

  const sectorDivergence = calculateSectorDivergenceScore(
    changePercent,
    sectorChangePercent
  );

  const volatility = calculateVolatilityScore(
    changePercent
  );

  const significance = calculateSignificance({
    priceMovement,
    volumeAnomaly,
    sectorDivergence,
    volatility,
  });

  return {
    symbol: stock.symbol,
name: stock.name,
price: stock.price,
previousClose: stock.previousClose ?? null,
change: stock.change ?? 0,
changePercent,
volume: stock.volume ?? 0,

    signals: {
      priceMovement: Math.round(priceMovement),
      volumeAnomaly: Math.round(volumeAnomaly),
      sectorDivergence: Math.round(sectorDivergence),
      recentVolatility: Math.round(volatility),
    },

    significance,
    significanceLabel: getSignificanceLabel(significance),

    volumeRatio,
    sectorChangePct: sectorChangePercent,
    relativePerformance,

    reason: buildReason({
      changePercent,
      volumeRatio,
      relativePerformance,
      event,
    }),

    event,

    dataSource: stock.dataSource || 'unknown',
    isFallback: Boolean(stock.isFallback),
    isStale: Boolean(stock.isStale),

    analyzedAt: new Date().toISOString(),
  };
}

function analyzePortfolio(stocks = []) {
  const analyzedStocks = stocks.map((stock) =>
    analyzeStock(stock)
  );

  return analyzedStocks.sort(
    (a, b) => b.significance - a.significance
  );
}

module.exports = {
  analyzeStock,
  analyzePortfolio,
};
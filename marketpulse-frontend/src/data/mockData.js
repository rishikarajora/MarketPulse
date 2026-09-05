// Realistic mock data standing in for a future Node/Express API.
// Shape mirrors what a backend delivering structured market signals would return.

export const marketIndices = [
  { symbol: 'NIFTY50', name: 'NIFTY 50', value: 24812.35, change: 148.2, changePct: 0.60 },
  { symbol: 'SENSEX', name: 'SENSEX', value: 81643.57, change: 421.15, changePct: 0.52 },
  { symbol: 'BANKNIFTY', name: 'BANK NIFTY', value: 51204.80, change: -96.40, changePct: -0.19 },
];

export const sectors = [
  { name: 'Energy', changePct: 2.1 },
  { name: 'IT', changePct: -0.6 },
  { name: 'Banking', changePct: 0.3 },
  { name: 'Auto', changePct: 1.2 },
  { name: 'Pharma', changePct: -0.2 },
  { name: 'FMCG', changePct: 0.4 },
  { name: 'Metals', changePct: 1.8 },
  { name: 'Realty', changePct: -1.1 },
];

// Each stock carries both raw price data and derived "intelligence" signals.
// significance: 0-100 score assumed to be computed server-side.
export const stocks = [
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd.',
    sector: 'Energy',
    price: 4000.45,
    dayChange: 3.82,
    changeSinceLastVisit: 5.4,
    volume: '18.2M',
    volumeRatio: 2.4,
    significance: 82,
    significanceLabel: 'High',
    signals: {
      priceMovement: 88,
      volumeAnomaly: 76,
      sectorDivergence: 64,
      recentVolatility: 58,
    },
    sectorChangePct: 1.1,
    relativePerformance: 2.7,
    lastUpdated: '2 min ago',
    status: 'live',
    event: {
      headline: 'Company announcement published near market open',
      detail: 'An exchange filing was recorded shortly before the volume spike began. MarketPulse cannot confirm this caused the movement.',
    },
    timeline: [
      { time: '10:32 AM', label: 'Price crossed +3%', type: 'price' },
      { time: '10:18 AM', label: 'Volume anomaly detected', type: 'volume' },
      { time: '9:45 AM', label: 'Company announcement detected', type: 'event' },
      { time: '9:20 AM', label: 'Market opened', type: 'market' },
    ],
    chart: genSeries(2790, 2938.45, 90),
  },
  {
    symbol: 'TCS',
    name: 'Tata Consultancy Services Ltd.',
    sector: 'IT',
    price: 3500.10,
    dayChange: -2.14,
    changeSinceLastVisit: -3.1,
    volume: '9.6M',
    volumeRatio: 2.8,
    significance: 71,
    significanceLabel: 'High',
    signals: {
      priceMovement: 54,
      volumeAnomaly: 91,
      sectorDivergence: 48,
      recentVolatility: 62,
    },
    sectorChangePct: -0.6,
    relativePerformance: -1.5,
    lastUpdated: '4 min ago',
    status: 'live',
    event: null,
    timeline: [
      { time: '11:05 AM', label: 'Unusual volume detected', type: 'volume' },
      { time: '10:40 AM', label: 'Price crossed -2%', type: 'price' },
      { time: '9:20 AM', label: 'Market opened', type: 'market' },
    ],
    chart: genSeries(4190, 4102.10, 90),
  },
  {
    symbol: 'INFY',
    name: 'Infosys Ltd.',
    sector: 'IT',
    price: 1847.60,
    dayChange: 1.68,
    changeSinceLastVisit: 2.3,
    volume: '11.1M',
    volumeRatio: 1.3,
    significance: 54,
    significanceLabel: 'Medium',
    signals: {
      priceMovement: 42,
      volumeAnomaly: 24,
      sectorDivergence: 70,
      recentVolatility: 35,
    },
    sectorChangePct: -0.6,
    relativePerformance: 1.2,
    lastUpdated: '3 min ago',
    status: 'live',
    event: null,
    timeline: [
      { time: '10:55 AM', label: 'Outperforming IT sector', type: 'sector' },
      { time: '9:20 AM', label: 'Market opened', type: 'market' },
    ],
    chart: genSeries(1815, 1847.60, 90),
  },
  {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd.',
    sector: 'Banking',
    price: 1689.25,
    dayChange: 0.42,
    changeSinceLastVisit: 0.6,
    volume: '14.4M',
    volumeRatio: 1.0,
    significance: 22,
    significanceLabel: 'Low',
    signals: {
      priceMovement: 18,
      volumeAnomaly: 12,
      sectorDivergence: 15,
      recentVolatility: 20,
    },
    sectorChangePct: 0.3,
    relativePerformance: 0.1,
    lastUpdated: '5 min ago',
    status: 'live',
    event: null,
    timeline: [
      { time: '9:20 AM', label: 'Market opened', type: 'market' },
    ],
    chart: genSeries(1680, 1689.25, 90),
  },
  {
    symbol: 'ICICIBANK',
    name: 'ICICI Bank Ltd.',
    sector: 'Banking',
    price: 1298.70,
    dayChange: -0.35,
    changeSinceLastVisit: -0.2,
    volume: '10.8M',
    volumeRatio: 0.9,
    significance: 15,
    significanceLabel: 'Low',
    signals: {
      priceMovement: 12,
      volumeAnomaly: 10,
      sectorDivergence: 14,
      recentVolatility: 18,
    },
    sectorChangePct: 0.3,
    relativePerformance: -0.6,
    lastUpdated: '6 min ago',
    status: 'live',
    event: null,
    timeline: [
      { time: '9:20 AM', label: 'Market opened', type: 'market' },
    ],
    chart: genSeries(1303, 1298.70, 90),
  },
  {
    symbol: 'BAJFINANCE',
    name: 'Bajaj Finance Ltd.',
    sector: 'Financial Services',
    price: 7241.90,
    dayChange: 2.05,
    changeSinceLastVisit: 2.9,
    volume: '3.1M',
    volumeRatio: 1.6,
    significance: 47,
    significanceLabel: 'Medium',
    signals: {
      priceMovement: 40,
      volumeAnomaly: 38,
      sectorDivergence: 30,
      recentVolatility: 44,
    },
    sectorChangePct: 0.3,
    relativePerformance: 1.7,
    lastUpdated: '7 min ago',
    status: 'live',
    event: null,
    timeline: [
      { time: '9:20 AM', label: 'Market opened', type: 'market' },
    ],
    chart: genSeries(7085, 7241.90, 90),
  },
];

// Watchlist is a subset the demo user has already added, with a "last visit" snapshot.
export const watchlistSymbols = ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'BAJFINANCE'];

export const alerts = [
  {
    id: 'a1',
    symbol: 'RELIANCE',
    title: 'Significant movement detected',
    detail: '+3.8% — high significance',
    type: 'price',
    time: '10:32 AM',
    read: false,
  },
  {
    id: 'a2',
    symbol: 'TCS',
    title: 'Unusual trading volume',
    detail: '2.8x the 20-day average',
    type: 'volume',
    time: '11:05 AM',
    read: false,
  },
  {
    id: 'a3',
    symbol: 'INFY',
    title: 'Outperforming sector',
    detail: '+1.2% relative to IT sector',
    type: 'sector',
    time: '10:55 AM',
    read: false,
  },
  {
    id: 'a4',
    symbol: 'BAJFINANCE',
    title: 'Moderate volume increase',
    detail: '1.6x average volume',
    type: 'volume',
    time: '9:52 AM',
    read: true,
  },
];

export const marketBrief = {
  awaySpan: '4h 12m',
  bullets: [
    '3 stocks in your watchlist showed meaningful movement',
    'Energy sector outperformed the broader market',
    'RELIANCE showed the largest change, up 3.8%',
    '2 unusual volume events were detected',
  ],
};

export const marketStatus = {
  isOpen: true,
  lastUpdated: 'Just now',
  session: 'Regular trading session',
};

// Deterministic-looking pseudo price series generator for charts (mock only).
function genSeries(start, end, points) {
  const out = [];
  let val = start;
  const step = (end - start) / points;
  let seed = start * 7919;
  for (let i = 0; i < points; i++) {
    seed = (seed * 9301 + 49297) % 233280;
    const noise = (seed / 233280 - 0.5) * (start * 0.006);
    val += step + noise;
    out.push({ t: i, price: Number(val.toFixed(2)) });
  }
  out[out.length - 1].price = end;
  return out;
}

export function getGainersLosers() {
  const sorted = [...stocks].sort((a, b) => b.dayChange - a.dayChange);
  return {
    gainers: sorted.filter(s => s.dayChange > 0).slice(0, 5),
    losers: sorted.filter(s => s.dayChange < 0).sort((a, b) => a.dayChange - b.dayChange).slice(0, 5),
  };
}

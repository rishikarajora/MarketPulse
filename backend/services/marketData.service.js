const TWELVE_DATA_API_KEY = process.env.TWELVE_DATA_API_KEY;

const DEMO_MARKET_DATA = {
  RELIANCE: {
    symbol: 'RELIANCE',
    name: 'Reliance Industries',
    exchange: 'NSE',
    price: 4000.45,
    previousClose: 2360.25,
    change: 90.2,
    changePercent: 3.82,
    volume: 18200000,
  },

  TCS: {
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    exchange: 'NSE',
    price: 5102.1,
    previousClose: 5213.67,
    change: -111.57,
    changePercent: -2.14,
    volume: 2800000,
  },

  INFY: {
    symbol: 'INFY',
    name: 'Infosys',
    exchange: 'NSE',
    price: 1847.6,
    previousClose: 1817.07,
    change: 30.53,
    changePercent: 1.68,
    volume: 1300000,
  },

  HDFCBANK: {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank',
    exchange: 'NSE',
    price: 1689.25,
    previousClose: 1682.18,
    change: 7.07,
    changePercent: 0.42,
    volume: 1000000,
  },

  BAJFINANCE: {
    symbol: 'BAJFINANCE',
    name: 'Bajaj Finance',
    exchange: 'NSE',
    price: 7241.9,
    previousClose: 7096.25,
    change: 145.65,
    changePercent: 2.05,
    volume: 1600000,
  },
};

async function getTwelveDataQuote(symbol) {
  if (!TWELVE_DATA_API_KEY) {
    throw new Error('TWELVE_DATA_API_KEY is missing');
  }

  const url = new URL('https://api.twelvedata.com/quote');

  url.searchParams.set('symbol', symbol);
  url.searchParams.set('mic_code', 'XNSE');
  url.searchParams.set('apikey', TWELVE_DATA_API_KEY);

  const response = await fetch(url);

  const data = await response.json();

  if (!response.ok || data.status === 'error') {
    throw new Error(
      data.message || `Market API failed with status ${response.status}`
    );
  }

  return {
    symbol: data.symbol,
    name: data.name,
    exchange: data.exchange,
    price: Number(data.close),
    previousClose: Number(data.previous_close),
    change: Number(data.change),
    changePercent: Number(data.percent_change),
    volume: Number(data.volume),
    fetchedAt: new Date().toISOString(),

    // Metadata for resilience/debugging
    dataSource: 'twelve-data',
    isFallback: false,
    isStale: false,
  };
}

function getFallbackQuote(symbol) {
  const normalizedSymbol = symbol.trim().toUpperCase();
  const stock = DEMO_MARKET_DATA[normalizedSymbol];

  if (!stock) {
    return null;
  }

  return {
    ...stock,
    fetchedAt: new Date().toISOString(),

    // Important: frontend/backend can explicitly know
    // that this is not live provider data.
    dataSource: 'demo-fallback',
    isFallback: true,
    isStale: true,
  };
}

async function getQuote(symbol) {
  const normalizedSymbol = symbol.trim().toUpperCase();

  try {
    return await getTwelveDataQuote(normalizedSymbol);
  } catch (error) {
    console.warn(
      `Market provider unavailable for ${normalizedSymbol}. Using fallback data.`
    );

    const fallback = getFallbackQuote(normalizedSymbol);

    if (!fallback) {
      throw new Error(
        `No market data available for ${normalizedSymbol}`
      );
    }

    return fallback;
  }
}

async function getQuotes(symbols) {
  return Promise.all(
    symbols.map((symbol) => getQuote(symbol))
  );
}

module.exports = {
  getQuote,
  getQuotes,
};
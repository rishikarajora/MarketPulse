// Service layer — the single seam between UI and data.
//
// Every function here returns a Promise, matching what fetch() calls to a
// Node/Express backend will return. Components never import mockData.js
// directly; they only ever call through this file. When the real backend
// exists, replace the bodies below with fetch('/api/...') calls and the
// rest of the app should not need to change.
const API_BASE_URL = 'https://marketpulse-1-2fkf.onrender.com/';

export async function getSnapshotChanges() {
  const response = await fetch(`${API_BASE_URL}/snapshot/changes`);

  if (!response.ok) {
    throw new Error('Failed to fetch snapshot changes');
  }

  const data = await response.json();

  return data;
}

import {
  marketIndices,
  sectors,
  stocks,
  watchlistSymbols,
  alerts as mockAlerts,
  marketBrief,
  marketStatus,
  getGainersLosers,
} from '../data/mockData';

const NETWORK_DELAY = 380;

function delay(value, ms = NETWORK_DELAY) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

// Mutable in-memory copy so add/remove watchlist actions persist for the session.
const WATCHLIST_KEY = 'marketpulse_watchlist';
const SNAPSHOT_KEY = 'marketpulse_last_snapshot';
const ALERTS_KEY = 'marketpulse_alerts';

function loadWatchlist() {
  try {
    const saved = localStorage.getItem(WATCHLIST_KEY);

    if (!saved) {
      return [...watchlistSymbols];
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : [...watchlistSymbols];
  } catch {
    return [...watchlistSymbols];
  }
}

function saveWatchlist(watchlist) {
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
}

function loadSnapshot() {
  try {
    const saved = localStorage.getItem(SNAPSHOT_KEY);

    if (!saved) {
      return null;
    }

    return JSON.parse(saved);
  } catch {
    return null;
  }
}

function loadAlerts() {
  try {
    const saved = localStorage.getItem(ALERTS_KEY);

    if (!saved) {
      return clone(mockAlerts);
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : clone(mockAlerts);
  } catch {
    return clone(mockAlerts);
  }
}

function saveSnapshot(snapshot) {
  localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(snapshot));
}

function createMarketSnapshot() {
  const latestWatchlist = loadWatchlist();

  return stocks
    .filter((stock) => latestWatchlist.includes(stock.symbol))
    .map((stock) => ({
      symbol: stock.symbol,
      price: stock.price,
      dayChange: stock.dayChange,
      volume: parseVolume(stock.volume),
      significance: stock.significance,
      capturedAt: new Date().toISOString(),
    }));
}

function calculateChanges(previousSnapshot, currentSnapshot) {
  if (!previousSnapshot) {
    return [];
  }

  // Supports both old snapshot format (array)
  // and new snapshot format ({ savedAt, stocks })
  const previousStocks = Array.isArray(previousSnapshot)
    ? previousSnapshot
    : previousSnapshot.stocks || [];

  return currentSnapshot
    .map((current) => {
      const previous = previousStocks.find(
        (item) => item.symbol === current.symbol
      );

      if (!previous) {
        return null;
      }

      const stock = stocks.find((s) => s.symbol === current.symbol);

      const priceChange =
        previous.price === 0
          ? 0
          : ((current.price - previous.price) / previous.price) * 100;

      const volumeChange =
        previous.volume === 0
          ? 0
          : ((current.volume - previous.volume) / previous.volume) * 100;

      return {
        ...current,

        name: stock?.name || current.symbol,
        sector: stock?.sector || '—',

        significanceLabel:
          current.significance >= 60
            ? 'High'
            : current.significance >= 40
              ? 'Medium'
              : 'Low',

        signals: stock?.signals || {
          volumeAnomaly: 0,
          priceMovement: 0,
          recentVolatility: 0,
        },

        volumeRatio: stock?.volumeRatio || 0,
        sectorChangePct: stock?.sectorChangePct || 0,
        relativePerformance: stock?.relativePerformance || 0,

        previousPrice: previous.price,

        priceChangeSinceLastVisit: Number(
          priceChange.toFixed(2)
        ),

        volumeChangeSinceLastVisit: Number(
          volumeChange.toFixed(2)
        ),
      };
    })
    .filter(Boolean)
    .filter(
      (stock) =>
        Math.abs(stock.priceChangeSinceLastVisit) >= 1 ||
        Math.abs(stock.volumeChangeSinceLastVisit) >= 50
    )
    .sort(
      (a, b) =>
        Math.abs(b.priceChangeSinceLastVisit) -
        Math.abs(a.priceChangeSinceLastVisit)
    );
}
let currentWatchlist = loadWatchlist();

export async function saveCurrentSnapshot() {
  const response = await fetch(`${API_BASE_URL}/snapshot`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to save snapshot');
  }

  const data = await response.json();

  return {
    success: true,
    savedAt: data.data?.capturedAt || new Date().toISOString(),
  };
}
export async function getDashboard() {
    const backendSnapshot = await getSnapshotChanges();
  const backendChanges = backendSnapshot.data || [];

  const normalizedBackendChanges = backendChanges.map((change) => {
  const stock = stocks.find((s) => s.symbol === change.symbol);

  return {
    ...change,
    name: change.name || stock?.name || change.symbol,
    dayChange: stock?.dayChange ?? change.priceChangePercent ?? 0,
    volumeRatio: stock?.volumeRatio ?? 0,
    sector: stock?.sector || '—',
    sectorChangePct: stock?.sectorChangePct ?? 0,
    relativePerformance: stock?.relativePerformance ?? 0,
    signals: stock?.signals || {
      volumeAnomaly: 0,
      priceMovement: 0,
      recentVolatility: 0,
    },
    significance: change.currentSignificance ?? stock?.significance ?? 0,
    significanceLabel:
      change.currentSignificance >= 60
        ? 'High'
        : change.currentSignificance >= 40
          ? 'Medium'
          : 'Low',
  };
});

  const currentSnapshot = createMarketSnapshot();
  const previousSnapshot = loadSnapshot();

  const changes = calculateChanges(
    previousSnapshot,
    currentSnapshot
  );

  console.log('PREVIOUS SNAPSHOT:', previousSnapshot);
  console.log('CURRENT SNAPSHOT:', currentSnapshot);
  console.log('CALCULATED CHANGES:', changes);

  const watchlistStocks = stocks.filter((s) =>
    currentWatchlist.includes(s.symbol)
  );

  const significantChanges = watchlistStocks
    .filter((s) => s.significance >= 40)
    .sort((a, b) => b.significance - a.significance);

  return delay({
    marketStatus: clone(marketStatus),
    indices: clone(marketIndices),
    watchlistCount: currentWatchlist.length,
    needingAttention: watchlistStocks.filter(
      (s) => s.significance >= 60
    ).length,
    meaningfulChanges: changes.length,
    sinceYouLastChecked: clone(normalizedBackendChanges),
    brief: clone(marketBrief),
    lastCheckedAt: previousSnapshot?.savedAt || null,
  });
}

export async function getWatchlist() {
  const response = await fetch(`${API_BASE_URL}/watchlist`);

  if (!response.ok) {
    throw new Error('Failed to fetch watchlist');
  }

  const data = await response.json();
  const symbols = data.symbols || [];

  return stocks
    .filter((stock) => symbols.includes(stock.symbol))
    .map((stock) => clone(stock));
}
export function getStockDetails(symbol) {
  const stock = stocks.find((s) => s.symbol === symbol);
  if (!stock) {
    return Promise.reject(new Error(`No data found for ${symbol}`));
  }
  return delay(clone(stock));
}

export function searchStocks(query) {
  const q = query.trim().toLowerCase();
  if (!q) return delay([]);
  const results = stocks
    .filter((s) => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q))
    .map((s) => ({
      symbol: s.symbol,
      name: s.name,
      price: s.price,
      dayChange: s.dayChange,
      inWatchlist: currentWatchlist.includes(s.symbol),
    }));
  return delay(results, 220);
}

export async function addToWatchlist(symbol) {
  const response = await fetch(`${API_BASE_URL}/watchlist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ symbol }),
  });

  if (!response.ok) {
    throw new Error('Failed to add stock to watchlist');
  }

  const data = await response.json();

  return data.symbols || [];
}

export async function removeFromWatchlist(symbol) {
  const response = await fetch(
    `${API_BASE_URL}/watchlist/${encodeURIComponent(symbol)}`,
    {
      method: 'DELETE',
    }
  );

  if (!response.ok) {
    throw new Error('Failed to remove stock from watchlist');
  }

  const data = await response.json();

  return data.symbols || [];
}

export function getAlerts() {
  const savedAlerts = loadAlerts();
  const generatedAlerts = generateAlerts();

  const readState = new Map(
    savedAlerts.map((alert) => [alert.id, alert.read])
  );

  const alerts = generatedAlerts.map((alert) => ({
    ...alert,
    read: readState.get(alert.id) ?? false,
  }));

  localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));

  return delay(clone(alerts));
}

export function markAlertRead(id) {
  const alerts = loadAlerts().map((alert) =>
    alert.id === id
      ? { ...alert, read: true }
      : alert
  );

  localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));

  return delay({
    success: true,
    alerts: clone(alerts),
  });
}

export function markAllAlertsRead() {
  const alerts = loadAlerts().map((alert) => ({
    ...alert,
    read: true,
  }));

  localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));

  return delay({
    success: true,
    alerts: clone(alerts),
  });
}

export function getMarketOverview() {
  const { gainers, losers } = getGainersLosers();
  return delay({
    indices: clone(marketIndices),
    sectors: clone(sectors),
    gainers: clone(gainers),
    losers: clone(losers),
  });
}

function generateAlerts() {
  const generated = [];
  const seen = new Set();

  function addAlert(alert) {
    if (seen.has(alert.id)) return;
    seen.add(alert.id);
    generated.push(alert);
  }

  stocks
    .filter((stock) => currentWatchlist.includes(stock.symbol))
    .forEach((stock) => {
      if (stock.significance >= 60) {
        addAlert({
          id: `price-${stock.symbol}`,
          symbol: stock.symbol,
          title: 'Significant movement detected',
          detail: `${stock.dayChange >= 0 ? '+' : ''}${stock.dayChange.toFixed(1)}% — high significance`,
          type: 'price',
          time: stock.lastUpdated,
          read: false,
        });
      }

      if (stock.volumeRatio >= 2) {
        addAlert({
          id: `volume-${stock.symbol}`,
          symbol: stock.symbol,
          title: 'Unusual trading volume',
          detail: `${stock.volumeRatio}x the 20-day average`,
          type: 'volume',
          time: stock.lastUpdated,
          read: false,
        });
      }

      if (Math.abs(stock.relativePerformance) >= 1) {
        addAlert({
          id: `sector-${stock.symbol}`,
          symbol: stock.symbol,
          title:
            stock.relativePerformance > 0
              ? 'Outperforming sector'
              : 'Underperforming sector',
          detail: `${stock.relativePerformance > 0 ? '+' : ''}${stock.relativePerformance.toFixed(1)}% relative to ${stock.sector}`,
          type: 'sector',
          time: stock.lastUpdated,
          read: false,
        });
      }

      if (stock.event) {
        addAlert({
          id: `event-${stock.symbol}`,
          symbol: stock.symbol,
          title: 'Company event detected',
          detail: stock.event.headline,
          type: 'event',
          time: stock.lastUpdated,
          read: false,
        });
      }
    });

  return generated;
}
function parseVolume(value) {
  if (typeof value === 'number') return value;

  if (typeof value !== 'string') return 0;

  const text = value.trim().toUpperCase();

  if (text.endsWith('M')) {
    return parseFloat(text) * 1_000_000;
  }

  if (text.endsWith('K')) {
    return parseFloat(text) * 1_000;
  }

  if (text.endsWith('B')) {
    return parseFloat(text) * 1_000_000_000;
  }

  const parsed = parseFloat(text);

  return Number.isFinite(parsed) ? parsed : 0;
}
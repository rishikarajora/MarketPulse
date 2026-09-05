import { useEffect, useMemo, useState } from 'react';
import { getWatchlist, removeFromWatchlist } from '../services/api';
import WatchlistTable from '../components/watchlist/WatchlistTable';
import AddStockModal from '../components/watchlist/AddStockModal';
import { SkeletonRow } from '../components/common/Skeleton';
import { EmptyState, ErrorState } from '../components/common/StateViews';
import './Watchlist.css';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'high', label: 'High significance' },
  { key: 'gainers', label: 'Gainers' },
  { key: 'losers', label: 'Losers' },
];

export default function Watchlist() {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState('loading');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortKey, setSortKey] = useState('significance');
  const [sortDir, setSortDir] = useState('desc');
  const [showAdd, setShowAdd] = useState(false);

  function load() {
    setStatus('loading');
    getWatchlist()
      .then((r) => { setRows(r); setStatus('ready'); })
      .catch(() => setStatus('error'));
  }

  useEffect(load, []);

  async function handleRemove(symbol) {
    setRows((r) => r.filter((s) => s.symbol !== symbol));
    await removeFromWatchlist(symbol);
  }

  function handleAdded() {
    load();
  }

  function handleSort(key) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  const visibleRows = useMemo(() => {
    let out = rows;
    if (query.trim()) {
      const q = query.toLowerCase();
      out = out.filter((s) => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q));
    }
    if (filter === 'high') out = out.filter((s) => s.significanceLabel === 'High');
    if (filter === 'gainers') out = out.filter((s) => s.dayChange > 0);
    if (filter === 'losers') out = out.filter((s) => s.dayChange < 0);

    const dir = sortDir === 'asc' ? 1 : -1;
    out = [...out].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'string') return av.localeCompare(bv) * dir;
      return (av - bv) * dir;
    });
    return out;
  }, [rows, query, filter, sortKey, sortDir]);

  return (
    <div className="page-fade">
      <div className="wl-head">
        <div>
          <h1 className="wl-head__title">My watchlist</h1>
          <p className="wl-head__subtitle">{rows.length} stock{rows.length !== 1 ? 's' : ''} tracked</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Add stock</button>
      </div>

      <div className="wl-controls">
        <div className="wl-controls__search">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M13 13l-3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Filter your watchlist"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="wl-controls__chips">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`wl-chip ${filter === f.key ? 'wl-chip--active' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {status === 'loading' && (
        <div className="card">
          {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
        </div>
      )}

      {status === 'error' && (
        <div className="card"><ErrorState description="Couldn't load your watchlist." onRetry={load} /></div>
      )}

      {status === 'ready' && rows.length === 0 && (
        <div className="card">
          <EmptyState
            icon="＋"
            title="Your watchlist is empty"
            description="Add stocks to start tracking meaningful changes, not just prices."
            actionLabel="Add your first stock"
            onAction={() => setShowAdd(true)}
          />
        </div>
      )}

      {status === 'ready' && rows.length > 0 && visibleRows.length === 0 && (
        <div className="card">
          <EmptyState icon="⌕" title="No matches" description="Try a different search term or filter." />
        </div>
      )}

      {status === 'ready' && visibleRows.length > 0 && (
        <WatchlistTable
          rows={visibleRows}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          onRemove={handleRemove}
        />
      )}

      {showAdd && <AddStockModal onClose={() => setShowAdd(false)} onAdded={handleAdded} />}
    </div>
  );
}

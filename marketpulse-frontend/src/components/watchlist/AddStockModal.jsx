import { useEffect, useState } from 'react';
import { searchStocks, addToWatchlist } from '../../services/api';
import './AddStockModal.css';

export default function AddStockModal({ onClose, onAdded }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addingSymbol, setAddingSymbol] = useState(null);

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    setLoading(true);
    let active = true;
    searchStocks(query).then((r) => {
      if (active) { setResults(r); setLoading(false); }
    });
    return () => { active = false; };
  }, [query]);

  async function handleAdd(symbol) {
    setAddingSymbol(symbol);
    await addToWatchlist(symbol);
    setAddingSymbol(null);
    onAdded(symbol);
    setResults((r) => r.map((s) => (s.symbol === symbol ? { ...s, inWatchlist: true } : s)));
  }

  return (
    <div className="add-modal__overlay" onMouseDown={onClose}>
      <div className="add-modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="add-modal__head">
          <h3>Add to watchlist</h3>
          <button className="add-modal__close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="add-modal__search">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M13 13l-3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <input
            autoFocus
            type="text"
            placeholder="Search by symbol or company name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="add-modal__results">
          {!query.trim() && (
            <p className="add-modal__hint">Try RELIANCE, TCS, INFY, HDFCBANK...</p>
          )}
          {query.trim() && loading && <p className="add-modal__hint">Searching...</p>}
          {query.trim() && !loading && results.length === 0 && (
            <p className="add-modal__hint">No stocks found for "{query}"</p>
          )}
          {results.map((r) => (
            <div key={r.symbol} className="add-modal__row">
              <div>
                <div className="add-modal__symbol">{r.symbol}</div>
                <div className="add-modal__name">{r.name}</div>
              </div>
              <div className="add-modal__row-right">
                <span className={`num ${r.dayChange >= 0 ? 'up' : 'down'}`}>
                  {r.dayChange >= 0 ? '+' : ''}{r.dayChange.toFixed(2)}%
                </span>
                {r.inWatchlist ? (
                  <span className="add-modal__added">Added</span>
                ) : (
                  <button
                    className="btn btn-secondary btn-sm"
                    disabled={addingSymbol === r.symbol}
                    onClick={() => handleAdd(r.symbol)}
                  >
                    {addingSymbol === r.symbol ? 'Adding…' : 'Add'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { searchStocks } from '../../services/api';
import './Header.css';

export default function Header({ unreadAlerts = 0, onMenuClick, title }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function onClickOutside(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    let active = true;
    searchStocks(query).then((r) => {
      if (active) setResults(r);
    });
    return () => { active = false; };
  }, [query]);

  function goToStock(symbol) {
    setQuery('');
    setOpen(false);
    navigate(`/stock/${symbol}`);
  }

  return (
    <header className="header">
      <button className="header__menu-btn" onClick={onMenuClick} aria-label="Open navigation">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M2 4.5h14M2 9h14M2 13.5h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {title && <h1 className="header__title">{title}</h1>}

      <div className="header__search" ref={boxRef}>
        <svg className="header__search-icon" width="15" height="15" viewBox="0 0 15 15" fill="none">
          <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.4" />
          <path d="M13 13l-3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          placeholder="Search stocks — try RELIANCE, TCS..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
        />
        {open && query.trim() && (
          <div className="header__results">
            {results.length === 0 && (
              <div className="header__result-empty">No matches for "{query}"</div>
            )}
            {results.map((r) => (
              <button key={r.symbol} className="header__result" onClick={() => goToStock(r.symbol)}>
                <span className="header__result-symbol">{r.symbol}</span>
                <span className="header__result-name">{r.name}</span>
                <span className={`num header__result-change ${r.dayChange >= 0 ? 'up' : 'down'}`}>
                  {r.dayChange >= 0 ? '+' : ''}{r.dayChange.toFixed(2)}%
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="header__actions">
        <button className="header__icon-btn" onClick={() => navigate('/alerts')} aria-label="Notifications">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 2.3c-2.1 0-3.8 1.7-3.8 3.9v2.5c0 .6-.3 1.5-.8 2l-.6.7h10.4l-.6-.7c-.5-.5-.8-1.4-.8-2V6.2c0-2.2-1.7-3.9-3.8-3.9z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
            <path d="M7.4 13.9a1.6 1.6 0 003.2 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          {unreadAlerts > 0 && <span className="header__dot" />}
        </button>
        <div className="header__avatar">AS</div>
      </div>
    </header>
  );
}

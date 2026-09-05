import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getStockDetails, addToWatchlist, removeFromWatchlist, getWatchlist } from '../services/api';
import PriceChart from '../components/stockDetail/PriceChart';
import IntelligencePanel from '../components/stockDetail/IntelligencePanel';
import SignificanceScore from '../components/stockDetail/SignificanceScore';
import Timeline from '../components/stockDetail/Timeline';
import ChangeValue from '../components/common/ChangeValue';
import WhyModal from '../components/common/WhyModal';
import { SkeletonCard } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/StateViews';
import './StockDetails.css';

export default function StockDetails() {
  const { symbol } = useParams();
  const [stock, setStock] = useState(null);
  const [status, setStatus] = useState('loading');
  const [showWhy, setShowWhy] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [busy, setBusy] = useState(false);

  function load() {
    setStatus('loading');
    getStockDetails(symbol)
      .then((s) => { setStock(s); setStatus('ready'); })
      .catch(() => setStatus('error'));
    getWatchlist().then((list) => setInWatchlist(list.some((s) => s.symbol === symbol)));
  }

  useEffect(load, [symbol]);

  async function toggleWatchlist() {
    setBusy(true);
    if (inWatchlist) {
      await removeFromWatchlist(symbol);
      setInWatchlist(false);
    } else {
      await addToWatchlist(symbol);
      setInWatchlist(true);
    }
    setBusy(false);
  }

  if (status === 'loading') {
    return (
      <div className="page-fade">
        <SkeletonCard lines={4} />
      </div>
    );
  }

  if (status === 'error' || !stock) {
    return (
      <div className="card">
        <ErrorState description={`We couldn't load data for ${symbol}.`} onRetry={load} />
      </div>
    );
  }

  const positive = stock.dayChange >= 0;

  return (
    <div className="page-fade">
      <Link to="/watchlist" className="sd-back">← Back to watchlist</Link>

      <div className="sd-head">
        <div>
          <div className="sd-head__symbol-row">
            <h1 className="sd-head__symbol">{stock.symbol}</h1>
            <span className="sd-head__market-status">
              <span className="sd-head__dot" /> Market open
            </span>
          </div>
          <p className="sd-head__name">{stock.name} · {stock.sector}</p>
        </div>
        <button
          className={`btn ${inWatchlist ? 'btn-danger-ghost' : 'btn-primary'}`}
          onClick={toggleWatchlist}
          disabled={busy}
        >
          {inWatchlist ? 'Remove from watchlist' : '+ Add to watchlist'}
        </button>
      </div>

      <div className="sd-price-row">
        <span className="num sd-price">₹{stock.price.toLocaleString('en-IN')}</span>
        <ChangeValue value={stock.dayChange} size="lg" />
        <span className="sd-updated">Updated {stock.lastUpdated}</span>
      </div>

      <div className="sd-grid">
        <div className="sd-grid__main">
          <PriceChart series={stock.chart} positive={positive} />
          <IntelligencePanel stock={stock} onWhy={() => setShowWhy(true)} />
          <Timeline items={stock.timeline} />
        </div>
        <div className="sd-grid__side">
          <SignificanceScore
            score={stock.significance}
            label={stock.significanceLabel}
            breakdown={stock.signals}
          />
        </div>
      </div>

      {showWhy && <WhyModal stock={stock} onClose={() => setShowWhy(false)} />}
    </div>
  );
}

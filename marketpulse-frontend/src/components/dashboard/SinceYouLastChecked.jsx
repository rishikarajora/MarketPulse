import { useState } from 'react';
import { Link } from 'react-router-dom';
import ChangeValue from '../common/ChangeValue';
import SignificanceTag from '../common/SignificanceTag';
import WhyModal from '../common/WhyModal';
import { EmptyState } from '../common/StateViews';
import './SinceYouLastChecked.css';

export default function SinceYouLastChecked({ items }) {
  console.log('SYLC ITEMS:', items);
  const [whyStock, setWhyStock] = useState(null);

  if (!items || items.length === 0) {
    return (
      <div className="section">
        <div className="section__head">
          <div>
            <h2 className="section__title">Since you last checked</h2>
            <p className="section__subtitle">Nothing rose above your significance threshold — a quiet session.</p>
          </div>
        </div>
        <div className="card">
          <EmptyState
            icon="✓"
            title="No meaningful changes"
            description="Your watchlist is stable right now. MarketPulse will surface anything that crosses a significance threshold."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="section__head">
        <div>
          <h2 className="section__title">Since you last checked</h2>
          <p className="section__subtitle">Meaningful changes, ranked by significance — not just raw price moves.</p>
        </div>
        <span className="section__meta">{items.length} flagged</span>
      </div>

      <div className="sylc-grid">
        {items.map((s) => (
          <ChangeCard key={s.symbol} stock={s} onWhy={() => setWhyStock(s)} />
        ))}
      </div>

      {whyStock && <WhyModal stock={whyStock} onClose={() => setWhyStock(null)} />}
    </div>
  );
}

function ChangeCard({ stock, onWhy }) {
  const accentClass = stock.significanceLabel === 'High'
    ? 'sylc-card--high'
    : stock.significanceLabel === 'Medium'
      ? 'sylc-card--medium'
      : 'sylc-card--low';

  const reasonLine = buildReasonLine(stock);

  return (
    <div className={`sylc-card ${accentClass}`}>
      <div className="sylc-card__top">
        <div>
          <Link to={`/stock/${stock.symbol}`} className="sylc-card__symbol">{stock.symbol}</Link>
          <div className="sylc-card__name">{stock.name}</div>
        </div>
        <SignificanceTag label={stock.significanceLabel} score={stock.significance} compact />
      </div>

      <div className="sylc-card__change">
        <ChangeValue value={stock.dayChange} size="lg" />
        <span className="sylc-card__price num">
  ₹{(stock.price ?? stock.currentPrice ?? 0).toLocaleString('en-IN')}
</span>
      </div>

      <p className="sylc-card__reason">{reasonLine}</p>

      <div className="sylc-card__stats">
        <Stat label="Volume" value={`${stock.volumeRatio}x avg`} flag={stock.volumeRatio >= 2} />
        <Stat label="Sector" value={`${stock.sectorChangePct >= 0 ? '+' : ''}${stock.sectorChangePct.toFixed(1)}%`} />
        <Stat label="Relative perf." value={`${stock.relativePerformance >= 0 ? '+' : ''}${stock.relativePerformance.toFixed(1)}%`} />
      </div>

      <button className="sylc-card__cta" onClick={onWhy}>View why</button>
    </div>
  );
}

function Stat({ label, value, flag }) {
  return (
    <div className="sylc-stat">
      <span className="sylc-stat__label">{label}</span>
      <span className={`num sylc-stat__value ${flag ? 'sylc-stat__value--flag' : ''}`}>{value}</span>
    </div>
  );
}

function buildReasonLine(stock) {
  if (stock.signals.volumeAnomaly >= 70) {
    return `Volume is ${stock.volumeRatio}x its 20-day average — unusual activity detected.`;
  }
  if (stock.relativePerformance >= 2) {
    return `${stock.symbol} outperformed its ${stock.sector} sector by ${stock.relativePerformance.toFixed(1)}%.`;
  }
  if (stock.signals.priceMovement >= 70) {
    return 'Price moved significantly compared to its recent trading range.';
  }
  return 'Movement is modest but worth a glance given recent volatility.';
}

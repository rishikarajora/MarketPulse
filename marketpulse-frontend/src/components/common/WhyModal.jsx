import { useEffect } from 'react';
import './WhyModal.css';

export default function WhyModal({ stock, onClose }) {
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!stock) return null;

  const reasons = buildReasons(stock);

  return (
    <div className="why-modal__overlay" onMouseDown={onClose}>
      <div className="why-modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="why-modal__head">
          <div>
            <div className="why-modal__eyebrow">Why are you seeing this</div>
            <h3 className="why-modal__title">{stock.symbol}</h3>
          </div>
          <button className="why-modal__close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="why-modal__score">
  <div className="why-modal__score-head">
    <span>Significance</span>
    <strong>{stock.significance}/100</strong>
  </div>

  <div className="why-modal__score-bar">
    <div
      className="why-modal__score-fill"
      style={{ width: `${stock.significance}%` }}
    />
  </div>

  <span className="why-modal__score-label">
    {stock.significance >= 60
      ? 'HIGH'
      : stock.significance >= 40
        ? 'MEDIUM'
        : 'LOW'}
  </span>
</div>
        <ul className="why-modal__reasons">
          {reasons.map((r) => (
            <li key={r} className="why-modal__reason">
              <span className="why-modal__check">✓</span>
              {r}
            </li>
          ))}
        </ul>

        {stock.event && (
          <div className="why-modal__event">
            <div className="why-modal__event-label">Possible related event</div>
            <p className="why-modal__event-text">{stock.event.headline}. {stock.event.detail}</p>
          </div>
        )}

        <div className="why-modal__disclaimer">
          MarketPulse surfaces patterns in price, volume, and sector data. It does not claim
          to know what caused a movement, and this is not investment advice.
        </div>
      </div>
    </div>
  );
}

function buildReasons(stock) {
  const reasons = [];
  if (stock.signals.priceMovement >= 50) {
    reasons.push('Price movement is above its normal range for this stock');
  }
  if (stock.signals.volumeAnomaly >= 50) {
    reasons.push(`Trading volume is unusually high — ${stock.volumeRatio}x the recent average`);
  }
  if (stock.relativePerformance >= 1) {
    reasons.push(`Stock is outperforming its sector by ${stock.relativePerformance.toFixed(1)}%`);
  } else if (stock.relativePerformance <= -1) {
    reasons.push(`Stock is underperforming its sector by ${Math.abs(stock.relativePerformance).toFixed(1)}%`);
  }
  if (stock.signals.recentVolatility >= 50) {
    reasons.push('Recent volatility is elevated compared to the last 20 sessions');
  }
  if (reasons.length === 0) {
    reasons.push('Minor movement within the stock\u2019s normal trading range');
  }
  return reasons;
}

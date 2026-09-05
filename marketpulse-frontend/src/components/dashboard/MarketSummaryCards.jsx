import ChangeValue from '../common/ChangeValue';
import './MarketSummaryCards.css';

export default function MarketSummaryCards({ indices, needingAttention, meaningfulChanges }) {
  const nifty = indices.find((i) => i.symbol === 'NIFTY50');
  const sensex = indices.find((i) => i.symbol === 'SENSEX');

  return (
    <div className="summary-grid">
      {nifty && <IndexCard index={nifty} />}
      {sensex && <IndexCard index={sensex} />}
      <MetricCard
        label="Needing attention"
        value={needingAttention}
        tone={needingAttention > 0 ? 'amber' : 'neutral'}
        hint="High-significance stocks in your watchlist"
      />
      <MetricCard
        label="Meaningful changes"
        value={meaningfulChanges}
        tone={meaningfulChanges > 0 ? 'green' : 'neutral'}
        hint="Detected since your last visit"
      />
    </div>
  );
}

function IndexCard({ index }) {
  return (
    <div className="summary-card">
      <div className="summary-card__label">{index.name}</div>
      <div className="summary-card__value num">{index.value.toLocaleString('en-IN')}</div>
      <ChangeValue value={index.changePct} />
    </div>
  );
}

function MetricCard({ label, value, tone, hint }) {
  return (
    <div className="summary-card">
      <div className="summary-card__label">{label}</div>
      <div className={`summary-card__value num summary-card__value--${tone}`}>{value}</div>
      <div className="summary-card__hint">{hint}</div>
    </div>
  );
}

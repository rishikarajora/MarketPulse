import './IntelligencePanel.css';

export default function IntelligencePanel({ stock, onWhy }) {
  return (
    <div className="intel-panel">
      <div className="intel-panel__head">
        <h3 className="intel-panel__title">MarketPulse Intelligence</h3>
        <button className="btn btn-secondary btn-sm" onClick={onWhy}>Why am I seeing this?</button>
      </div>

      <div className="intel-grid">
        <IntelItem
          label="Price change"
          value={`${stock.dayChange >= 0 ? '+' : ''}${stock.dayChange.toFixed(2)}%`}
          tone={stock.dayChange >= 0 ? 'up' : 'down'}
        />
        <IntelItem
          label="Volume anomaly"
          value={`${stock.volumeRatio}x average`}
          tone={stock.volumeRatio >= 2 ? 'warn' : 'neutral'}
        />
        <IntelItem
          label="Sector movement"
          value={`${stock.sectorChangePct >= 0 ? '+' : ''}${stock.sectorChangePct.toFixed(1)}%`}
          tone="neutral"
        />
        <IntelItem
          label="Relative performance"
          value={`${stock.relativePerformance >= 0 ? '+' : ''}${stock.relativePerformance.toFixed(1)}%`}
          tone={stock.relativePerformance >= 0 ? 'up' : 'down'}
        />
      </div>
    </div>
  );
}

function IntelItem({ label, value, tone }) {
  return (
    <div className="intel-item">
      <span className="intel-item__label">{label}</span>
      <span className={`num intel-item__value intel-item__value--${tone}`}>{value}</span>
    </div>
  );
}

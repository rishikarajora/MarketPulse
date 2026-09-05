import './SignificanceScore.css';

const BREAKDOWN_LABELS = {
  priceMovement: 'Price movement',
  volumeAnomaly: 'Volume anomaly',
  sectorDivergence: 'Sector divergence',
  recentVolatility: 'Recent volatility',
};

export default function SignificanceScore({ score, label, breakdown }) {
  const toneClass = label === 'High' ? 'score--high' : label === 'Medium' ? 'score--medium' : 'score--low';

  return (
    <div className={`score-panel ${toneClass}`}>
      <div className="score-panel__headline">
        <span className="num score-panel__number">{score}</span>
        <span className="score-panel__label">{label}</span>
      </div>
      <div className="score-panel__breakdown">
        {Object.entries(breakdown).map(([key, value]) => (
          <div key={key} className="score-row">
            <span className="score-row__label">{BREAKDOWN_LABELS[key] || key}</span>
            <div className="score-row__track">
              <div className="score-row__fill" style={{ width: `${value}%` }} />
            </div>
            <span className="num score-row__value">{value}</span>
          </div>
        ))}
      </div>
      <p className="score-panel__note">
        Score reflects magnitude, not direction — it flags attention-worthy activity, not a buy or sell signal.
      </p>
    </div>
  );
}

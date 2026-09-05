import './SectorBars.css';

export default function SectorBars({ sectors }) {
  const maxAbs = Math.max(...sectors.map((s) => Math.abs(s.changePct)), 1);
  return (
    <div className="sector-bars">
      {sectors.map((s) => {
        const width = (Math.abs(s.changePct) / maxAbs) * 100;
        const positive = s.changePct >= 0;
        return (
          <div key={s.name} className="sector-bar-row">
            <span className="sector-bar-row__name">{s.name}</span>
            <div className="sector-bar-row__track">
              <div
                className={`sector-bar-row__fill ${positive ? 'sector-bar-row__fill--up' : 'sector-bar-row__fill--down'}`}
                style={{ width: `${width}%` }}
              />
            </div>
            <span className={`num sector-bar-row__value ${positive ? 'up' : 'down'}`}>
              {positive ? '+' : ''}{s.changePct.toFixed(1)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

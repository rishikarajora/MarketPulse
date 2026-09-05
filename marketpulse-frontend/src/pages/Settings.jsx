import { useState } from 'react';
import './Settings.css';

const ALERT_PREFS = [
  { key: 'significantMove', label: 'Significant price movement', desc: 'Notify when a stock moves well outside its normal range.' },
  { key: 'unusualVolume', label: 'Unusual volume', desc: 'Notify when trading volume spikes above its recent average.' },
  { key: 'majorEvent', label: 'Major company event', desc: 'Notify when an announcement coincides with unusual activity.' },
  { key: 'sectorDivergence', label: 'Sector divergence', desc: 'Notify when a stock moves noticeably against its sector.' },
];

export default function Settings() {
  const [prefs, setPrefs] = useState({
    significantMove: true,
    unusualVolume: true,
    majorEvent: true,
    sectorDivergence: false,
  });
  const [sensitivity, setSensitivity] = useState(2); // 0-4, Low to High
  const [saved, setSaved] = useState(false);

  function toggle(key) {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
    setSaved(false);
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }

  const sensitivityLabels = ['Low', 'Low–Medium', 'Medium', 'Medium–High', 'High'];

  return (
    <div className="page-fade">
      <h1 className="settings-title">Settings</h1>
      <p className="settings-subtitle">Control what MarketPulse flags as meaningful, and how often.</p>

      <div className="card settings-card">
        <h2 className="settings-card__title">Alert preferences</h2>
        <p className="settings-card__desc">Choose which kinds of changes trigger an alert.</p>
        <div className="settings-list">
          {ALERT_PREFS.map((p) => (
            <div key={p.key} className="settings-row">
              <div>
                <div className="settings-row__label">{p.label}</div>
                <div className="settings-row__desc">{p.desc}</div>
              </div>
              <Toggle checked={prefs[p.key]} onChange={() => toggle(p.key)} label={p.label} />
            </div>
          ))}
        </div>
      </div>

      <div className="card settings-card">
        <h2 className="settings-card__title">Sensitivity</h2>
        <p className="settings-card__desc">
          Higher sensitivity flags smaller changes as significant. Lower sensitivity only surfaces
          the most notable moves.
        </p>
        <div className="sensitivity">
          <input
            type="range"
            min="0"
            max="4"
            value={sensitivity}
            onChange={(e) => { setSensitivity(Number(e.target.value)); setSaved(false); }}
            className="sensitivity__slider"
            aria-label="Alert sensitivity"
          />
          <div className="sensitivity__scale">
            <span>Low</span>
            <span>High</span>
          </div>
          <div className="sensitivity__current">Currently: <strong>{sensitivityLabels[sensitivity]}</strong></div>
        </div>
      </div>

      <div className="settings-save-row">
        <button className="btn btn-primary" onClick={handleSave}>Save preferences</button>
        {saved && <span className="settings-saved">Saved</span>}
      </div>
    </div>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`toggle ${checked ? 'toggle--on' : ''}`}
      onClick={onChange}
    >
      <span className="toggle__thumb" />
    </button>
  );
}

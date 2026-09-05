import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getAlerts,
  markAlertRead,
  markAllAlertsRead,
} from '../services/api';
import { SkeletonRow } from '../components/common/Skeleton';
import { EmptyState, ErrorState } from '../components/common/StateViews';
import './Alerts.css';

const TYPE_META = {
  price: { icon: '▲', className: 'alert-icon--price' },
  volume: { icon: '◆', className: 'alert-icon--volume' },
  sector: { icon: '◐', className: 'alert-icon--sector' },
};

export default function Alerts({ onAlertsChange }) {
  const [alerts, setAlerts] = useState([]);
  const [status, setStatus] = useState('loading');

  function load() {
    setStatus('loading');
    getAlerts()
      .then((list) => { setAlerts(list); setStatus('ready'); })
      .catch(() => setStatus('error'));
  }

  useEffect(load, []);

  async function markAllRead() {
  try {
    const result = await markAllAlertsRead();

    setAlerts(result.alerts);
    onAlertsChange?.(0);
  } catch {
    // Keep the current UI state if persistence fails.
  }
}

  async function markRead(id) {
  try {
    const result = await markAlertRead(id);

    setAlerts(result.alerts);

    const unread = result.alerts.filter((a) => !a.read).length;
    onAlertsChange?.(unread);
  } catch {
    // Keep the current UI state if persistence fails.
  }
}

  const unreadCount = alerts.filter((a) => !a.read).length;

  return (
    <div className="page-fade">
      <div className="alerts-head">
        <div>
          <h1 className="alerts-title">Alerts</h1>
          <p className="alerts-subtitle">{unreadCount} unread</p>
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-secondary" onClick={markAllRead}>Mark all as read</button>
        )}
      </div>

      {status === 'loading' && (
        <div className="card">{Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}</div>
      )}

      {status === 'error' && (
        <div className="card"><ErrorState description="Couldn't load alerts." onRetry={load} /></div>
      )}

      {status === 'ready' && alerts.length === 0 && (
        <div className="card">
          <EmptyState icon="🔔" title="No alerts yet" description="You'll see alerts here when MarketPulse detects meaningful changes." />
        </div>
      )}

      {status === 'ready' && alerts.length > 0 && (
        <div className="card alerts-list">
          {alerts.map((a) => {
            const meta = TYPE_META[a.type] || TYPE_META.price;
            return (
              <Link
                key={a.id}
                to={`/stock/${a.symbol}`}
                className={`alert-row ${!a.read ? 'alert-row--unread' : ''}`}
                onClick={() => markRead(a.id)}
              >
                <span className={`alert-icon ${meta.className}`}>{meta.icon}</span>
                <div className="alert-row__body">
                  <div className="alert-row__top">
                    <span className="alert-row__symbol">{a.symbol}</span>
                    <span className="alert-row__time">{a.time}</span>
                  </div>
                  <div className="alert-row__title">{a.title}</div>
                  <div className="alert-row__detail">{a.detail}</div>
                </div>
                {!a.read && <span className="alert-row__dot" />}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

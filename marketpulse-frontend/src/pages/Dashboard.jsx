import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MarketSummaryCards from '../components/dashboard/MarketSummaryCards';
import SinceYouLastChecked from '../components/dashboard/SinceYouLastChecked';
import MarketBrief from '../components/dashboard/MarketBrief';
import { SkeletonCard } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/StateViews';
import './Dashboard.css';
import { getDashboard, saveCurrentSnapshot , getSnapshotChanges,} from '../services/api';

function greeting() {
  const h = new Date().getHours();

  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatLastChecked(timestamp) {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return 'just now';
  if (minutes === 1) return '1 minute ago';
  if (minutes < 60) return `${minutes} minutes ago`;

  const hours = Math.floor(minutes / 60);

  if (hours === 1) return '1 hour ago';
  if (hours < 24) return `${hours} hours ago`;

  return new Date(timestamp).toLocaleDateString('en-IN');
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading');
  const navigate = useNavigate();

  function load() {
  setStatus('loading');

  getDashboard()
    .then((d) => {
      setData(d);
      setStatus('ready');
    })
    .catch(() => setStatus('error'));
}

  useEffect(load, []);

  return (
    <div className="page-fade">
      <div className="dash-hero">
        <div>
          <h1 className="dash-hero__title">
            {greeting()}, Aarav
          </h1>

          <p className="dash-hero__subtitle">
            Here's what changed in your market today.
          </p>
        </div>

        <div className="dash-hero__actions">
          <button
            className="btn btn-secondary"
            onClick={() => {
              saveCurrentSnapshot().then(() => {
                load();
              });
            }}
          >
            ✓ Mark as checked
          </button>

          <button
            className="btn btn-primary"
            onClick={() => navigate('/watchlist')}
          >
            + Add stock
          </button>
        </div>
      </div>

      {status === 'ready' && data && (
        <>
          <div className="dash-status-row">
            <span
              className={`dash-status ${
                data.marketStatus.isOpen
                  ? 'dash-status--open'
                  : 'dash-status--closed'
              }`}
            >
              <span className="dash-status__dot" />

              {data.marketStatus.isOpen
                ? 'Market open'
                : 'Market closed'}{' '}
              · {data.marketStatus.session}
            </span>

            <span className="dash-status__updated">
              Last updated {data.marketStatus.lastUpdated}
            </span>
          </div>

          {data.lastCheckedAt && (
            <div className="last-checked">
              🕐 Last checked {formatLastChecked(data.lastCheckedAt)}
            </div>
          )}
        </>
      )}

      {status === 'loading' && (
        <div className="section">
          <div className="summary-grid-skeleton">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} lines={1} />
            ))}
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="card">
          <ErrorState
            description="We couldn't load your dashboard right now."
            onRetry={load}
          />
        </div>
      )}

      {status === 'ready' && data && (
        <>
          <div className="section">
            <MarketSummaryCards
              indices={data.indices}
              needingAttention={data.needingAttention}
              meaningfulChanges={data.meaningfulChanges}
            />
          </div>

          <div className="dash-split">
            <SinceYouLastChecked
              items={data.sinceYouLastChecked}
            />

            <div className="dash-split__side">
              <MarketBrief brief={data.brief} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
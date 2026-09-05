import { useEffect, useState } from 'react';
import { getMarketOverview } from '../services/api';
import ChangeValue from '../components/common/ChangeValue';
import SectorBars from '../components/dashboard/SectorBars';
import GainersLosers from '../components/dashboard/GainersLosers';
import { SkeletonCard } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/StateViews';
import './MarketOverview.css';

export default function MarketOverview() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading');

  function load() {
    setStatus('loading');
    getMarketOverview()
      .then((d) => { setData(d); setStatus('ready'); })
      .catch(() => setStatus('error'));
  }

  useEffect(load, []);

  if (status === 'loading') {
    return (
      <div className="page-fade mo-skeleton">
        {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} lines={2} />)}
      </div>
    );
  }

  if (status === 'error' || !data) {
    return <div className="card"><ErrorState description="Couldn't load market overview." onRetry={load} /></div>;
  }

  return (
    <div className="page-fade">
      <h1 className="mo-title">Market overview</h1>
      <p className="mo-subtitle">Indices, sector performance, and today's biggest movers.</p>

      <div className="mo-indices">
        {data.indices.map((idx) => (
          <div key={idx.symbol} className="mo-index-card">
            <span className="mo-index-card__name">{idx.name}</span>
            <span className="num mo-index-card__value">{idx.value.toLocaleString('en-IN')}</span>
            <ChangeValue value={idx.changePct} />
          </div>
        ))}
      </div>

      <div className="mo-grid">
        <div className="card mo-sector-card">
          <h3 className="mo-sector-card__title">Sector performance</h3>
          <SectorBars sectors={data.sectors} />
        </div>
        <div className="mo-movers">
          <GainersLosers title="Top gainers" items={data.gainers} />
          <GainersLosers title="Top losers" items={data.losers} />
        </div>
      </div>
    </div>
  );
}

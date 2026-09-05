import { useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import './PriceChart.css';

const RANGES = ['1D', '1W', '1M', '3M', '1Y'];

export default function PriceChart({ series, positive }) {
  const [range, setRange] = useState('1M');

  const data = useMemo(() => {
    const counts = { '1D': 12, '1W': 20, '1M': 30, '3M': 60, '1Y': 90 };
    const n = counts[range] || 30;
    return series.slice(-n);
  }, [series, range]);

  const color = positive ? 'var(--green-700)' : 'var(--red-700)';

  return (
    <div className="price-chart">
      <div className="price-chart__ranges">
        {RANGES.map((r) => (
          <button
            key={r}
            className={`price-chart__range-btn ${range === r ? 'price-chart__range-btn--active' : ''}`}
            onClick={() => setRange(r)}
          >
            {r}
          </button>
        ))}
      </div>
      <div className="price-chart__canvas">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.22} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis dataKey="t" hide />
            <YAxis domain={['auto', 'auto']} hide />
            <Tooltip
              contentStyle={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                fontSize: 12,
                fontFamily: 'var(--font-mono)',
              }}
              labelFormatter={() => ''}
              formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Price']}
            />
            <Area type="monotone" dataKey="price" stroke={color} strokeWidth={2} fill="url(#priceFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

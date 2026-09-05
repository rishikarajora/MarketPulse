import { Link } from 'react-router-dom';
import ChangeValue from '../common/ChangeValue';
import SignificanceTag from '../common/SignificanceTag';
import './WatchlistTable.css';

const COLUMNS = [
  { key: 'symbol', label: 'Stock' },
  { key: 'price', label: 'Price' },
  { key: 'dayChange', label: 'Day change' },
  { key: 'changeSinceLastVisit', label: 'Since last visit' },
  { key: 'volume', label: 'Volume' },
  { key: 'significance', label: 'Significance' },
  { key: 'lastUpdated', label: 'Updated' },
];

export default function WatchlistTable({ rows, sortKey, sortDir, onSort, onRemove }) {
  return (
    <div className="wl-table__wrap">
      <table className="wl-table">
        <thead>
          <tr>
            {COLUMNS.map((col) => (
              <th key={col.key}>
                <button className="wl-table__sort" onClick={() => onSort(col.key)}>
                  {col.label}
                  {sortKey === col.key && (
                    <span className="wl-table__sort-arrow">{sortDir === 'asc' ? '↑' : '↓'}</span>
                  )}
                </button>
              </th>
            ))}
            <th aria-label="Status" />
            <th aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {rows.map((s) => (
            <tr key={s.symbol}>
              <td>
                <Link to={`/stock/${s.symbol}`} className="wl-table__symbol-cell">
                  <span className="wl-table__symbol">{s.symbol}</span>
                  <span className="wl-table__name">{s.name}</span>
                </Link>
              </td>
              <td className="num">₹{s.price.toLocaleString('en-IN')}</td>
              <td><ChangeValue value={s.dayChange} /></td>
              <td><ChangeValue value={s.changeSinceLastVisit} /></td>
              <td className="num wl-table__muted">
                {s.volume} <span className="wl-table__ratio">({s.volumeRatio}x)</span>
              </td>
              <td><SignificanceTag label={s.significanceLabel} score={s.significance} compact /></td>
              <td className="wl-table__muted">{s.lastUpdated}</td>
              <td>
                <span className={`wl-table__status wl-table__status--${s.status}`}>
                  <span className="wl-table__status-dot" />
                  {s.status === 'live' ? 'Live' : 'Delayed'}
                </span>
              </td>
              <td>
                <button className="wl-table__remove" onClick={() => onRemove(s.symbol)} aria-label={`Remove ${s.symbol}`}>
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

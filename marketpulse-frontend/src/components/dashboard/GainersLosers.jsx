import { Link } from 'react-router-dom';
import ChangeValue from '../common/ChangeValue';
import './GainersLosers.css';

export default function GainersLosers({ title, items }) {
  return (
    <div className="gl-card">
      <h3 className="gl-card__title">{title}</h3>
      <div className="gl-card__list">
        {items.map((s) => (
          <Link key={s.symbol} to={`/stock/${s.symbol}`} className="gl-row">
            <div>
              <div className="gl-row__symbol">{s.symbol}</div>
              <div className="gl-row__name">{s.name}</div>
            </div>
            <div className="gl-row__right">
              <span className="num gl-row__price">₹{s.price.toLocaleString('en-IN')}</span>
              <ChangeValue value={s.dayChange} size="sm" />
            </div>
          </Link>
        ))}
        {items.length === 0 && <p className="gl-card__empty">No stocks in this list right now.</p>}
      </div>
    </div>
  );
}

import './Timeline.css';

const TYPE_ICON = {
  price: '▲',
  volume: '◆',
  event: '✱',
  sector: '◐',
  market: '○',
};

export default function Timeline({ items }) {
  return (
    <div className="timeline">
      <h3 className="timeline__title">Activity timeline</h3>
      <ol className="timeline__list">
        {items.map((item, i) => (
          <li key={i} className={`timeline__item timeline__item--${item.type}`}>
            <span className="timeline__marker">{TYPE_ICON[item.type] || '○'}</span>
            <div>
              <div className="timeline__time num">{item.time}</div>
              <div className="timeline__label">{item.label}</div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

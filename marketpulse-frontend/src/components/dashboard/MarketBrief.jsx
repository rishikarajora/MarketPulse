import './MarketBrief.css';

export default function MarketBrief({ brief }) {
  if (!brief) return null;
  return (
    <div className="brief">
      <div className="brief__head">
        <span className="brief__spark" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1l1.6 4.4L14 7l-4.4 1.6L8 13l-1.6-4.4L2 7l4.4-1.6L8 1z" fill="var(--green-700)" />
          </svg>
        </span>
        <h3 className="brief__title">Your market brief</h3>
      </div>
      <p className="brief__away">You were away for {brief.awaySpan}.</p>
      <ul className="brief__list">
        {brief.bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
      <div className="brief__foot">Generated from your watchlist's structured signals — not a forecast.</div>
    </div>
  );
}

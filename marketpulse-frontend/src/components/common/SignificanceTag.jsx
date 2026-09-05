import './SignificanceTag.css';

const LEVELS = {
  High: { className: 'sig-high', dot: '●' },
  Medium: { className: 'sig-medium', dot: '●' },
  Low: { className: 'sig-low', dot: '●' },
};

export default function SignificanceTag({ label, score, compact = false }) {
  const level = LEVELS[label] || LEVELS.Low;
  return (
    <span className={`sig-tag ${level.className} ${compact ? 'sig-tag--compact' : ''}`}>
      <span className="sig-tag__dot" aria-hidden="true" />
      {typeof score === 'number' && <span className="num sig-tag__score">{score}</span>}
      <span className="sig-tag__label">{label}</span>
    </span>
  );
}

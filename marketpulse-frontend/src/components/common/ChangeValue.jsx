export default function ChangeValue({ value, suffix = '%', showArrow = true, size = 'md' }) {
  const positive = value >= 0;
  const arrow = positive ? '▲' : '▼';
  const cls = positive ? 'up' : 'down';
  const sizeClass = size === 'lg' ? 'change-lg' : size === 'sm' ? 'change-sm' : 'change-md';
  return (
    <span className={`num ${cls} ${sizeClass}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
      {showArrow && <span style={{ fontSize: '0.7em' }}>{arrow}</span>}
      {positive ? '+' : ''}{value.toFixed(2)}{suffix}
    </span>
  );
}

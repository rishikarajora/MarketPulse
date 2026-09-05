import './Skeleton.css';

export default function Skeleton({ width = '100%', height = 16, radius = 4, style = {} }) {
  return (
    <span
      className="skeleton-block"
      style={{ width, height, borderRadius: radius, ...style }}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="skeleton-card">
      <Skeleton width="40%" height={14} />
      <div style={{ height: 12 }} />
      <Skeleton width="65%" height={22} />
      <div style={{ height: 14 }} />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} style={{ marginBottom: 8 }}>
          <Skeleton width={`${85 - i * 12}%`} height={10} />
        </div>
      ))}
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="skeleton-row">
      <Skeleton width={110} height={12} />
      <Skeleton width={70} height={12} />
      <Skeleton width={70} height={12} />
      <Skeleton width={70} height={12} />
      <Skeleton width={90} height={12} />
    </div>
  );
}

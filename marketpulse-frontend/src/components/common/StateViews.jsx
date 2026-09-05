import './StateViews.css';

export function EmptyState({ icon = '◇', title, description, actionLabel, onAction }) {
  return (
    <div className="state-view">
      <div className="state-view__icon">{icon}</div>
      <h3 className="state-view__title">{title}</h3>
      {description && <p className="state-view__desc">{description}</p>}
      {actionLabel && (
        <button className="btn btn-primary" onClick={onAction}>{actionLabel}</button>
      )}
    </div>
  );
}

export function ErrorState({ title = 'Something went wrong', description, onRetry }) {
  return (
    <div className="state-view state-view--error">
      <div className="state-view__icon">!</div>
      <h3 className="state-view__title">{title}</h3>
      {description && <p className="state-view__desc">{description}</p>}
      {onRetry && (
        <button className="btn btn-secondary" onClick={onRetry}>Retry</button>
      )}
    </div>
  );
}

export function StaleBanner({ lastUpdated = 'a few minutes ago' }) {
  return (
    <div className="stale-banner">
      <span className="stale-banner__dot" />
      Data delayed — updated {lastUpdated}
    </div>
  );
}
